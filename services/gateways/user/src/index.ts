import http from "http";
import express from "express";

import { defaultRouter } from "./routes/default.routes";
import { userGetRouter } from "./routes/user.get.routes";
import { userPostRouter } from "./routes/user.post.routes";
import { userPutRouter } from "./routes/user.put.routes";
import { userDeleteRouter } from "./routes/user.delete.routes";
import { userPatchRouter } from "./routes/user.patch.routes";
import { authenticationRouter } from "./routes/authentication.routes";

const PORT = "8282";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
app.use("/authentication", authenticationRouter);
app.use("/user", userGetRouter);
app.use("/user", userPostRouter);
app.use("/user", userPutRouter);
app.use("/user", userPatchRouter);
app.use("/user", userDeleteRouter);
app.use("*", defaultRouter);

httpServer.listen(PORT, async () => {
    console.log(`API Gateway en écoute sur http://user.gateway.riptest:${PORT} 🎉`);
});