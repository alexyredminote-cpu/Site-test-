# Architecture d'automatisation — GITHUB FACTORY

## But

À terme, une seule demande dans GITHUB FACTORY doit créer :
- un dépôt GitHub indépendant ;
- les fichiers du projet ;
- un projet Netlify relié au dépôt ;
- le déploiement initial et les déploiements suivants.

Règle de structure : **1 site = 1 dépôt GitHub = 1 projet Netlify**.

## Éléments déjà construits

- Dépôt de test : `alexyredminote-cpu/Site-test-`.
- Projet Netlify de test : `gf2027`.
- Déploiements automatiques GitHub → Netlify vérifiés avant le blocage de crédits.
- Fonction serveur `factory-create-site` déployée sur Netlify.
- Création de dépôts GitHub privés par défaut, ajout d'une page initiale, puis création du projet Netlify dans l'équipe choisie.
- Contrôle de la clé d'administration, validation du JSON et limitation à 5 requêtes par minute et par IP.
- Action `status` non destructive qui indique la présence/absence des six variables sans révéler leur contenu.
- Console web `factory.html` ajoutée au dépôt. La clé Factory est saisie dans un champ et n'est pas enregistrée dans le stockage du navigateur.
- Documentation de configuration et checklist mises à jour.

## API Netlify

La documentation officielle confirme :
- la création d'un projet dans une équipe via `POST /api/v1/{account_slug}/sites/` ;
- la possibilité de fournir un objet `repo` pour configurer le déploiement continu.

Le guide de support Netlify consacré à la liaison d'un dépôt par API précise que l'installation GitHub App et son identifiant doivent être correctement configurés pour que Netlify reçoive les notifications de commits. La liaison doit donc encore être testée avec les autorisations réelles du compte.

Références :
- https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/
- https://answers.netlify.com/t/support-guide-linking-a-repository-via-api/121
- https://docs.netlify.com/build/git-workflows/repo-permissions-linking/

## État du déploiement

Le dernier déploiement prêt est `6b06a5fddac7a0292c2ec570`. Les commits qui ajoutent la console et les mises à jour de documentation sont bien sur GitHub, mais Netlify les a marqués `skipped` avec le message `account credit usage exceeded`.

Conséquence : le code existe dans le dépôt, mais la version actuellement publiée de `gf2027` n'inclut pas encore la nouvelle console. Aucun paiement ne doit être effectué pour contourner ce blocage ; le projet conserve son objectif de 0 €.

## Prérequis à configurer sur ordinateur

Les six variables doivent être ajoutées dans Netlify avec le scope **Functions** :
- `FACTORY_ADMIN_KEY`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `NETLIFY_TOKEN`
- `NETLIFY_ACCOUNT_SLUG`
- `NETLIFY_GITHUB_INSTALLATION_ID`

Les valeurs ne doivent jamais être commitées, affichées dans une capture d'écran ou envoyées dans une conversation. La fonction lit les variables au moment de l'exécution ; un nouveau déploiement est nécessaire après leur modification.

## Parcours de validation restant

1. Attendre que Netlify permette à nouveau un déploiement sans dépense.
2. Vérifier que le dernier commit est publié et ouvrir `/factory.html`.
3. Depuis les paramètres Netlify sur ordinateur, ajouter les six variables avec le scope Functions.
4. Déclencher un déploiement gratuit disponible pour appliquer les variables.
5. Utiliser le bouton de vérification de la console.
6. Après confirmation explicite, créer un unique dépôt de test privé.
7. Vérifier que Netlify le relie correctement et que son premier déploiement passe à l'état `ready`.

## Limites et sécurité

- La fonction ne supprime jamais automatiquement un dépôt ou un projet en cas d'échec partiel.
- Si GitHub crée le dépôt mais que Netlify échoue, la réponse renvoie le lien GitHub pour éviter de perdre la trace de la ressource.
- La présence des variables ne prouve pas que les jetons possèdent réellement les permissions nécessaires.
- Les quotas gratuits GitHub et Netlify s'appliquent ; ne pas activer de service payant.
- Le tableau de bord ne contient aucun jeton fournisseur.
