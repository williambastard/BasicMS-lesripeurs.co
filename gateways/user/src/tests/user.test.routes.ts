import { Router } from "express";

const router = Router();

router.all("/*", (req, res, next) => {
    res.status(200).json({ "status": "OK", "path": "gateway/user/src/tests/user.test.routes.ts" });
});

export { router as UserRouteWithProxyTest };