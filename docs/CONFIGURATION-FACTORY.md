# Configuration de GitHub Factory

Cette version ajoute une première fonction serveur pour créer un dépôt GitHub, y déposer une page de départ, puis demander à Netlify de créer un projet relié au dépôt.

## Variables d'environnement Netlify

Dans **Project configuration → Environment variables**, ajouter ces variables comme secrets (ne jamais les mettre dans Git) :

- `FACTORY_ADMIN_KEY` : longue clé aléatoire utilisée pour protéger l'endpoint.
- `GITHUB_TOKEN` : jeton GitHub autorisé à créer des dépôts pour le compte.
- `GITHUB_OWNER` : identifiant du compte GitHub propriétaire (ex. le nom du compte, sans URL).
- `NETLIFY_TOKEN` : jeton d'accès personnel Netlify.
- `NETLIFY_GITHUB_INSTALLATION_ID` : identifiant numérique (entier positif) de l'installation de l'application Netlify GitHub pour le compte. Il se trouve dans l'URL de la page de l'installation GitHub.

Le jeton GitHub doit disposer des droits nécessaires à la création de dépôts et à l'écriture dans le dépôt. Le jeton Netlify doit pouvoir créer des projets dans l'équipe choisie.

## Connexion GitHub ↔ Netlify

L'application Netlify GitHub doit être installée sur le compte GitHub et autorisée à accéder aux nouveaux dépôts créés par la Factory. L'identifiant d'installation doit correspondre à cette installation. Sans cette autorisation, la fonction peut créer le dépôt mais Netlify peut refuser de le relier.

## Appel de test

Après déploiement de ce dépôt sur Netlify, envoyer une requête POST à :

`https://NOM-DU-PROJET.netlify.app/.netlify/functions/factory-create-site`

En-tête :

`Authorization: Bearer VOTRE_CLE_FACTORY`

Corps JSON :

```json
{
  "name": "mon-nouveau-site",
  "description": "Mon premier site créé avec GitHub Factory",
  "private": true
}
```

La visibilité est privée par défaut. Pour créer un dépôt public, passer explicitement `"private": false`.

## État et limites

- Cette fonction est une première version technique, pas encore un assistant autonome.
- Elle ne supprime jamais un dépôt ou un projet en cas d'échec partiel : elle renvoie les liens pour permettre une vérification manuelle.
- Il faut configurer les variables secrètes dans Netlify avant de pouvoir l'utiliser.
- Les quotas et limites gratuites de GitHub et Netlify s'appliquent.
- Ne jamais envoyer les jetons ou la clé d'administration dans une conversation, un fichier du dépôt ou une capture d'écran.

## Sécurité

L'endpoint exige une clé d'administration, refuse les méthodes autres que POST et n'expose jamais les jetons dans ses réponses. Pour un usage réel, ajouter ensuite une interface d'administration protégée et une journalisation sans secrets.
