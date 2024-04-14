import http from "http";
import express from "express";
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

import { verifyToken, generateToken } from "./middleware/authentification";

const PORT = "8181";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

app.use("/authentication", generateToken);
app.use("/generateTestToken", generateToken);
app.use(verifyToken);



httpServer.listen(PORT, async () => {
    console.log(`API MS user en écoute sur http://security.service.riptest:${PORT} 🎉`);
});