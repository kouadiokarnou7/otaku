# Documentation — otaku225

Toute la documentation du projet est **versionnée**. Chaque version livrée a sa fiche, et on n'écrase jamais une fiche existante : on en crée une nouvelle.

## 📁 Organisation

```
docs/
  README.md          ← tu es ici : convention et index général
  beta/              ← phase actuelle : toutes les versions beta
    README.md        ← index des versions beta
    v0.1.0.md        ← état initial
    v0.2.0.md        ← durcissement sécurité
  v1/                ← à créer quand on sortira de la beta
```

## 🔖 Convention

**Une phase = un dossier.** On reste dans `beta/` tant que le produit n'est pas stabilisé. Le jour où on passe en production, on crée `v1/` à côté — on ne déplace ni ne réécrit `beta/`, qui devient l'historique.

**Une version = un fichier `vX.Y.Z.md`.**

| Incrément | Quand |
|---|---|
| **Patch** `0.2.0 → 0.2.1` | correction de bug, sans changement de comportement |
| **Mineure** `0.2.0 → 0.3.0` | nouvelle fonctionnalité, ou correction qui change le comportement |
| **Majeure** `0.x.x → 1.0.0` | sortie de beta, ou rupture de compatibilité des données |

## 📝 Structure d'une fiche de version

Chaque `vX.Y.Z.md` doit contenir, dans cet ordre :

1. **Résumé** — une phrase sur ce que la version apporte
2. **Contexte** — pourquoi cette version existe
3. **Changements** — par ticket, avec les fichiers touchés
4. **Actions manuelles** — ce qui ne se déploie pas avec le code (règles Firebase, migrations, variables d'environnement)
5. **Résultats QA** — lint, tsc, build, avec les chiffres réels
6. **Dette connue** — ce qui reste cassé ou incomplet, sans enjoliver

Le point 6 n'est pas optionnel. Une fiche qui ne liste que les réussites ne sert à rien six mois plus tard.

## 👥 Équipe de développement

Le projet est développé avec une équipe de 6 agents virtuels documentée dans [.agents/](../.agents/) : @Marc (PM), @Lina (Workflow), @Maya (Design), @Théo (Frontend), @Jérémie (Backend), @Zoé (QA). Le protocole en 5 phases est décrit dans [.agents/AGENTS.md](../.agents/AGENTS.md).

## 📚 Index des versions

- [Beta](beta/README.md) — phase en cours
