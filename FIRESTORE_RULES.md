# Règles Firestore — otaku225

Accédez à **Firebase Console > Firestore > Règles**, remplacez tout, puis **Publier**.

> ⚠️ Ces règles sont la **seule** frontière de sécurité du projet : otaku225 n'a pas de
> serveur, le client parle directement à Firestore. Toute vérification faite dans un
> composant React est du confort d'affichage, pas de la sécurité.

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    // Le rôle est lu depuis le document utilisateur.
    // Il ne peut PAS être modifié par l'utilisateur (voir /users ci-dessous),
    // donc cette lecture est fiable.
    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Clés RÉELLEMENT modifiées par cette écriture.
    // ⚠️ Ne jamais utiliser request.resource.data.keys() pour ça :
    // request.resource.data est le document APRÈS écriture (fusionné),
    // pas le delta. C'était le bug des anciennes règles.
    function affected() {
      return request.resource.data.diff(resource.data).affectedKeys();
    }

    // ─────────────────────────────────────────────────────────
    // 👤 USERS
    // ─────────────────────────────────────────────────────────
    match /users/{userId} {
      allow read: if isSignedIn();

      // À l'inscription : rôle forcé à 'user'.
      // Empêche de se créer directement un compte admin.
      allow create: if isOwner(userId)
        && request.resource.data.uid == userId
        && request.resource.data.role == 'user';

      // L'utilisateur édite son profil, JAMAIS son rôle ni ses stats.
      // Sans ça : auto-promotion admin + XP/niveaux/badges falsifiables.
      allow update: if (
          isOwner(userId)
          && !affected().hasAny(['role', 'stats', 'uid', 'createdAt'])
        ) || isAdmin();

      allow delete: if isAdmin();
    }

    // ─────────────────────────────────────────────────────────
    // 📝 POSTS
    // ─────────────────────────────────────────────────────────
    match /posts/{postId} {
      allow read: if isSignedIn();

      allow create: if isSignedIn()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.content is string
        && request.resource.data.content.size() <= 5000
        && request.resource.data.metadata.createdAt == request.time
        && request.resource.data.stats.likes == 0
        && request.resource.data.stats.comments == 0
        && request.resource.data.stats.shares == 0;

      // 1) L'auteur édite son post — mais ne touche ni à l'auteur ni aux compteurs.
      allow update: if isOwner(resource.data.uid)
        && !affected().hasAny(['uid', 'stats']);

      // 2) N'importe qui peut faire varier stats.likes de EXACTEMENT ±1.
      //    Compatible avec increment(1) / increment(-1) côté client.
      //    Empêche de mettre le compteur à 999999 ou à 0.
      allow update: if isSignedIn()
        && affected().hasOnly(['stats'])
        && request.resource.data.stats.comments == resource.data.stats.comments
        && request.resource.data.stats.shares == resource.data.stats.shares
        && (
             request.resource.data.stats.likes == resource.data.stats.likes + 1
          || request.resource.data.stats.likes == resource.data.stats.likes - 1
        );

      // 3) Idem pour le compteur de commentaires.
      allow update: if isSignedIn()
        && affected().hasOnly(['stats'])
        && request.resource.data.stats.likes == resource.data.stats.likes
        && request.resource.data.stats.shares == resource.data.stats.shares
        && (
             request.resource.data.stats.comments == resource.data.stats.comments + 1
          || request.resource.data.stats.comments == resource.data.stats.comments - 1
        );

      allow delete: if isOwner(resource.data.uid) || isAdmin();

      // ── Likes : 1 document par utilisateur ──
      match /likes/{likeId} {
        allow read: if isSignedIn();
        allow create: if isSignedIn()
          && request.resource.data.uid == request.auth.uid
          && request.resource.data.createdAt == request.time;
        allow delete: if isOwner(resource.data.uid);
      }

      // ── Sauvegardes : privées ──
      match /saves/{saveId} {
        allow read: if isOwner(resource.data.uid);
        allow create: if isSignedIn()
          && request.resource.data.uid == request.auth.uid
          && request.resource.data.savedAt == request.time;
        allow delete: if isOwner(resource.data.uid);
      }
    }

    // ─────────────────────────────────────────────────────────
    // 💬 COMMENTAIRES (collection RACINE)
    // Le code écrit dans collection(db, "comments") avec un champ postId.
    // Ces règles collent à ce que fait usePost.addComment.
    // ─────────────────────────────────────────────────────────
    match /comments/{commentId} {
      allow read: if isSignedIn();

      allow create: if isSignedIn()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.postId is string
        && request.resource.data.content is string
        && request.resource.data.content.size() > 0
        && request.resource.data.content.size() <= 2000
        && request.resource.data.createdAt == request.time
        && request.resource.data.likes == 0;

      allow update: if isOwner(resource.data.uid)
        && !affected().hasAny(['uid', 'postId', 'createdAt']);

      allow delete: if isOwner(resource.data.uid) || isAdmin();
    }

    // ─────────────────────────────────────────────────────────
    // 🔔 NOTIFICATIONS
    // ─────────────────────────────────────────────────────────
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.userId);

      // L'expéditeur ne peut pas usurper une identité :
      // fromUid est obligatoirement le compte authentifié.
      allow create: if isSignedIn()
        && request.resource.data.fromUid == request.auth.uid
        && request.resource.data.userId is string
        && request.resource.data.userId != request.auth.uid
        && request.resource.data.createdAt == request.time;

      // Le destinataire ne peut que marquer comme lu.
      allow update: if isOwner(resource.data.userId)
        && affected().hasOnly(['read']);

      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }

    // ─────────────────────────────────────────────────────────
    // ❌ DEFAULT DENY
    // ─────────────────────────────────────────────────────────
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🔑 Créer le premier admin

`isAdmin()` lit `users/{uid}.role`, et **aucune règle ne permet d'écrire ce champ**. La promotion se fait donc uniquement à la main :

1. Firebase Console > Firestore Database
2. Collection `users` > document de l'utilisateur
3. Champ `role` → passer de `"user"` à `"admin"`

C'est volontaire : si l'application pouvait promouvoir un admin, un attaquant le pourrait aussi.

## 🧨 Failles fermées par cette version

| Faille | Avant | Maintenant |
|---|---|---|
| Auto-promotion admin | `allow write` sur tout le doc user | `role` interdit à l'écriture |
| XP / niveaux / badges falsifiables | idem | `stats` interdit à l'écriture |
| Compteur de likes arbitraire | n'importe quelle valeur | delta de ±1 obligatoire |
| Usurpation de notification | `allow create: if request.auth != null` | `fromUid == request.auth.uid` |
| Commentaires bloqués | collection racine non couverte → default-deny | règles alignées sur le code |
| Suppression de post par un tiers | auteur uniquement | auteur **ou** admin (modération) |

## ⚠️ Ce que ces règles ne font pas

- **Pas de rate limiting.** Un compte peut spammer commentaires et notifications. Ça se traite avec des Cloud Functions ou App Check, pas avec des rules.
- **`isAdmin()` coûte une lecture** par évaluation de règle. Acceptable au volume actuel ; si ça devient chaud, passer aux **custom claims** (`request.auth.token.admin`), qui sont gratuits mais exigent le Admin SDK.
- **Le like reste manipulable à la marge** : un client peut envoyer +1 sans créer le document `likes` correspondant. Un contrôle croisé nécessiterait une Cloud Function.

## 📋 Champs attendus par le code

- Posts : `uid` (pas `userId`), `metadata.createdAt` en `serverTimestamp()`
- Commentaires : `uid`, `postId`, `createdAt` en `serverTimestamp()`, `likes: 0`
- Notifications : `userId` (destinataire), `fromUid` (émetteur), `createdAt` en `serverTimestamp()`