import http from "http";
import express from "express";

import { verifyToken, generateToken } from "./middleware/authentification";

const PORT = "8484";

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