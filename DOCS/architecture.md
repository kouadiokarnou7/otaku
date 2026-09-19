# NETAKAMA — Architecture & Design System

Ce document décrit les choix d'architecture frontend et le système de design mis en place pour NETAKAMA.

## 1. Stack Technique

- **Framework :** Next.js 14+ (App Router)
- **Langage :** TypeScript (strict)
- **Style :** Tailwind CSS
- **Icônes :** Lucide React
- **Animations :** Framer Motion
- **Gestion des formulaires :** React Hook Form + Zod
- **Backend / BDD :** Firebase (Auth, Firestore, Storage)

## 2. Design System

L'interface de NETAKAMA repose sur des variables sémantiques Tailwind pour assurer un rendu cohérent et supporter nativement les thèmes (Clair / Sombre).

### Couleurs sémantiques (définies dans `globals.css`)
- `bg-background` : Couleur de fond principale de l'application.
- `bg-card` / `bg-surface` : Couleur de fond des éléments surélevés (cartes, modales, header).
- `text-foreground` : Couleur du texte principal.
- `text-muted-foreground` : Couleur du texte secondaire ou descriptif.
- `border-border` : Couleur des bordures et séparateurs.

### Couleur d'Accentuation
- **Orange NETAKAMA (`#FF3E00`)** : Utilisée pour les call-to-actions principaux, les liens actifs, les bordures de focus et les éléments distinctifs de la marque.

### Typographie
- **Font principale :** Inter ou Roboto (via variables CSS `--font-sans`).
- **Font display :** Utilisée pour les titres très marqués (ex: Logo, Titre du Hero).
- **Tailles :** L'interface privilégie des textes petits et denses (`text-xs`, `text-sm`) typiques des applications modernes.

## 3. Structure des Composants

L'application est divisée en plusieurs couches fonctionnelles :

### Layouts
- **`(auth)` :** Pages liées à l'authentification (`/login`, `/register`). Utilisent `AuthBackground` (étoiles, particules, Kanjis).
- **`(main)` :** Application principale (`/feed`, `/profile`, `/search`, `/settings`). Utilisent un layout avec `TopBar`, `Sidebar`, `BottomBar` (mobile) et `MobileHeader`.

### Composants UI partagés
- **`InputField` :** Champ de formulaire unifié avec gestion des erreurs Zod.
- **Boutons :** Tous les boutons interactifs utilisent `framer-motion` (`whileHover`, `whileTap`) pour offrir des micro-interactions fluides.

## 4. Gestion d'État et Hooks

NETAKAMA utilise une architecture basée sur des hooks personnalisés pour encapsuler la logique métier :

- `useAuth()` : Gère l'état de l'utilisateur Firebase.
- `useProfile()` : Gère la lecture et la mise à jour du profil utilisateur dans Firestore.
- `usePost()` : Gère le fil d'actualité (création, lecture, likes).
- `useAnimeSearch()` : Gère la recherche et la récupération des données de l'API Jikan (MyAnimeList).

## 5. Bonnes Pratiques

1. **Pas de CSS inline :** Tous les styles doivent utiliser les classes utilitaires de Tailwind.
2. **Support des thèmes :** Ne jamais coder de couleurs en dur (ex: `#fff` ou `gray-900`) pour les fonds et les textes. Toujours utiliser les variables sémantiques.
3. **Documentation :** Toutes les fonctions et composants principaux doivent être documentés avec la syntaxe JSDoc.
4. **Composants côté client :** Les composants interactifs (`useState`, `onClick`, `framer-motion`) doivent inclure la directive `"use client"`.
