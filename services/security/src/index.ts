import http from "http";
import express from "express";

import { authentification, generateTestToken } from "./middleware/authentification";

const PORT = "8484";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
app.use("/generateTestToken", generateTestToken);
app.use(authentification);


httpServer.listen(PORT, async () => {
    console.log(`API MS user en écoute sur http://security.service.riptest:${PORT} 🎉`);
});