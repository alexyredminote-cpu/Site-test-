# Configuration de GITHUB FACTORY

Cette version comprend une fonction serveur qui crée un dépôt GitHub privé, y ajoute une page de départ, puis demande à Netlify de créer un projet relié au dépôt. Une console web est disponible dans `/factory.html`.

## Variables d'environnement Netlify

Dans **Project configuration → Environment variables**, ajouter ces variables comme secrets avec le scope **Functions** (ne jamais les mettre dans Git) :

- `FACTORY_ADMIN_KEY` : longue clé aléatoire utilisée pour protéger l'endpoint.
- `GITHUB_TOKEN` : jeton GitHub autorisé à créer des dépôts et à y écrire.
- `GITHUB_OWNER` : identifiant du compte GitHub propriétaire (sans URL).
- `NETLIFY_TOKEN` : jeton d'accès Netlify.
- `NETLIFY_ACCOUNT_SLUG` : identifiant de l'équipe Netlify qui hébergera les nouveaux projets (équipe actuelle : `alexyredminote`).
- `NETLIFY_GITHUB_INSTALLATION_ID` : identifiant numérique positif de l'installation de l'application Netlify GitHub.

Le jeton GitHub doit disposer des droits nécessaires à la création de dépôts et à l'écriture dans les dépôts. Le jeton Netlify doit pouvoir créer des projets dans l'équipe choisie.

## Connexion GitHub ↔ Netlify

L'application Netlify GitHub doit être installée sur le compte GitHub et autorisée à accéder aux nouveaux dépôts créés par la Factory. L'identifiant d'installation doit correspondre à cette installation. Sans cette autorisation, la fonction peut créer le dépôt mais Netlify peut refuser de le relier.

## Console web

Après déploiement, ouvrir :

`https://gf2027.netlify.app/factory.html`

1. Saisir la clé `FACTORY_ADMIN_KEY` dans le champ de la console.
2. Cliquer sur **Vérifier la configuration**. Cette action n'effectue aucune création.
3. Si les six variables sont présentes, les autorisations doivent encore être testées avec une création réelle autorisée.
4. Pour créer un site, choisir un nom et cliquer sur **Créer le dépôt + site Netlify**. La console demande une confirmation avant l'action.

La console ne stocke pas la clé dans `localStorage`, `sessionStorage` ou un cookie. Elle reste dans le champ de la page et est transmise à la fonction via HTTPS. Effacer le champ en quittant la console. Ne jamais saisir les jetons GitHub ou Netlify dans cette page : ils doivent rester dans Netlify.

## Vérifier la configuration sans créer de projet

La console envoie une requête POST au même endpoint avec le corps :

```json
{ "action": "status" }
```

Cette vérification renvoie uniquement l'état présent/manquant des variables et ne crée aucun dépôt ni projet. Elle ne vérifie pas encore que les jetons disposent réellement des autorisations nécessaires.

L'endpoint est limité à 5 requêtes par minute et par adresse IP. Une limite dépassée renvoie une réponse HTTP 429.

## Appel direct (alternative à la console)

Endpoint :

`https://gf2027.netlify.app/.netlify/functions/factory-create-site`

En-tête : `Authorization: Bearer VOTRE_CLE_FACTORY`

Corps JSON :

```json
{
  "name": "mon-nouveau-site",
  "description": "Mon premier site créé avec GitHub Factory",
  "private": true
}
```

La visibilité est privée par défaut. La console ne permet volontairement pas de créer un dépôt public.

## État et limites

- La fonction et la console sont déployées, mais le parcours complet de création n'a pas encore été testé.
- La fonction ne supprime jamais un dépôt ou un projet en cas d'échec partiel : elle renvoie les liens pour permettre une vérification manuelle.
- Les six variables secrètes doivent être ajoutées dans Netlify avant utilisation.
- La présence des variables ne prouve pas que les jetons possèdent les autorisations requises.
- Les quotas et limites gratuites de GitHub et Netlify s'appliquent.
- Ne jamais envoyer les jetons ou la clé d'administration dans une conversation, un fichier du dépôt ou une capture d'écran.

## Sécurité

L'endpoint exige une clé d'administration, refuse les méthodes autres que POST, limite les requêtes et n'expose jamais les jetons dans ses réponses. La console n'enregistre pas la clé. Les secrets doivent être configurés uniquement dans les paramètres sécurisés Netlify avec le scope Functions.
