# Versions beta — otaku225

Phase de développement initiale. Le produit n'est pas stabilisé : le modèle de données peut encore changer sans migration.

## 📋 Versions

| Version | Date | Titre | État |
|---------|------|-------|------|
| [v0.2.0](v0.2.0.md) | 2026-08-11 | Durcissement sécurité | ⚠️ Livrée, **règles Firebase à publier** |
| [v0.1.0](v0.1.0.md) | — | État initial | Historique |

## 🚨 État de la beta

**Le build ne passe pas.** 11 erreurs de typage antérieures à la v0.2.0 bloquent `npm run build`. Détail et liste complète dans [v0.2.0.md](v0.2.0.md#dette-connue).

**La v0.2.0 n'est pas active tant que les règles Firebase ne sont pas publiées** — voir [les actions manuelles](v0.2.0.md#actions-manuelles-requises).

## ➡️ Ajouter une version

1. Créer `vX.Y.Z.md` en suivant la structure décrite dans [../README.md](../README.md#structure-dune-fiche-de-version)
2. Ajouter la ligne dans le tableau ci-dessus, **en haut** (ordre antichronologique)
3. Mettre à jour `version` dans `package.json` pour rester cohérent
