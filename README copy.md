# 📁 Architecture Profil — Otaku Social

## Structure complète

```
src/
├── app/
│   └── profile/
│       └── page.tsx                  ← Orchestrateur principal
│
├── components/
│   ├── profile/
│   │   ├── ProfileHeader.tsx         ← Header + bouton déconnexion
│   │   ├── AvatarSection.tsx         ← Avatar + upload + nom
│   │   ├── ProfileForm.tsx           ← Formulaire complet (éd/lecture)
│   │   ├── FormField.tsx             ← Champ générique (input/textarea/readonly)
│   │   └── ProfileActions.tsx        ← Stats bar + boutons CTA
│   └── ui/
│       ├── Button.tsx                ← Bouton réutilisable (4 variants)
│       ├── Input.tsx                 ← Input + Textarea + ReadonlyField
│       └── Message.tsx               ← Feedback animé (success/error)
│
├── hooks/
│   ├── useAuth.ts                    ← ✅ Déjà existant
│   └── useProfile.ts                 ← Logique métier profil (Firestore + Storage)
│
└── lib/
    ├── firebase/
    │   ├── firebaseconfig.ts         ← ✅ Déjà existant
    │   └── storage.ts                ← Upload/delete avatar
    ├── types/
    │   └── profile.ts                ← Interfaces partagées
    └── utils.ts                      ← cn() helper (clsx + tailwind-merge)
```

## 📦 Dépendances à installer

```bash
npm install clsx tailwind-merge
```

## 🚀 Ce que chaque fichier fait

| Fichier | Responsabilité |
|---|---|
| `page.tsx` | Assemble tous les composants, gère les guards |
| `ProfileHeader.tsx` | Logo + titre + bouton déconnexion |
| `AvatarSection.tsx` | Avatar avec fallback initiale, glow ring, upload |
| `ProfileForm.tsx` | Coordonne les champs du formulaire |
| `FormField.tsx` | Champ intelligent (mode lecture ↔ édition) |
| `ProfileActions.tsx` | Stats (animés/followers/posts) + boutons Modifier/Enregistrer |
| `Button.tsx` | Bouton réutilisable (primary/secondary/ghost/danger) |
| `Input.tsx` | Input, Textarea, ReadonlyField stylisés |
| `Message.tsx` | Toast animé auto-dismiss (succès/erreur) |
| `useProfile.ts` | Toute la logique : fetch, upload, submit, cancel |
| `storage.ts` | uploadAvatar() et deleteAvatar() Firebase |
| `profile.ts` | Types TypeScript partagés |
| `utils.ts` | cn() = clsx + tailwind-merge |

## ✅ Fonctionnalités

- [x] Chargement initial depuis Firestore
- [x] Mode lecture / mode édition toggle
- [x] Upload avatar vers Firebase Storage
- [x] Preview avant upload
- [x] Mise à jour Firebase Auth (displayName + photoURL)
- [x] Mise à jour Firestore (bio, phone, updatedAt)
- [x] Stats : animés vus, followers, following, posts
- [x] Feedback animé avec auto-dismiss
- [x] Skeleton de chargement
- [x] Responsive mobile-first (375px → desktop)
- [x] Dark theme Otaku Social
- [x] Déconnexion via useAuth existant

## 🔌 Connecter les vraies stats

Dans `useProfile.ts`, les stats sont lues depuis Firestore `/users/{uid}.stats`.
Pour les alimenter, incrémente ce champ à chaque action :

```ts
// Quand un anime est ajouté à la watchlist :
await updateDoc(doc(db, "users", uid), {
  "stats.animesCount": increment(1)
});
```