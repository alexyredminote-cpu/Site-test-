# GITHUB FACTORY — GF-TEST

Projet de démonstration de GITHUB FACTORY.

## Objectif

Tester le parcours **1 site = 1 dépôt GitHub = 1 site Netlify**.

## État actuel

- [x] Dépôt GitHub de test existant : `Site-test-`
- [x] Page HTML de démonstration : `index.html`
- [x] Projet Netlify de test créé : `gf2027`
- [x] Premier déploiement Netlify confirmé comme prêt
- [ ] Vérifier qu'un nouveau commit GitHub déclenche un nouveau déploiement Netlify
- [ ] Concevoir l'automatisation de création des dépôts
- [ ] Automatiser la création et la liaison des projets Netlify
- [ ] Ajouter un tableau de bord de gestion

## Configuration de la page

Le site est une page HTML statique. Aucune commande de build n'est nécessaire et le dossier de publication est la racine du dépôt.

## Architecture cible

1. GITHUB FACTORY reçoit le nom du nouveau projet.
2. Un mécanisme autorisé crée un dépôt GitHub indépendant.
3. Le projet Netlify est créé et relié au dépôt.
4. Les changements poussés sur la branche principale déclenchent les déploiements.

## Sécurité

Les jetons GitHub et Netlify devront être conservés dans des secrets sécurisés (jamais dans le code, les commits ou les messages). Ne jamais copier de jeton dans une conversation.

## Budget

Objectif du projet : 0 € de dépenses, en utilisant les offres gratuites et en vérifiant leurs limites avant chaque nouvelle fonctionnalité.
