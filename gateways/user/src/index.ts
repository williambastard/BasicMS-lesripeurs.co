import http from "http";
import express from "express";

import { userRouter } from "./routes/user.routes";
import { defaultRouter } from "./routes/default.routes";
import { generateForgotPasswordJWT, verifyToken } from "./middleware/gatewayMiddleware";

const HOST = "http://127.0.0.10";
const PORT = "8082";

const app = express();
const httpServer = http.createServer(app);

/* Configuration des sécurités & proxy */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Gestion  des routes de l'application */

app.use("/user", verifyToken);

app.use("/user", userRouter);
/*
// Set up an HTTP Get listener at /protected. The request can only access it if they have a valid JWT token
app.get("/protected", (req, res, next) => {
    // The auth middleware protects this route and sets res.locals.session which can be accessed here
    const session = res.locals.session;
    console.log(generateForgotPasswordJWT("test"));
    res.status(200).json({ message: `Your username is`, session: res.locals });
});
*/
app.use("*", defaultRouter);


httpServer.listen(PORT, async () => {
    console.log(`SERVEUR HTTP À L'ECOUTE SUR ${HOST}:${PORT} 🎉`);
});