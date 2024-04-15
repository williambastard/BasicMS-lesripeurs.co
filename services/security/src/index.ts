import os from 'os';
import cors from "cors";
import http from "http";
import https from "https";
import ApiParser from "private_modules";
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
            let _apiResponse = ApiParser.ApiJSON.get("HTTP_403");
            _apiResponse.message = err.toString();

            let _apiConstructor = new ApiParser.ApiConstructor(res);
            return _apiConstructor.setResponse(_apiResponse).sendResponse();
        } else {
            next();
        }
    }
}

const httpServer = http.createServer(_app);

/* Configuration des sécurités & proxy */
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

_app.use(cors(_corsOptions), _corsOptions.actionOnError);
_app.use("/security/authentication", generateToken);
_app.use("/generateTestToken", generateToken);
_app.use("/*", verifyToken);



httpServer.listen(_HTTP_PORT, async () => {
    console.log(`API MS user en écoute sur http://security.service.riptest:${_HTTP_PORT} 🎉`);
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
});