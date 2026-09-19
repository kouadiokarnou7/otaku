# 🎌 Nekama - Cahier des Charges & Spécifications de Conception

Ce document regroupe l'intégralité des spécifications fonctionnelles, de conception graphique, d'architecture technique et de planification pour le projet **Nekama** (Next.js + Firebase).

---

## 1. VISION & STRATÉGIE PRODUIT
* **Vision** : Bâtir le hub otaku de poche de référence pour l'Afrique de l'Ouest, mêlant utilitaire (tracker d'épisodes, alertes push PWA) et social (forum, quiz).
* **MVP** : Focus strict sur 3 piliers : forum ultra-simple, tracker d'épisodes fonctionnel avec notifications PWA, et un module de quiz ludique.

---

## 2. SPÉCIFICATIONS DES INTERFACES (SCREENS)

### 📱 Interfaces Utilisateur (User)
1. **Landing Page** : Hero section animée (particules, kanji), section "Événements à Venir" locale, boutons de conversion "Se connecter" et "Rejoindre".
2. **Wizard d'Inscription** : Multi-étapes (Étape 1 : Email ; Étape 2 : Identifiants, mot de passe, avatar optionnel) pour maximiser le taux de conversion sur mobile.
3. **Flux Principal / Forum** : Publication, likes/réactions, commentaires.
4. **Tracker d'Anime** : Recherche Jikan, Watchlist triée, suivi de progression d'épisodes.
5. **Quiz** : Liste des quiz, questionnaires interactifs, score et historique.
6. **Profil** : Statistiques otaku (animes suivis, score quiz) et posts de l'utilisateur.

### 🛠️ Interfaces d'Administration (Admin)
1. **Dashboard** : Statistiques générales et modération rapide.
2. **Espace de Modération** : Traitement des signalements sur le forum.
3. **Gestionnaire des Sorties & Simulations** : Bouton pour simuler la sortie d'un épisode d'un anime et déclencher l'envoi de la notification push FCM aux abonnés.
4. **Éditeur de Quiz** : Formulaires de création de quiz et de saisie de QCM.

---

## 🎨 3. DESIGN SYSTEM & SPÉCIFICATIONS VISUELLES (Étape 6)
Le design s'appuie sur une esthétique **Glassmorphism Sombre** :

### Typographies
- **Headings (Titres)** : *Sora* (très gras, espacement resserré pour un look éditorial moderne).
- **Body & Labels (Textes)** : *Hanken Grotesk* (très lisible, interligne généreuse sur fond sombre).

### Couleurs
- **Background Base** : Noir charbon profond (`#050508`).
- **Accent Primaire** : Orange Otaku (`#FF6B1A`) pour les boutons principaux et états actifs.
- **Accent Secondaire** : Bleu Cyan électrique (`#00D4FF`) pour les liens secondaires et statuts.
- **Accent Tertiaire** : Violet sombre (`#9B59B6`) pour les halos lumineux en arrière-plan.

### Effets & Formes
- **Surfaces** : Translucides sombres (`rgba(255, 255, 255, 0.03)`), flou arrière-plan important (`backdrop-blur-xl`), bordures fines (`1px solid rgba(255, 255, 255, 0.07)`).
- **Angles** : Angles adoucis (`rounded-2xl` soit `16px`) pour les cartes et conteneurs principaux ; boutons et inputs sous forme de capsules (`rounded-full`).

---

## 💻 4. ARCHITECTURE TECHNIQUE (Étape 7)

### Technologie Stack
- **Frontend** : Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion.
- **Backend & Database** : Firebase Cloud Firestore (temps réel, stockage des posts, watchlists et profils).
- **Authentification** : Firebase Authentication (Email/Mot de passe et Google OAuth).
- **Stockage** : Firebase Storage (images des posts, photos de profil).
- **Notifications Push** : Service Worker local + Firebase Cloud Messaging (FCM) avec abonnements à des topics par anime (ex: `/topics/anime_12345`).
- **Données d'animes** : API MAL gratuite via l'API Jikan.

---

## 📅 5. PLAN DE DÉVELOPPEMENT & SPRINTS (Étape 8)

### Sprint 1 : Socle technique & Inscription Wizard (Actuel)
- Refonte de la Landing Page simplifiée.
- Implémentation du Wizard d'Inscription multi-étapes réactif.
- Ajout systématique de documentation JSDoc pour les fonctions modifiées.

### Sprint 2 : Forum Simplifié & Profils
- Écriture des hooks Firestore pour la création, lecture, suppression de posts.
- Gestion des likes et commentaires.
- Rendu des profils utilisateurs avec leurs publications.

### Sprint 3 : Anime Tracker & Watchlist
- Écran de recherche Jikan et fiches d'animes.
- Bibliothèque utilisateur (watchlist) stockée dans Firestore.
- Cases à cocher des épisodes avec calcul de progression.

### Sprint 4 : Notifications Push PWA & Simulation Admin
- Enregistrement du Service Worker PWA avec Firebase Messaging.
- Demande d'autorisation de notifications à l'utilisateur.
- Interface d'administration pour "Simuler la sortie d'un épisode" et émettre la push FCM.

### Sprint 5 : Module de Quiz & Backoffice Quiz
- Création du module de passage de quiz (QCM).
- Stockage du score dans Firestore et affichage.
- Éditeur de quiz d'administration (créer questions/réponses).

### Sprint 6 : PWA & Déploiement
- Configuration du Manifest PWA, icônes d'installation mobile.
- Support hors-ligne basique.
- Déploiement sur Firebase Hosting ou Vercel.
