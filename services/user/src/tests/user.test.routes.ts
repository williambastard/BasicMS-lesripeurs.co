import { Router } from "express";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import { UserController } from "../controllers/user.controllers";

const router = Router();

router.all("/*", (req, res, next) => {
    res.status(200).json({ "status": "OK", "path": "services/user/src/tests/user.test.routes.ts" });
});



export { router as UserRouteWithProxy };
export { router as UserRouteWithProxyTest };