import http from "http";
import express from "express";

import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { defaultRouter } from "./routes/default.routes";

const HOST = "http://127.0.0.10";
const PORT = "8083";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

app.use("/user", userRouter);
app.use("*", defaultRouter);


httpServer.listen(PORT, async () => {
    console.log(`API MS user en écoute sur ${HOST}:${PORT} 🎉`);
});