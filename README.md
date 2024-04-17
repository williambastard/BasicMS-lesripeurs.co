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

**Restreindre l'accès au public via les headers transmis par le client (navigateur) n'atant pas une méthode sûr et sécurisée, il est préférable de coupler la sécurité header des packages helmet et cors à une restriction par pare-feu directement sur la machine hôte des conteneurs, bloquant ainsi les connexions entrantes selon des règles spécifiques de ports et d'ip.**

Pour appliquer le réseau isolé de manière complète, et rendre impossible aux machines du réseau l'accès aux conteneurs, la machine hôte doit subir quelques modifications de pare-feu afin de restreindre les connexions entrantes aux seuls ports 80 et 443 correspondants aux ports de **user.gateway.riptest**.


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
Les microservices ne permettent pas l'accès directe aux ressources, ils vérifient l'origine des requêtes et l'ip de l'hôte émétteur de la requête.
Pour chaque requête le header `Origin: http://user.gateway.riptest` est donc requis.

Si le Header **Origin:** n'est pas fournie, le serveur renvoi :
```
{
  "statusCode": 403,
  "message": "Error: Origin not provided"
  ...
}
```

Si le Header **Origin:** fournie mais non autorisé, le serveur renvoi :
```
{
  "statusCode": 403,
  "message": "Error: Not allowed by CORS"
  ...
}
```

Pour tester les APIs, un dossier `http` a été mis à disposition, il suffit d'utiliser le plugin `REST CLIENT` de Visual Studio code pour tester les fonctionnalités.
Un fichier .env constitué ainsi devra être placé en sa racine.
```
  #Token à générer via http/Authentification/Token.http
  AUTHORIZATION_TOKEN=

  # Origine des requêtes
  ORIGIN=http://user.gateway.riptest
```

#### Authentification
L'authentification est obligatoire pour obtenir un token valide, sans un token lié à un utilisateur valide, il sera impossible d'effectuer des actions sur le microservice User.

```http
  POST https://user.gateway.riptest/authentication
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
  
  {
      "email": "test@test.fr",
      "password": "password",
      "expireIn":"365j" 
  }
  
```


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Requis**. Adresse email du compte |
| `password` | `string` | **Requis**. Mot de passe associé à l'email |
| `expiryIn` | `string` | optional. Temps de validité du token (par défaut: 1 jour) |


```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  X-Session-Id: 45647859436351..2f6b307831773d
  X-Session-Max-Age-Value: 31536000
  X-Session-Max-Age-Unit: seconds
  Set-Cookie: session=s%3A45647859436351... Expires=Thu, 18 Apr 2024 03:45:00 GMT;HttpOnly
  Content-Type: application/json; charset=utf-8
  Content-Length: 854
  ETag: W/"356-ylXp0q5xvsub7jWwT/QpEKLXEU0"
  Date: Wed, 17 Apr 2024 18:59:24 GMT
  Connection: close
  {
    "statusCode": 200,
    "message": "User connected with success !",
    "token": "45647859436351..2f6b307831773d",
    "data": {
      "token": "45647859436351..2f6b307831773d"
    },
    "details": {
      "session": {
        "userId": 8,
        "email": "test@test.frx",
        "phone": "33650717809",
        "lastnames": "BASTARD RABASTE",
        "firstnames": "william",
        "password": "************",
        "createdAt": "2024-04-17T11:43:53.020Z"
      }
    }
  }
  
```



#### Génération d'un token de test forcé

```http
  POST http://security.service.riptest:8181/generateTestToken
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}

  {
    "userId":1,
    "expireIn": "1 an"
  }
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Requis**. Identifiant du compte a tester |
| `expiryIn` | `string` | optional. Temps de validité du token (par défaut: 1 jour) |

#### Réponse 
```
HTTP/1.1 200 OK
X-Powered-By: Les Ripeurs server
Access-Control-Allow-Origin: http://user.gateway.riptest
Vary: Origin
Access-Control-Allow-Credentials: true
X-Session-Id: 3841764e555...67553d
X-Session-Max-Age-Value: 31536000
X-Session-Max-Age-Unit: seconds
Set-Cookie: session=s%3A3841764e55...Expires=Thu, 18 Apr 2024 03:47:39 GMT; HttpOnly
Content-Type: application/json; charset=utf-8
Content-Length: 854
ETag: W/"356-j4NVpcXU8AIWXLtYNLINIsEFZa4"
Date: Wed, 17 Apr 2024 19:02:03 GMT
Connection: close

{
  "statusCode": 200,
  "message": "Your token is ready, find it in data.token. He is valid for 1 an",
  "token": "3841764e55...67553d",
  "data": {
    "token": "3841764e55...67553d",
    "request_url": "/",
    "request_type": "POST"
  }
}
```

#### Validation d'un token
```http
  POST http://user.gateway.riptest/authentication/tokenValidator
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| Authorization | token | **Requis**. Le header est requis, il ne peut être transmis que dans le header |

#### Réponse 
```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 229
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 18:58:32 GMT
  Etag: W/"e5-iD7c+/CuYL67RZ3P8Nw5IDtpad4"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "Your token is valid !",
    "data": {
      "session": {
        "userId": 3,
        "expireAt": 1744910819811,
        "expireDate": "2025-04-17T17:26:59+00:00",
        "createAt": "2024-04-17T19:20:12+02:00"
      },
      "request_url": "/",
      "request_type": "POST"
    }
  }
```

#### Création d'un utilisateur
```http
  POST http://user.gateway.riptest/user/signup
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}

  {
      "email": "email-de-test-unique@test.com",
      "phone": "33650717809",
      "lastnames": "BASTARD RABASTE",
      "firstnames": "william",
      "password": "mon_mot_de_passe"
  }
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Requis**. Adresse e-mail |
| `phone` | `number` | **Requis**. Numéro de téléphone de l'utilisateur |
| `lastnames` | `string` | **Requis**. Noms de famille |
| `firstnames` | `string` | **Requis**. Prénoms de famille |
| `password` | `string` | **Requis**. Mot de passe |

#### Réponse 
```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 228
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:09:08 GMT
  Etag: W/"e4-TzZiVp6gV2L6eDNWqCoXcE99e/s"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "User was successfully registered !",
    "data": {
      "user": {
        "email": "email-de-test-unique@test.com",
        "phone": "33650717809",
        "lastnames": "BASTARD RABASTE",
        "firstnames": "william",
        "password": "mon_mot_de_passe"
      }
    }
  }
```

#### Affichage de mes informations
```http
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| Aucuns paramètres | N/A | N/A |

#### Réponse 
```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 230
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:13:21 GMT
  Etag: W/"e4-WDu1MRYSLBlBWSB4pXX3/MkOm1Y"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "Your informations",
    "data": {
      "email": "test2@testx.com",
      "phone": "33650717809",
      "lastnames": "BASTARD RABASTE",
      "firstnames": "william",
      "password": "************",
      "createdAt": "2024-04-17T11:43:40.931Z",
      "userId": 3
    }
  }
```


## Status Codes

Gophish returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |




## Amélioration possibles sur le projet
La structure du dossier ressemblant à un monorepo hébergant plusieurs projets indépendants les uns des autres, il peut être intéréssant d'utiliser pnpm-workplace afin de faciliter la gestion et la lecture du projet.
Exemple d'utilisation : https://www.brockherion.dev/blog/posts/setting-up-a-monorepo-with-pnpm-and-typescript/



## Acknowledgements

 - [Tutoriel de configuration Iptables](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands)
 - [Module privé utilisé pour ce test](https://github.com/williambastard/private_modules)



## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


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
  
  ✅ MS accessible publiquement (web, app, ...), permettant à un utilisateur de se connecter et de récupérer ses informations.
- **MS Security**

  ✅ MS inaccessible au public, il permet de gérer le système de token.
- **MS User**

  ✅ MS inaccessible au public, permet de gérer les utilisateurs.

*PS: schéma de l'architecture, voir : "schema-microservices.png"*

### MS User (inaccessible au public)

Crée le service User avec 2 routes :

✅ - Une permettant de vérifier une authentification avec l'e-mail et le mot de passe

✅ - Une autre pour récupérer les données d'un utilisateur via une simple ID

Évidemment, crée aussi la structure pour la base de données, afin de stocker les utilisateurs (n’hésite pas à ajouter quelques champs supplémentaires, pour rendre le test plus "sympa", ex: téléphone, nom, ...).


### MS Security (inaccessible au public)

Crée le service Security avec 2 routes :

✅ - Une permettant de créer un token (carte blanche sur la méthode : stockage en BDD, JWT, ...) avec une ID utilisateur

✅ - Une autre permettant d'authentifier un token et d'obtenir l'ID utilisateur correspondant


### Gateway User (accessible au public)

Créer la gateway user, avec les routes suivantes :

✅ - Une pour s'authentifier via le service User et obtenir un token via le service Security

✅ - Une autre (un genre de "/me") pour obtenir ses informations (champs de la BDD) via un token (checké par le service Security) et en obtenant la data du service User


## Note finale

L'idée est d'avoir un code structuré, **sécurisé**, logique, facilement compréhensible, modulable et avec un niveau de production.
Mais toujours avec l'optique que le projet reste globalement "simple" et fonctionne instantanément.

Enfin, push ton projet sur un repos Git privée (comme Gitlab ou Github) et donne-moi un accès en lecture à l'adresse mail "it@lesripeurs.com".

Bon courage 👍
