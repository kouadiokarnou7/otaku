# 🎨 Spécification Globale du Design System (Nekama — Phase 2 : Maya)

Ce document présente la refonte complète de la direction artistique de **Nekama**. Le concept retenu s'appelle **"Cyber-Shinto & Neon Mysticism"**, un croisement entre les traditions mystiques japonaises et le cyberpunk mobile-first.

---

## 1. DIRECTION ARTISTIQUE : Cyber-Shinto & Neon Mysticism

### L'Esprit
Fusionner l'ambiance calme et sacrée des sanctuaires traditionnels japonais (structures épurées, matières légères, symboles spirituels) avec l'énergie brute, sombre et électrique du cyberpunk moderne (fonds profonds, lueurs néon intenses, contrastes saisissants).

### Palette de Couleurs (Hex & HSL)
- **Fond de base (Obsidian Abyss)** : `#050507` (Un noir pur avec une nuance bleutée très subtile).
- **Couleur de Marque (Vermillon Sacré / Blaze Orange)** : `#FF3E00` (Un rouge-orange incandescent évoquant les portes Torii et le feu spirituel).
- **Couleur d'Accent Système (Cyan Électrique)** : `#00F5FF` (Pour la technologie, les suivis de progression, la validation).
- **Surfaces de cartes (Paper Glass)** : `rgba(255, 255, 255, 0.02)` avec `backdrop-filter: blur(24px)` et des bordures translucides `rgba(255, 255, 255, 0.05)`.
- **Contrastes Clairs (Aura Blanche)** : `#FAFAFC` avec des ombres diffuses et des touches de vermillon léger (`rgba(255, 62, 0, 0.05)`) pour les sections en mode clair.

### Typographie du Projet
- **Titres Principaux (Headings)** : *Syne* ou *Sora* en version Extra-Bold, très serré, pour un look imposant, presque architectural.
- **Corps de texte (Body)** : *Satoshi* ou *Hanken Grotesk* pour une clarté et un confort de lecture optimal sur les interfaces denses (tables de modération, watchlists).

---

## 🖼️ 2. CONCEPTION DES INTERFACES (USER)

### A. Landing Page Contrastée (Alternance Sombre/Clair)
```
[ Section 1 : Hero (Obsidian Abyss - Sombre) ]
  - Pluie de Kanjis de couleur Vermillon en opacité 8%.
  - Halo de lumière central derrière un titre monumental en Sora.
  - CTAs : Boutons en capsule avec lueur néon au survol.
                    ⬇
[ Section 2 : Présentation & Fonctionnalités (Aura Blanche - Clair) ]
  - Fond blanc crème épuré (`#FAFAFC`).
  - Cartes de piliers avec de grands émojis et bordures grises fines.
  - Grille des fonctionnalités en 3 colonnes avec ombres portées diffuses.
                    ⬇
[ Section 3 : Événements & Galerie (Obsidian Abyss - Sombre) ]
  - Retour au noir mat pour faire ressortir les lueurs cyan et orange.
  - Carrousel de galerie à défilement infini.
```

### B. Wizard d'Inscription en 3 Étapes (Progressif)
- **Étape 1 : Identité** (Email & Pseudo)
  - Layout : Un champ double vertical. L'input actif s'entoure d'un filet orange vermillon.
- **Étape 2 : Sécurité** (Mots de passe)
  - Jauge de sécurité interactive : 5 barres horizontales qui s'allument progressivement (Rouge ➔ Jaune ➔ Vert).
- **Étape 3 : Avatar** (Personnalisation)
  - Grand cercle de prévisualisation central avec icône d'appareil photo en overlay. Bouton "Passer (Skip)" discret en dessous pour éviter toute friction.

---

## 🛠️ 3. CONCEPTION DES INTERFACES (ADMIN BACKOFFICE)

L'administration adopte un format de tableau de bord de type **"Cockpit de Contrôle"**.

### Layout Structure
- **Sidebar Gauche** : Un panneau fixe en verre dépoli très sombre (`bg-black/40`) avec des liens de navigation compacts s'allumant en Cyan au survol.
- **Zone Principale** :
  - *Cartes de Statistiques (Haut)* : Surfaces vitrées avec graphes de tendance miniatures en arrière-plan.
  - *Table de Modération (Bas Gauche)* : Rangs de table semi-transparents. Les lignes signalées ont un liseré rouge à gauche. Boutons d'action rapides : `Ignorer` (style contour fin) et `Supprimer` (plein rouge vermillon).
  - *Simulateur d'Alertes PWA (Bas Droite)* : Un panneau de contrôle dédié au tracker, affichant un gros bouton orange vermillon rétroéclairé : **"Simuler la sortie d'un épisode"** pour tester instantanément l'envoi de la push FCM.

---

## 🔁 4. SPÉCIFICATIONS D'INTÉGRATION (HANDOFF FRONTEND)

1. **Variables CSS globales** : Intégrer les couleurs et les variables de flou dans `globals.css` :
   ```css
   --color-vermilion: #FF3E00;
   --color-cyan: #00F5FF;
   --glass-bg: rgba(255, 255, 255, 0.02);
   --glass-border: rgba(255, 255, 255, 0.05);
   ```
2. **Effets de Transition** : Utiliser Framer Motion pour les changements d'étapes (Wizard) avec un effet de slide horizontal et un adoucissement de courbe `[0.16, 1, 0.3, 1]`.
3. **Optimisation Mobile** : Les formulaires ne doivent pas nécessiter de défilement vertical sur les écrans de smartphones standards (hauteur max 600px).
