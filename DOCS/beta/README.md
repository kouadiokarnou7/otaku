# Versions beta — otaku225

Phase de développement initiale. Le produit n'est pas stabilisé : le modèle de données peut encore changer sans migration.

## 📋 Versions

| Version | Date | Titre | État |
|---------|------|-------|------|
| [v0.2.0](v0.2.0.md) | 2026-09-19 | Bêta V1 — Feed interactif, Sondages, Thèmes & Profil | ✅ Livrée & Validée |
| [v0.1.0](v0.1.0.md) | 2026-08-11 | Durcissement sécurité & État initial | Historique |

## 🚀 État de la beta

- **Bêta V1 active** : Feed interactif avec sondages intégrés, thèmes personnalisables persistés, gestion d'avatar/bannière directe sur le profil, et sécurité du compte.
- **Règles Firestore & Storage** : Couvrent l'intégrité des rôles admins et le téléversement des avatars utilisateurs.

## ➡️ Ajouter une version

1. Créer `vX.Y.Z.md` en suivant la structure décrite dans [../README.md](../README.md#structure-dune-fiche-de-version)
2. Ajouter la ligne dans le tableau ci-dessus, **en haut** (ordre antichronologique)
3. Mettre à jour `version` dans `package.json` pour rester cohérent
