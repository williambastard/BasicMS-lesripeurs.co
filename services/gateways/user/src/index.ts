import os from 'os';
import cors from "cors";
import http from "http";
import https from "https";
import cookieParser from "cookie-parser";
import express from 'express';

import { defaultRouter } from "./routes/default.routes";
import { userGatewayRouter } from './routes/user.routes';
import { securityGatewayRouter } from './routes/security.routes';
import { authenticationRouter } from "./routes/authentication.routes";

// Récupérer les interfaces réseau de la machine
let _IPAdresses: string[] = [];

const _HTTP_PORT = "80";
const _HTTPS_PORT = "443";

const _app = express();
const _interfaces = os.networkInterfaces();


const _httpsOptions = {
    key: process.env.KEY,
    cert: process.env.CERT
}

const httpServer = http.createServer(_app);
const httpsServer = https.createServer(_httpsOptions, _app);

/* Configuration des sécurités & proxy */
_app.set('trust proxy', process.env.GATEWAYIP);
_app.use(cookieParser(process.env.KEY));
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
_app.use("/authentication", securityGatewayRouter);
_app.use("/authentication", authenticationRouter);
_app.use("/user", userGatewayRouter);
_app.use("/*", defaultRouter);


httpServer.listen(_HTTP_PORT, async () => {
    console.log(`API MS user en écoute sur http://user.service.riptest:${_HTTP_PORT} 🎉`);
});

httpsServer.listen(_HTTPS_PORT, async () => {
    console.log(`API MS user en écoute sur http://user.gateways.riptest:${_HTTPS_PORT} 🎉`);
    Object.keys(_interfaces).forEach(interfaceName => {
        const interfaceAddresses = _interfaces[interfaceName];
        interfaceAddresses?.forEach(address => {
            _IPAdresses.push(address.address);

        });
    });
    console.log(`Adresses IP de la machine: ${_IPAdresses.join(', ')}`)
    console.log(`Adresses IP en whitelist : ${process.env.WHITELIST}`)
});