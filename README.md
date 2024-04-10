## Amélioration apportable sur le projet
La structure du dossier ressemblant à un monorepo hébergant plusieurs projets indépendants les uns des autres, il peut être intéréssant d'utiliser pnpm-workplace afin de faciliter la gestion et la lecture du projet.

Exemple d'utilisation : https://www.brockherion.dev/blog/posts/setting-up-a-monorepo-with-pnpm-and-typescript/


# BasicMS

Bienvenue sur le test technique BasicMS (Node.js).


## Test technique

La liste des tâches à effectuer est ci-dessous.
Technos obligatoires :
- Node.js
- TypeScript
- Docker & Docker-compose (démarrage via un simple "docker-compose up" et pense à faire un "docker-compose up --build" si tu installes de nouveaux packages)
- Micro-services via API REST
- PostgreSQL
- Git


### Écosystème de micro-services

Objectif final, en partant de l'exemple du dossier "Starter" (tu peux appliquer autant de modifications que tu le souhaites), crée 3 MS (Micro-Services) indépendant les uns des autres, dans un seul repos Git avec, idéalement, des commits fréquent :

- **Gateway User** 
  MS accessible publiquement (web, app, ...), permettant à un utilisateur de se connecter et de récupérer ses informations.
- **MS Security**
  MS inaccessible au public, il permet de gérer le système de token.
- **MS User**
  MS inaccessible au public, permet de gérer les utilisateurs.

*PS: schéma de l'architecture, voir : "schema-microservices.png"*

### MS User (inaccessible au public)

Crée le service User avec 2 routes :
- Une permettant de vérifier une authentification avec l'e-mail et le mot de passe
- Une autre pour récupérer les données d'un utilisateur via une simple ID

Évidemment, crée aussi la structure pour la base de données, afin de stocker les utilisateurs (n’hésite pas à ajouter quelques champs supplémentaires, pour rendre le test plus "sympa", ex: téléphone, nom, ...).


### MS Security (inaccessible au public)

Crée le service Security avec 2 routes :
- Une permettant de créer un token (carte blanche sur la méthode : stockage en BDD, JWT, ...) avec une ID utilisateur
- Une autre permettant d'authentifier un token et d'obtenir l'ID utilisateur correspondant


### Gateway User (accessible au public)

Créer la gateway user, avec les routes suivantes :
- Une pour s'authentifier via le service User et obtenir un token via le service Security
- Une autre (un genre de "/me") pour obtenir ses informations (champs de la BDD) via un token (checké par le service Security) et en obtenant la data du service User


## Note finale

L'idée est d'avoir un code structuré, **sécurisé**, logique, facilement compréhensible, modulable et avec un niveau de production.
Mais toujours avec l'optique que le projet reste globalement "simple" et fonctionne instantanément.

Enfin, push ton projet sur un repos Git privée (comme Gitlab ou Github) et donne-moi un accès en lecture à l'adresse mail "it@lesripeurs.com".

Bon courage 👍
