import http from "http";
import express from "express";

import { authentification } from "./middleware/authentification";

const HOST = "http://127.0.0.10";
const PORT = "8084";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
app.use(authentification);


httpServer.listen(PORT, async () => {
    console.log(`API MS user en écoute sur ${HOST}:${PORT} 🎉`);
});