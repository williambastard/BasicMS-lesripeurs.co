import http from "http";
import express from "express";

import { userRouter } from "./routes/user.routes";
import { defaultRouter } from "./routes/default.routes";
const HOST = "http://127.0.0.10";
const PORT = "8082";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
app.use("/user", userRouter);
app.use("*", defaultRouter);

httpServer.listen(PORT, async () => {
    console.log(`API Gateway en écoute sur ${HOST}:${PORT} 🎉`);
});