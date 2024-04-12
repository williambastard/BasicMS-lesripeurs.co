import http from "http";
import express from "express";

import { defaultRouter } from "./routes/default.routes";
import { userRouterGet } from "./routes/user.get.routes";
import { userRouterPost } from "./routes/user.post.routes";
import { userRouterPut } from "./routes/user.put.routes";
import { userRouterDelete } from "./routes/user.deleteroutes";
import { userRouterPatch } from "./routes/user.patch.routes";

const HOST = "";
const PORT = "8282";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */
app.use("/user", userRouterGet);
app.use("/user", userRouterPost);
app.use("/user", userRouterPut);
app.use("/user", userRouterPatch);
app.use("/user", userRouterDelete);


app.use("*", defaultRouter);

httpServer.listen(PORT, async () => {
    console.log(`API Gateway en écoute sur http://user.gateway.riptest:${PORT} 🎉`);
});