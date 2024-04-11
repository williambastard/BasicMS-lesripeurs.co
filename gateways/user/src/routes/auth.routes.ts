import { Router } from "express";
import httpProxy from "http-proxy";

const API_SERVICE = "user";
const API_PROCOTOL = "http://";
const API_USER_HOST = "127.0.0.10:8084";

const apiProxy = httpProxy.createProxyServer();
const router = Router();

router.all("*", (req, res, next) => {
    req.url = `${API_PROCOTOL}${API_USER_HOST}/${API_SERVICE}${req.url}`;
    console.log(req.url);
    
    apiProxy.web(req, res, { target: `${API_PROCOTOL}${API_USER_HOST}` }, function (apiProxyError) {
        if (apiProxyError) {
            res.status(500).json({ message: "Error encoured by MS Security", error: apiProxyError })
            next(apiProxyError);
        }
        console.log("test");
        next();
    });

});

export { router as authRouter };