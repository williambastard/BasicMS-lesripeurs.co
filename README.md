# Sommaire

<details>
  <summary>⚙️ Installation</summary>
</details>
<details>
  <summary>🖥️ Première utilisation</summary>
</details>
<details>
  <summary>🔐 Configuration de sécurité</summary>
</details>
<details>
  <summary>📖 Référentiel d'API</summary>
  [Authentification]()
  
  [Génération d'un token de test forcé](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Validation d'un token](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Création d'un utilisateur](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Affichage de mes informations](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Affichage des informations d'un utilisateur via son Id](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Affichage des informations d'un utilisateur via son email](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Affichage des informations d'un utilisateur via son nom de famille](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Modifications des informations d'un utilisateur via Id](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
  
  [Suppression d'un utilisateur](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#g%C3%A9n%C3%A9ration-dun-token-de-test-forc%C3%A9)
</details>
<details>
  <summary>[🆘 Codes de retours]()</summary>
</details>
<details>
  <summary>[✍🏼 Amélioration possibles sur le projet]()</summary>
</details>
<details>
  <summary>[📚 Base de connaissances et ressources utilisées]()</summary>
</details>

# ⚙️ Installation

Les images sont auto-générées via le fichier `docker-compose.yml`,
Si vous n'avez jamais généré les images docker, vous devrez effectuer un build, les images seront automatiquement lancées ensuite.

```bash
  docker compose up --build
```

Si vous déjà généré les images docker, vous devrez effectuer un run.

```bash
  docker compose up
```

# 🖥️ Première utilisation

Par défaut, un utilisateur est automatiquement créé au build des conteneurs dockers.

Email : [**email-de-test-unique@test.com**](#)

Mot de passe : [**mon_mot_de_passe**](#)

Vous pourrez vous y connecter via l'api de login suivante : [**`/authentication`**](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#authentification)

# 🔐 Configuration de sécurité

Dans ce porjet, nous devons isoler le conteneur docker **user.gateway.riptest** de manière à ce qu'il soit accessible depuis le web (via un nom de domaine par exemple). Il doit également pouvoir communiquer avec les container **user.service.riptest** et **security.service.riptest**.

Les conteneurs dockers **user.service.riptest** et **security.service.riptest** ne doivent pas autoriser les connexions depuis l'internet.

Restreindre l'accès au public via les headers transmis par le client (navigateur) n'atant pas une méthode sûr et sécurisée, il est préférable de coupler la sécurité header des packages helmet et cors à une restriction par pare-feu directement sur la machine hôte des conteneurs, bloquant ainsi les connexions entrantes selon des règles spécifiques de ports et d'ip.

- **user.gateway.riptest** est configuré sur le port 80, IP: 172.25.1.1, 176.25.1.0.

- **security.service.riptest** est configuré sur le port 8181, IP: 176.25.1.1.

- **user.service.riptest** est configuré sur le port 8282, IP: 176.25.1.2.

- **postgres.db.riptest** est configuré sur le port 5432, IP:176.25.1.3.

Les conteneurs dockers sont configurés sur deux réseaux : **local-network** et **gateway-network**.

- local-network représente le réseau privé, non accessible depuis le net.

- gateway-network est le réseau accessible depuis le web.

Pour appliquer le réseau isolé de manière complète, la machine hôte doit subir quelques modifications de pare-feu afin de restreindre les connexions entrantes aux seuls ports 80 et 443 correspondants aux ports de **user.gateway.riptest**. Ainsi, même si la sécurisation des IP est désactivé de la fonction `Authorization.checkIP`, les microsservices seront toujours isolés de l'internet.

Pour des raisons de tests du projet, les accès directes via les endpoints des microservices ne permettront pas l'accès directe. Il faudra commenter la ligne `
_app.use(Authorization.checkIP);` si il est souhaité l'accès directe au microservice ciblé.

Le shell iptable sur la machine hôte des conteneurs docker de **user.gateway.riptest**, **security.service.riptest**, **user.service.riptest** et **postgres.db.riptest** doit resembler à ceci :

```
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
```

![Logo](data/architecture.jpg)

# 📖 Référentiel d'API

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

<details>
  <summary>Consulter le fichier .env</summary>
  
```
#Token à générer via http/Authentification/Token.http
AUTHORIZATION_TOKEN=

# Origine des requêtes

ORIGIN=http://user.gateway.riptest

# IP WHITELISTE (Ex: 176.25.1.0, 168.128.1.1,... )

WHITELIST=176.25.1.0

# IP GATEWAY (Une seule IP possible )

GATEWAYIP=176.25.1.0

# CONFIGURATION DES PORTS DES CONTENEURS

USER_SERVICE_HTTP_PORT=8282
USER_SERVICE_HTTPS_PORT=4442

SECURITY_SERVICE_HTTP_PORT=8181
SECURITY_SERVICE_HTTPS_PORT=4441

USER_GATEWAY_HTTP_PORT=80
USER_GATEWAY_HTTPS_PORT=443

# CONFIGURATION POSTGRES

DATABASE_URL="postgresql://postgres:postgres@postgres.db.riptest:5432/riptest"

# CONFIGURATION SSL SELF SIGNED

KEY="-----BEGIN PRIVATE KEY-----
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
5KW27pey/52vgOeqSWjPhuJ3gbEJ
-----END PRIVATE KEY-----"

CERT="-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----"

````
</details>

## Authentification

L'authentification est obligatoire pour obtenir un token valide, sans un token lié à un utilisateur valide, il sera impossible d'effectuer des actions sur le microservice User.
| Méthode  | Point d'entré     | Port HTTP     | Port HTTPS     |
| :--------- | :------- |:------- |:------- |
|**``` POST```** | **```https://user.gateway.riptest/authentication```**| 80| 443

| Paramètre  | Type     | Attribut     | Description |
| :--------- | :------- |:------- | :------------|
| **`email`**    | `string` | **Requis** |Adresse email du compte|
| **`password`** | `string` | **Requis** | Mot de passe associé à l'email |
| **`expiryIn`** | `string` | Optionnel | Temps de validité du token (par défaut: 1 jour) |

<details>
  <summary>Requête</summary>
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
````

</details>

<details>
  <summary>Réponse</summary>
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

````
</details>

## Génération d'un token de test forcé

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
````

| Parameter  | Type     | Description                                               |
| :--------- | :------- | :-------------------------------------------------------- |
| `userId`   | `string` | **Requis**. Identifiant du compte a tester                |
| `expiryIn` | `string` | optional. Temps de validité du token (par défaut: 1 jour) |

### Réponse

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

## Validation d'un token

```http
  POST http://user.gateway.riptest/authentication/tokenValidator
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Header        | Type  | Description                                                                   |
| :------------ | :---- | :---------------------------------------------------------------------------- |
| Authorization | token | **Requis**. Le header est requis, il ne peut être transmis que dans le header |

### Réponse

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

## Création d'un utilisateur

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

| Parameter    | Type     | Description                                      |
| :----------- | :------- | :----------------------------------------------- |
| `email`      | `string` | **Requis**. Adresse e-mail                       |
| `phone`      | `number` | **Requis**. Numéro de téléphone de l'utilisateur |
| `lastnames`  | `string` | **Requis**. Noms de famille                      |
| `firstnames` | `string` | **Requis**. Prénoms de famille                   |
| `password`   | `string` | **Requis**. Mot de passe                         |

### Réponse

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

## Affichage de mes informations

```http
  GET https://user.gateway.riptest/user/me
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Parameter         | Type | Description |
| :---------------- | :--- | :---------- |
| Aucuns paramètres | N/A  | N/A         |

### Réponse

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

## Affichage des informations d'un utilisateur via son Id

```http
  GET https://user.gateway.riptest/user/getUserById/:userId
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `userId`  | `string` | **Requis**. userId du compte recherché |

### Réponse

```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 255
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:17:31 GMT
  Etag: W/"e4-WDu1MRYSLBlBWSB4pXX3/MkOm1Y"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "User was successfully finded !",
    "data": {
      "user": {
        "email": "test2@test.com",
        "phone": "33650717809",
        "lastnames": "BASTARD RABASTE",
        "firstnames": "william",
        "password": "************",
        "createdAt": "2024-04-14T19:02:46.879Z",
        "userId": 1
      }
    }
  }
```

## Affichage des informations d'un utilisateur via son email

```http
  GET https://user.gateway.riptest/user/getUserByEmail/:email
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`   | `string` | **Requis**. Adresse e-mail |

### Réponse

```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 255
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:17:31 GMT
  Etag: W/"e4-WDu1MRYSLBlBWSB4pXX3/MkOm1Y"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "User was successfully finded !",
    "data": {
      "user": {
        "email": "test2@test.com",
        "phone": "33650717809",
        "lastnames": "BASTARD RABASTE",
        "firstnames": "william",
        "password": "************",
        "createdAt": "2024-04-14T19:02:46.879Z",
        "userId": 1
      }
    }
  }
```

## Affichage des informations d'un utilisateur via son nom de famille

```http
  GET https://user.gateway.riptest/user/getUserByLastnames/:lastnames
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Parameter   | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| `lastnames` | `string` | **Requis**. Noms de famille |

### Réponse

```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 255
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:17:31 GMT
  Etag: W/"e4-WDu1MRYSLBlBWSB4pXX3/MkOm1Y"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "User was successfully finded !",
    "data": {
      "user": {
        "email": "test2@test.com",
        "phone": "33650717809",
        "lastnames": "BASTARD RABASTE",
        "firstnames": "william",
        "password": "************",
        "createdAt": "2024-04-14T19:02:46.879Z",
        "userId": 1
      }
    }
  }
```

## Modifications des informations d'un utilisateur via Id

Il est impossible de modifier un tulisateur autre que le sien !

```http
  PATCH https://user.gateway.riptest/user/update/:userId
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}

  {
      "userId":1,
      "email": "email-de-test-unique@test.com",
      "phone": "33650717809",
      "lastnames": "BASTARD RABASTE",
      "firstnames": "william",
      "password": "password"
  }
```

| Parameter    | Type     | Description                                      |
| :----------- | :------- | :----------------------------------------------- |
| `userId`     | `string` | **Requis**. userId du compte associé au token    |
| `email`      | `string` | **Requis**. Adresse e-mail                       |
| `phone`      | `number` | **Requis**. Numéro de téléphone de l'utilisateur |
| `lastnames`  | `string` | **Requis**. Noms de famille                      |
| `firstnames` | `string` | **Requis**. Prénoms de famille                   |
| `password`   | `string` | **Requis**. Mot de passe                         |

#### Réponse

```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 277
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:42:43 GMT
  Etag: W/"e6-YWcCsKfOc2rGYBfNn9QyiGVqBQ8"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "User was successfully modified !",
    "data": {
      "user": {
        "email": "email-de-test-uniquex@test.com",
        "phone": "33650717809",
        "lastnames": "BASTARD RABASTE",
        "firstnames": "william",
        "password": "mon_mot_de_passe",
        "createdAt": "2024-04-17T11:43:40.931Z",
        "userId": 1
      }
    }
  }
```

## Suppression d'un utilisateur

Nous partirons du principe que nous sommes tous admins, il n'y aucun système de droits ici.

```http
  DELETE http://user.gateway.riptest/user/deleteuserById/:userId
  Cache-Control: max-age=604800
  Content-Type: application/json
  Origin: {{$dotenv ORIGIN}}
  Authorization: token {{$dotenv AUTHORIZATION_TOKEN}}
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `userId`  | `string` | **Requis**. userId du compte à supprimé |

### Réponse

```
  HTTP/1.1 200 OK
  X-Powered-By: Les Ripeurs server
  Access-Control-Allow-Origin: http://user.gateway.riptest
  Vary: Origin
  Access-Control-Allow-Credentials: true
  Connection: keep-alive
  Content-Length: 56
  Content-Type: application/json; charset=utf-8
  Date: Wed, 17 Apr 2024 19:49:08 GMT
  Etag: W/"e7-e6negy8LKAGzBjd3FmHDdbimrpA"
  keep-alive: timeout=5

  {
    "statusCode": 200,
    "message": "User Id ':userId' was deleted !"
  }
```

## 🆘 Codes de retours

Description des codes http de retours utilisés dans les API

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 401         | `UNAUTHORIZED`          |
| 403         | `FORBIDEN`              |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |
| 501         | `NOT IMPLEMENTED`       |

## ✍🏼 Amélioration possibles sur le projet

La structure du dossier ressemblant à un monorepo hébergant plusieurs projets indépendants les uns des autres, il peut être intéréssant d'utiliser pnpm-workplace afin de faciliter la gestion et la lecture du projet.
Exemple d'utilisation : https://www.brockherion.dev/blog/posts/setting-up-a-monorepo-with-pnpm-and-typescript/

## 📚 Base de connaissances et ressources utilisées

- [Tutoriel de configuration Iptables](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands)
- [Module privé utilisé pour ce test](https://github.com/williambastard/private_modules)

# Licences

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

_PS: schéma de l'architecture, voir : "schema-microservices.png"_

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

## Première utilisation

Par défaut, un utilisateur est automatiquement créé au build des conteneurs dockers.

Email : [**email-de-test-unique@test.com**](#)

Mot de passe : [**mon_mot_de_passe**](#)

Vous pourrez vous y connecter via l'api de login suivante : [**`/authentication`**](https://github.com/williambastard/BasicMS-lesripeurs.co?tab=readme-ov-file#authentification)

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

_PS: schéma de l'architecture, voir : "schema-microservices.png"_

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
