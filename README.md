# GITHUB FACTORY — GF-TEST

Projet de démonstration et base technique de GITHUB FACTORY.

## Objectif

Tester le parcours **1 site = 1 dépôt GitHub = 1 projet Netlify**.

## État actuel

- [x] Dépôt GitHub de test existant : `Site-test-`
- [x] Page HTML de démonstration : `index.html`
- [x] Projet Netlify de test créé : `gf2027`
- [x] Déploiements automatiques GitHub → Netlify vérifiés
- [x] Fonction serveur `factory-create-site` déployée
- [x] Contrôle de clé d'administration et limite de 5 requêtes/minute/IP
- [x] Vérification non destructive de la présence des six variables (`action: status`)
- [x] Console web `factory.html` ajoutée (clé saisie en mémoire de page, jamais stockée)
- [ ] Ajouter les six variables secrètes dans Netlify
- [ ] Vérifier les autorisations réelles des jetons et de l'installation GitHub App
- [ ] Effectuer une création réelle de dépôt privé + projet Netlify
- [ ] Vérifier que le premier déploiement arrive à l'état `ready`
- [ ] Ajouter la gestion et la mise à jour de sites existants

## Utilisation de la console

Après déploiement, ouvrir `/factory.html`. La console permet :
1. de vérifier la configuration sans créer de ressources ;
2. de demander la création d'un dépôt GitHub privé et de son projet Netlify.

La clé Factory est saisie dans le navigateur et n'est pas enregistrée dans le stockage local. Ne jamais saisir les jetons GitHub ou Netlify dans la console : ils restent uniquement dans les variables secrètes Netlify.

## Configuration

Voir [docs/CONFIGURATION-FACTORY.md](docs/CONFIGURATION-FACTORY.md).

## Architecture cible

1. GITHUB FACTORY reçoit le nom du nouveau projet.
2. Un mécanisme autorisé crée un dépôt GitHub indépendant.
3. Les fichiers initiaux sont ajoutés au dépôt.
4. Le projet Netlify est créé et relié au dépôt.
5. Les changements sur la branche principale déclenchent les déploiements.

## Sécurité

Les jetons GitHub et Netlify doivent rester dans les variables d'environnement Netlify (scope Functions), jamais dans le code, les commits, la console ou les messages. Ne jamais copier un secret dans une conversation.

## Budget

Objectif du projet : **0 € de dépenses**. Utiliser les offres gratuites et vérifier leurs limites avant toute fonctionnalité susceptible d'entraîner un coût.
