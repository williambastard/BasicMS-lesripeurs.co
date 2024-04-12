import http from "http";
import express from "express";

import { userRouter } from "./routes/user.routes";
import { defaultRouter } from "./routes/default.routes";

const PORT = "8383";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

app.use("/user", userRouter);
app.use("/", defaultRouter);


httpServer.listen(PORT, async () => {
    console.log(`API MS user en écoute sur http://localhost:${PORT} 🎉`);
});