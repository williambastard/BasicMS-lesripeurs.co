import os from 'os';
import cors from "cors";
import http from "http";
import https from "https";
import ApiParser from "private_modules";
import express, { Request, Response, NextFunction } from 'express';

import { defaultRouter } from "./routes/default.routes";
import { authenticationRouter } from "./routes/authentication.routes";
import { userDeleteRouter } from './routes/user.delete.routes';
import { userPatchRouter } from './routes/user.patch.routes';
import { userPutRouter } from './routes/user.put.routes';
import { userPostRouter } from './routes/user.post.routes';
import { userGetRouter } from './routes/user.get.routes';

// Récupérer les interfaces réseau de la machine
let _IPAdresses: string[] = [];

const _HTTP_PORT = "80";
const _HTTPS_PORT = "443";

const _app = express();
const _interfaces = os.networkInterfaces();
const _allowedHostnames = ['user.gateway.riptest'];
const _corsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin) {
            // Si l'origine n'est pas fournie dans l'en-tête de la requête
            callback(null, true);
            //callback(new Error('Origin not provided'));
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
_app.use("/authentication", authenticationRouter);
_app.use("/user", userGetRouter);
_app.use("/user", userPostRouter);
_app.use("/user", userPutRouter);
_app.use("/user", userPatchRouter);
_app.use("/user", userDeleteRouter);
_app.use("/*", defaultRouter);


httpServer.listen(_HTTP_PORT, async () => {
    console.log(`API MS user en écoute sur http://user.gateway.riptest:${_HTTP_PORT} 🎉`);    // Parcourir les interfaces pour trouver l'adresse IP
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