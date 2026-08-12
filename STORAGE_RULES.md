# Règles Firebase Storage — otaku225

Accédez à **Firebase Console > Storage > Règles**, remplacez tout, puis **Publier**.

> ⚠️ Les validations de `src/lib/firebase/storage.ts` (taille 5 Mo, formats JPEG/PNG/WebP)
> s'exécutent dans le navigateur : elles sont contournables en une requête directe.
> Ces règles rejouent les mêmes contrôles **côté serveur**, là où ils comptent vraiment.

```firebase
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ─────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // 5 Mo maximum — même limite que MAX_SIZE dans storage.ts
    function tailleValide() {
      return request.resource.size <= 5 * 1024 * 1024;
    }

    // Formats acceptés — même liste que allowedMimeTypes dans storage.ts
    function imageValide() {
      return request.resource.contentType in [
        'image/jpeg',
        'image/png',
        'image/webp'
      ];
    }

    // ─────────────────────────────────────────────────────────
    // 🖼️ AVATARS  →  avatars/{userId}/{fichier}
    // ─────────────────────────────────────────────────────────
    match /avatars/{userId}/{fileName} {
      // Les avatars sont publics : ils s'affichent dans le feed
      allow read: if true;

      // Seul le propriétaire écrit dans SON dossier
      allow write: if isOwner(userId)
        && tailleValide()
        && imageValide();

      allow delete: if isOwner(userId);
    }

    // ─────────────────────────────────────────────────────────
    // 📸 MÉDIAS DES POSTS  →  posts/{userId}/{fichier}
    // ─────────────────────────────────────────────────────────
    match /posts/{userId}/{fileName} {
      allow read: if isSignedIn();

      allow write: if isOwner(userId)
        && request.resource.size <= 10 * 1024 * 1024
        && (
          imageValide()
          || request.resource.contentType in ['video/mp4', 'video/webm']
        );

      allow delete: if isOwner(userId);
    }

    // ─────────────────────────────────────────────────────────
    // ❌ DEFAULT DENY
    // ─────────────────────────────────────────────────────────
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🧨 Ce que ça ferme

| Faille | Avant | Maintenant |
|---|---|---|
| Upload dans le dossier d'autrui | aucune règle de chemin | `avatars/{userId}` réservé à son propriétaire |
| Contournement de la limite 5 Mo | vérifiée côté client seulement | `request.resource.size` côté serveur |
| Upload de n'importe quel type de fichier | vérifié côté client seulement | `contentType` en liste blanche |
| Suppression du média d'un autre | `deleteAvatar` accepte n'importe quelle URL | `allow delete` limité au propriétaire |

## ⚠️ À vérifier avant de publier

Le chemin des médias de post est supposé `posts/{userId}/{fichier}`. **Confirme le chemin réel utilisé à l'upload** avant de publier ces règles, sinon la création de post cassera avec `storage/unauthorized`.

Autre point : `deleteAvatar` reconstruit un chemin depuis l'URL fournie
([storage.ts:150-153](src/lib/firebase/storage.ts#L150-L153)). Avec ces règles, tenter de
supprimer le fichier d'un autre échouera côté serveur — l'erreur est déjà avalée par le
`catch` en `console.warn`, donc aucune régression visible.
