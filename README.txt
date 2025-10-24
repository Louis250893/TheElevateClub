README - TheElevateClub Netlify bundle

CONTENU
- index.html
- netlify/functions/submit.js
- netlify.toml

OBJECTIF
Ce bundle déploie une page statique (index.html) et une Netlify Function (submit) qui reçoit le formulaire et écrit dans votre base Airtable de façon sécurisée. Votre clé Airtable n'est **jamais** dans le front-end.

ACTIONS A EFFECTUER APRES DEPLOIEMENT SUR NETLIFY
1) Déployer : glisser/déposer le dossier zip sur https://app.netlify.com/drop
2) Dans Netlify admin → Site settings → Build & deploy → Environment → Environment variables, ajoutez :
   - AIRTABLE_API_KEY = (votre clé personnelle pat...)
   - AIRTABLE_BASE_ID = (ex: appA0li44ZQS3aIU9)
3) Publier / redeployer si nécessaire.
4) Tester la page : ouvrir l'URL fournie par Netlify, remplir le formulaire, cliquer "Demander l'accès".
5) Vérifier sur Airtable (base, table "Sélection Entrante") que la ligne apparaît.

SECURITE
- NE JAMAIS partager AIRTABLE_API_KEY publiquement.
- Ce bundle ne contient pas votre clé.

BESOIN D'AIDE ?
Dis-moi et je t'accompagne pour ajouter les variables d'environnement et vérifier le premier enregistrement.
