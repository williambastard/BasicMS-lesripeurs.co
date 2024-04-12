import { Router } from "express";

const router = Router();

router.all("/*", (req, res, next) => {
    return res.status(200).json({ "status": "OK", "path": "services/security/src/tests/test.routes.ts" });
});

export { router as SecurityRouteWithProxyTest };