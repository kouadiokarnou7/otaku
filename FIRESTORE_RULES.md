# Règles Firestore Optimisées

Accédez à **Firebase Console > Firestore > Règles** et remplacez les règles par :

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 👤 USERS - Profils utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 📝 POSTS (feed principal)
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.metadata.createdAt is timestamp
        && request.resource.data.content is string;
      
      allow update: if request.auth != null 
        && resource.data.uid == request.auth.uid
        && !('uid' in request.resource.data); // Empêche de changer l'auteur
      
      allow delete: if request.auth != null 
        && resource.data.uid == request.auth.uid;

      // Sous-collections
      match /comments/{commentId} {
        allow read: if request.auth != null;
        
        allow create: if request.auth != null
          && request.resource.data.uid == request.auth.uid
          && request.resource.data.createdAt is timestamp
          && request.resource.data.content is string;
        
        allow update: if request.auth != null 
          && resource.data.uid == request.auth.uid
          && !('uid' in request.resource.data);
        
        allow delete: if request.auth != null 
          && (resource.data.uid == request.auth.uid || 
              get(/databases/$(database)/documents/posts/$(postId)).data.uid == request.auth.uid);
      }

      match /likes/{likeId} {
        allow read: if request.auth != null;
        
        allow create: if request.auth != null
          && request.auth.uid == request.resource.data.uid
          && request.resource.data.createdAt is timestamp;
        
        allow delete: if request.auth != null 
          && resource.data.uid == request.auth.uid;
      }

      match /saves/{saveId} {
        allow read: if request.auth != null && resource.data.uid == request.auth.uid;
        
        allow create: if request.auth != null
          && request.auth.uid == request.resource.data.uid
          && request.resource.data.savedAt is timestamp;
        
        allow delete: if request.auth != null 
          && resource.data.uid == request.auth.uid;
      }
    }

    // 🔔 NOTIFICATIONS
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // ❌ Default deny - Tout le reste est refusé
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Étapes de Configuration :
1. Ouvrir [Firebase Console](https://console.firebase.google.com)
2. Sélectionner votre projet **otaku-tesy**
3. Aller à **Firestore Database > Règles**
4. Copier/coller les règles ci-dessus
5. Cliquer sur **Publier**

## ⚠️ Points Importants :

### Changements Apportés:
- ✅ **Collections imbriquées** : comments, likes, saves directement sous chaque post
- ✅ **Validations strictes** : timestamps obligatoires, types de données vérifiés
- ✅ **Permissions précises** : lecture/écriture/suppression basées sur l'auteur
- ✅ **Sécurité renforcée** : on vérifie l'authenticité de l'utilisateur

### Champs à Utiliser dans le Code:
- Posts: utiliser `uid` (pas `userId`)
- Metadata: `createdAt` doit être un **timestamp serveur**
- Comments: `uid` pour l'auteur

---
