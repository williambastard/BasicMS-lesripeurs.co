import { Router } from "express";
import httpProxy from "http-proxy";

const API_SERVICE = "user";
const API_PROCOTOL = "http://";
const API_USER_HOST = "127.0.0.10:8083";

const apiProxy = httpProxy.createProxyServer();
const router = Router();

router.all("*", (req, res, next) => {

    const API_USER_ENDPOINTS = `${API_PROCOTOL}${API_USER_HOST}${API_SERVICE}${req.url}`;
    console.log(API_USER_ENDPOINTS);

    apiProxy.web(req, res, { target: API_USER_ENDPOINTS }, function (apiProxyError) {
        if (apiProxyError) {
            res.status(500).json({ message: "Error encoured by MS User", error: apiProxyError })
        }
    });
});

export { router as userRouter };