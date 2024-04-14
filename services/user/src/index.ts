import os from 'os';
import cors from "cors";
import http from "http";
import https from "https";
import ApiParser from "private_modules";
import express, { Request, Response, NextFunction } from 'express';

import { userRouter } from "./routes/user.routes";
import { defaultRouter } from "./routes/default.routes";
import { authenticationRouter } from "./routes/authentication.routes";

// Récupérer les interfaces réseau de la machine
const _HTTP_PORT = "8282";
const _HTTPS_PORT = "4442";

const _app = express();
const _interfaces = os.networkInterfaces();
const _allowedHostnames = ['user.gateway.riptest'];
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
            console.log(req.hostname);
            res.status(401).json({ error: err.message });
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
_app.use("/user", userRouter);
_app.use("/", defaultRouter);


httpServer.listen(_HTTP_PORT, async () => {
    console.log(`API MS user en écoute sur http://user.service.riptest:${_HTTP_PORT} 🎉`);

    // Parcourir les interfaces pour trouver l'adresse IP
    Object.keys(_interfaces).forEach(interfaceName => {
        const interfaceAddresses = _interfaces[interfaceName];
        interfaceAddresses?.forEach(address => {
            if (!address.internal && address.family === 'IPv4') {
                console.log(`Adresse IP de la machine: ${address.address}`);
            }
        });
    });
});