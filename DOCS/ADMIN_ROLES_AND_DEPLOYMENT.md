# 🛡️ Guide d'Administration & Gestion des Rôles (Local & Production)

Ce document détaille l'architecture des rôles, la résolution des erreurs de permissions (`PERMISSION_DENIED`), et les bonnes pratiques pour gérer les accès administrateurs en **local (développement)** et en **production**.

---

## 📌 1. Pourquoi l'erreur `PERMISSION_DENIED` survient-elle ?

Otaku225 est une application Next.js connectée directement à Firebase Cloud Firestore sans serveur intermédiaire pour les requêtes courantes.

Dans cette architecture *Zero-Trust* :
1. Le client web communique directement avec Firestore via le SDK JavaScript.
2. Tout utilisateur lambda pourrait tenter de modifier son document Firestore pour s'octroyer `role: "admin"`.
3. Par conséquent, les règles de sécurité ([`firestore.rules`](file:///c:/Users/HP/Desktop/otaku225/firestore.rules)) **interdisent formellement** à un utilisateur normal de modifier le champ `role`.

> ⚠️ **Conséquence directe** : Si les règles sur les serveurs Google Firebase n'autorisent pas explicitement la création du compte administrateur, Firestore rejette immédiatement la requête avec l'erreur :
> `Code: 7 PERMISSION_DENIED: Missing or insufficient permissions.`

---

## 💻 2. Gestion en Environnement Local (Développement)

En local, l'objectif est de pouvoir tester rapidement le cockpit d'administration, valider les mangas des mangakas et gérer les prix en FCFA sans friction.

### 2.1 Configuration des identifiants dans `.env`
Le fichier `.env` à la racine définit les identifiants utilisés par les scripts d'administration :
```env
Next_PUBLIC_EMAIL=alexandreroxkia@gmail.com
NEXT_PUBLIC_MDP=VotreMotDePasseSecret225!
```

### 2.2 Règles de sécurité autorisant l'administration (`firestore.rules`)
Dans [`firestore.rules`](file:///c:/Users/HP/Desktop/otaku225/firestore.rules), une clause autorise explicitement les administrateurs désignés :

```firestore
// Helper vérifiant si l'utilisateur est admin
function isAdmin() {
  return isSignedIn() && (
    request.auth.token.email in ['admin@otaku225.ci', 'alexandreroxkia@gmail.com', 'ppmoi@gmail.com'] ||
    (exists(/databases/$(database)/documents/users/$(request.auth.uid))
    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
  );
}

match /users/{userId} {
  allow read: if isSignedIn();

  // Création autorisée avec rôle admin uniquement pour les emails autorisés
  allow create: if isOwner(userId)
    && request.resource.data.uid == userId
    && (
      !('role' in request.resource.data) ||
      request.resource.data.role == 'user' ||
      request.auth.token.email in ['admin@otaku225.ci', 'alexandreroxkia@gmail.com', 'ppmoi@gmail.com']
    );

  // Mise à jour de rôle réservée aux administrateurs
  allow update: if (
      isOwner(userId)
      && !affected().hasAny(['role', 'uid', 'createdAt'])
    ) || isAdmin();
}
```

### 2.3 Les commandes disponibles en local

| Commande | Rôle |
|---|---|
| `npm run deploy:rules` | Compile et envoie les règles locales vers le projet Firebase Cloud (`otaku-tesy`). |
| `npm run create-admin` | Crée ou met à jour le compte admin Firebase Auth + Firestore avec `role: "admin"`. |
| `npm run reset-user` | Rétrograde un compte (ex: `bTPkElIRXKRu8D81gT2bwNxYaDJ2`) en simple `role: "user"`. |

### 2.4 Workflow d'accès en local
1. Si les règles changent : `npm run deploy:rules`.
2. Initialiser/actualiser l'admin : `npm run create-admin`.
3. Se connecter sur [http://localhost:3000/login](http://localhost:3000/login).
4. Accéder à l'Espace Admin :
   - Soit via le menu avatar en haut à droite : **« 🛡️ Espace Admin »**.
   - Soit sur la page [Mon Profil](file:///c:/Users/HP/Desktop/otaku225/src/app/(main)/profile/page.tsx) : bandeau doré.
   - Soit par URL directe : [http://localhost:3000/admin/content](http://localhost:3000/admin/content).

---

## 🚀 3. Gestion en Environnement de Production

En production (ex: Vercel, Firebase Hosting, Cloud Run), **les règles de sécurité doivent être encore plus strictes**.

### 🔒 Règle n°1 : Sécuriser les variables d'environnement
> ⛔ **NE JAMAIS** mettre le mot de passe d'administration sous un préfixe `NEXT_PUBLIC_*` en production !
> Toute variable préfixée par `NEXT_PUBLIC_` est visible dans le code source du bundle JavaScript par n'importe quel internaute.

En production, stockez uniquement des secrets côté serveur :
- Sur Vercel : *Settings > Environment Variables >* variable `ADMIN_SETUP_SECRET` (sans `NEXT_PUBLIC_`).

---

### 🌟 Méthode 1 (Recommandée pour la Production) : Les Firebase Custom Claims

La méthode standard préconisée par Google Firebase pour la production consiste à injecter une propriété `admin: true` directement dans le **token JWT sécurisé** de l'utilisateur via le SDK Firebase Admin (Node.js côté serveur).

#### Avantages :
- **Ultra-rapide** : `request.auth.token.admin == true` ne coûte **aucune lecture** Firestore dans les règles de sécurité.
- **Inviolable** : Le token est signé cryptographiquement par les serveurs Google et impossible à falsifier côté client.

#### Étape A : Règle Firestore en production
```firestore
function isAdmin() {
  return isSignedIn() && request.auth.token.admin == true;
}
```

#### Étape B : Script d'élévation admin en production (`scripts/set-admin-claim.mjs`)
Ce script s'exécute côté serveur ou sur votre machine avec une clé de service privée :

```javascript
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  await admin.firestore().collection("users").doc(user.uid).set({
    role: "admin"
  }, { merge: true });
  console.log(`✅ ${email} est désormais administrateur avec Custom Claims !`);
}

setAdminRole("direction@otaku225.ci");
```

---

### 🌐 Méthode 2 : Whitelist via Firestore Rules (Déploiement CI/CD)

Si vous conservez la méthode par whitelist d'emails :

1. **Déclarer les emails des fondateurs/administrateurs** dans `firestore.rules` :
   ```firestore
   function isAdmin() {
     return isSignedIn() && (
       request.auth.token.email in [
         'alexandreroxkia@gmail.com',
         'admin@otaku225.ci'
       ] ||
       (exists(/databases/$(database)/documents/users/$(request.auth.uid))
       && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
     );
   }
   ```

2. **Automatiser le déploiement des règles dans GitHub Actions** :
   Créez le workflow `.github/workflows/firebase-deploy.yml` :
   ```yaml
   name: Deploy Firestore Rules

   on:
     push:
       branches:
         - main
       paths:
         - 'firestore.rules'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm install -g firebase-tools
         - run: firebase deploy --only firestore:rules --project ${{ secrets.FIREBASE_PROJECT_ID }} --token ${{ secrets.FIREBASE_TOKEN }}
   ```

---

## 📋 4. Checklist pour la Mise en Production

- [ ] **Déployer les règles Firestore** sur le projet Firebase de production :
  ```bash
  firebase use <PROD_PROJECT_ID>
  firebase deploy --only firestore:rules
  ```
- [ ] **Créer le compte Administrateur de production** directement depuis la Firebase Console (*Authentication > Add User*).
- [ ] **Attribuer le rôle `role: "admin"`** dans la collection `users` pour cet UID dans la console Firestore.
- [ ] **Vérifier le Guard d'accès** : [`useAdminGuard.ts`](file:///c:/Users/HP/Desktop/otaku225/src/lib/hooks/store/auth/useAdminGuard.ts) bloque automatiquement toute personne dont le document Firestore ne contient pas `role: "admin"`.
- [ ] **Tester le flux avec deux comptes** :
  1. Compte lecteur : redirection automatique de `/admin` vers `/feed`.
  2. Compte administrateur : accès direct au cockpit de validation des mangas sur `/admin/content`.

---

## ❓ 5. Dépannage & FAQ

#### Q : Pourquoi mon compte admin est redirigé vers `/feed` après la connexion ?
- Vérifiez dans Firestore que le document `users/{votre_uid}` contient bien le champ string `role: "admin"`.
- Si vous venez de modifier le rôle, déconnectez-vous puis reconnectez-vous pour actualiser la session dans l'application.

#### Q : Pourquoi `PERMISSION_DENIED` réapparaît après une modification des règles ?
- Dès que vous modifiez le fichier local [`firestore.rules`](file:///c:/Users/HP/Desktop/otaku225/firestore.rules), les changements ne sont actifs qu'après avoir exécuté :
  ```powershell
  npm run deploy:rules
  ```
- Les règles déployées sont consultables et testables à tout moment dans la **Console Firebase > Firestore > Règles**.
