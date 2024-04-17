import os from 'os';
import cors from "cors";
import http from "http";
import https from "https";
import * as ssl from "./ssl/ssl";
import * as Api from "private_modules";
import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from 'express';
import { generateToken, verifyToken } from './middleware/authentification';

// Récupérer les interfaces réseau de la machine
let _IPAdresses: string[] = [];

const _HTTP_PORT = "8181";
const _HTTPS_PORT = "4441";

const _app = express();
const _interfaces = os.networkInterfaces();
const _allowedHostnames = ['user.gateway.riptest', 'user.service.riptest'];

const _corsOptions = {
    credentials: true,
    origin: function (origin: any, callback: any) {
        if (!origin) {
            // Si l'origine n'est pas fournie dans l'en-tête de la requête
            callback(new Error('Origin not provided'));
        } else {
            // Extraction du hostname de l'origine
            const hostname = new URL(origin).hostname;
            // Vérification si le hostname est autorisé
            if (_allowedHostnames.includes(hostname)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    actionOnError: (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err) {
            let _apiResponse = Api.messages.use("HTTP_403");
            _apiResponse.message = err.toString();

            let _parser = new Api.parser(res);
            return _parser.setResponse(_apiResponse).sendResponse();
        } else {
            next();
        }
    }
}

const _httpsOptions = {
    key: ssl._httpsOptions.key,
    cert: ssl._httpsOptions.cert
}

const httpServer = http.createServer(_app);
const httpsServer = https.createServer(_httpsOptions, _app);

/* Configuration des sécurités & proxy */
_app.use(cookieParser(ssl._httpsOptions.cert));
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

_app.use(cors(_corsOptions), _corsOptions.actionOnError);
_app.use("/security/authentication", generateToken);
_app.use("/generateTestToken", generateToken);
_app.use("/*", verifyToken);



httpServer.listen(_HTTP_PORT, async () => {
    console.log(`API MS user en écoute sur http://security.service.riptest:${_HTTP_PORT} 🎉`);
});
/*
httpsServer.listen(_HTTPS_PORT, async () => {
    console.log(`API MS user en écoute sur http://security.service.riptest:${_HTTPS_PORT} 🎉`);
    // Parcourir les interfaces pour trouver l'adresse IP
    Object.keys(_interfaces).forEach(interfaceName => {
        const interfaceAddresses = _interfaces[interfaceName];
        interfaceAddresses?.forEach(address => {
            if (!address.internal && address.family === 'IPv4') {
                _IPAdresses.push(address.address);
            }
        });
        console.log(`Adresses IP de la machine: ${_IPAdresses.join(', ')}`)
    });
});*/