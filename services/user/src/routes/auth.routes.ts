import { Router } from "express";
import httpProxy from "http-proxy";

const API_SERVICE = "user";
const API_PROCOTOL = "http://";
const API_USER_HOST = "127.0.0.10:8084";

const apiProxy = httpProxy.createProxyServer();
const router = Router();

router.all("*", async (req, res, next) => {
    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', req.get("Authorization") ?? "".toString());

    const options = {
        headers: headers,
        method: req.method
    };
    const response = await fetch(`${API_PROCOTOL}${API_USER_HOST}/${API_SERVICE}${req.url}`, options).then(res => res.json());/*
    if (!response.ok) {
        res.status(500).json(response)
        next(response);
    }*/
    next();

});

export { router as authRouter };