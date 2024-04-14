## Installation

Les images sont auto-générées via le fichier `docker-compose.yml`, 
Si vous n'avez jamais généré les images docker, vous devrez effectuer un build, les images seront automatiquement lancées ensuite.
```bash
  docker compose up --build
```

Si vous déjà généré les images docker, vous devrez effectuer un run.
```bash
  docker compose up
```

# Configuration de sécurité

Dans ce porjet, nous devons isoler le conteneur docker **user.gateway.riptest** de manière à ce qu'il soit accessible depuis le web (via un nom de domaine par exemple). Il doit également pouvoir communiquer avec les container **user.service.riptest** et **security.service.riptest**.

Les conteneurs dockers **user.service.riptest** et **security.service.riptest** ne doivent pas autoriser les connexions depuis l'internet.

**Restreindre l'accès au public via les headers transmis par le client (navigateur) n'atant pas une méthode sûr et sécurisée, il est préférable de coupler les la sécurité par header ip, helmet et cors à une restriction par pare-feu directement sur la machine hôte des conteneurs.**

Pour appliquer le réseau isolé de manière complète, et rendre impossible aux machines du réseau l'accès aux conteneurs, la machine hôte doit subir quelques modifications de pare-feu afin de restreindre les connexions entrantes et sortantes aux seuls ports 80 et 443 correspondants aux ports de **user.gateway.riptest**.


Le conteneur **postgres.db.riptest** est configuré sur le port 5432.
Le conteneur **security.service.riptest** est configuré sur le port 8181.
Le conteneur **user.service.riptest** est configuré sur le port 8282.

Le shell iptable sur la machine hôte des conteneurs docker de **user.gateway.riptest**, **security.service.riptest**, **user.service.riptest** et **postgres.db.riptest** doit resembler à ceci :
````
# Efface toutes les règles et les chaînes existantes
iptables -F
iptables -X

# Refuse toutes les autres connexions entrantes
iptables -A INPUT -j DROP

# Autorise le trafic sur le loopback (localhost)
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Autorise le trafic sur les ports 22 (SSH), 80 (HTTP) et 443 (HTTPS)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Configuration optionnelle qui autorise l'utilisation du port 21 (FTP)
iptables -A INPUT -p tcp --dport 21 -j ACCEPT
````

![Logo](data/architecture.jpg)


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Status Codes

Gophish returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

## Acknowledgements

 - [Tutoriel de configuration Iptables](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands)
 - [Module privé utilisé pour ce test](https://github.com/williambastard/private_modules)



## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


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
