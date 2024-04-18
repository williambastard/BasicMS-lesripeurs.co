import os from 'os';
import cors from "cors";
import http from "http";
import https from "https";
import * as Api from "private_modules";
import cookieParser from 'cookie-parser';
import express, { Request, Response, NextFunction } from 'express';

import { defaultRouter } from "./routes/default.routes";
import { authenticationRouter } from "./routes/authentication/authentication.routes";
import { userFindRouter } from './routes/user/find/user.get.routes';
import { userDeleteRouter } from './routes/user/delete/user.delete.routes';
import { userSignUpRouter } from './routes/user/signup/user.signup.routes';
import { userUpdateRouter } from './routes/user/update/user.update.routes';
import { userMeRouter } from './routes/user/me/user.me.routes';
import { Authorization } from './middleware/authorization';

// Récupérer les interfaces réseau de la machine
let _IPAdresses: string[] = [];

const _HTTPS_PORT = "4442";

const _app = express();
const _interfaces = os.networkInterfaces();
const _allowedHostnames = ['user.gateway.riptest'];
const _corsOptions = {
    credentials: true,
    origin: function (origin: any, callback: any) {
        if (!origin) {
            // Si l'origine n'est pas fournie dans l'en-tête de la requête
            callback(new Error('Origin not provided for User service'));
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
        console.log(req.get('Origin'));
        if (err) {
            let _apiResponse = Api.messages.use("HTTP_403");
            _apiResponse.message = err.toString();
            _apiResponse.details = { body: req?.body, headers: req.headers };

            let _parser = new Api.parser(res);
            return _parser.setResponse(_apiResponse).sendResponse();
        } else {
            next();
        }
    }
}

const _httpsOptions = {
    key: process.env.KEY,
    cert: process.env.CERT
}
const httpServer = http.createServer(_app);
const httpsServer = https.createServer(_httpsOptions, _app);

/* Configuration des sécurités & proxy */
_app.use(Authorization.checkIP);
_app.use(cors(_corsOptions), _corsOptions.actionOnError);
_app.use(cookieParser(process.env.KEY));
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
_app.use("/user/authentication", authenticationRouter);
_app.use("/user", userMeRouter);
_app.use("/user", userFindRouter);
_app.use("/user", userUpdateRouter);
_app.use("/user", userSignUpRouter);
_app.use("/user", userDeleteRouter);
_app.use("/", defaultRouter);


httpServer.listen(Number(process.env.USER_SERVICE_HTTP_PORT!.toString()), async () => {
    console.log(`API MS user en écoute sur http://user.service.riptest:${Number(process.env.USER_SERVICE_HTTP_PORT!.toString())} 🎉`);
    Object.keys(_interfaces).forEach(interfaceName => {
        const interfaceAddresses = _interfaces[interfaceName];
        interfaceAddresses?.forEach(address => {
            _IPAdresses.push(address.address);

        });
    });
    console.log(`Adresses IP de la machine: ${_IPAdresses.join(', ')}`)
    console.log(`Adresses IP en whitelist : ${process.env.WHITELIST ? process.env.WHITELIST.split(',') : []}`)
});

/*

httpsServer.listen(Number(process.env.USER_SERVICE_HTTPS_PORT!.toString()), async () => {
    console.log(`API MS user en écoute sur http://user.service.riptest:${Number(process.env.USER_SERVICE_HTTPS_PORT!.toString())} 🎉`);
});

*/