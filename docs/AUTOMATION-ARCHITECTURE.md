# Architecture d'automatisation — GITHUB FACTORY

## But

À terme, une seule demande dans GITHUB FACTORY doit créer :
- un dépôt GitHub indépendant ;
- les fichiers de départ dans ce dépôt ;
- un projet Netlify relié à ce dépôt ;
- le déploiement initial et les déploiements suivants.

## Ce qui est déjà validé

Le dépôt de démonstration `Site-test-` contient `index.html` et ce README.

Le projet Netlify `gf2027` a été créé depuis l'interface Netlify en important le dépôt GitHub. Deux commits successifs sur la branche `main` ont déclenché deux déploiements Netlify ; les deux sont passés à l'état `ready`. Le second commit est la preuve du test de redéploiement automatique.

## Architecture technique envisagée

1. Un déclencheur sécurisé reçoit un nom de projet validé.
2. Un service autorisé appelle l'API GitHub pour créer le dépôt.
3. Le service ajoute les fichiers initiaux au nouveau dépôt.
4. Il appelle l'API Netlify pour créer un projet lié au dépôt GitHub.
5. Il vérifie que le premier déploiement passe à l'état `ready`.
6. Il renvoie les liens GitHub et Netlify.

## Prérequis de sécurité — à configurer plus tard

Les secrets ne doivent jamais être écrits dans les fichiers du dépôt ni envoyés dans une conversation.

- Un accès GitHub de type GitHub App ou jeton adapté, avec permission de création de dépôts.
- Un jeton d'accès Netlify conservé dans un stockage de secrets.
- L'autorisation de l'application GitHub Netlify sur les dépôts à connecter, ainsi que les paramètres d'installation nécessaires pour lier les dépôts par API.

Les permissions minimales devront être choisies au moment de la configuration. Les secrets seront ajoutés uniquement dans les paramètres sécurisés du service d'automatisation.

## Limites connues

- Les outils GitHub actuellement connectés à ChatGPT permettent de lire et modifier des fichiers, mais n'exposent pas d'action de création de dépôt.
- Les outils Netlify connectés permettent de créer des projets vides et de consulter les déploiements, mais n'exposent pas d'action dédiée pour relier un dépôt GitHub.
- L'API Netlify documente la création d'un site avec une configuration de dépôt, mais la liaison GitHub via API nécessite une configuration d'application et de notifications de commits. La méthode par interface Netlify reste la voie la plus simple pour le premier raccordement.

## Priorité MVP

Construire d'abord un petit orchestrateur sécurisé et testable, puis automatiser la création d'un dépôt et d'un site Netlify. Ne jamais créer de dépôts ou de sites en double si une opération a déjà réussi.
