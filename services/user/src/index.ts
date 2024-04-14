import http from "http";
import express from "express";

import { userRouter } from "./routes/user.routes";
import { defaultRouter } from "./routes/default.routes";
import { authenticationRouter } from "./routes/authentication.routes";
import * as os from 'os';

// Récupérer les interfaces réseau de la machine
const interfaces = os.networkInterfaces();

// Parcourir les interfaces pour trouver l'adresse IP
Object.keys(interfaces).forEach(interfaceName => {
    const interfaceAddresses = interfaces[interfaceName];
    interfaceAddresses?.forEach(address => {
        if (!address.internal && address.family === 'IPv4') {
            console.log(`Adresse IP de la machine: ${address.address}`);
        }
    });
});

const PORT = "8383";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

app.use("/authentication", authenticationRouter);
app.use("/user", userRouter);
app.use("/", defaultRouter);


httpServer.listen(PORT, async () => {
    console.log(`API MS user en écoute sur http://user.service.riptest:${PORT} 🎉`);
});