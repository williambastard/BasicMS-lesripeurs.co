import { Router } from "express";
import { UserAuthController } from "../controllers/auth.controller";
import { authentication } from "../middleware/security_micro_service.middleware";

const router = Router();

router.post("/*", UserAuthController.login, authentication);


export { router as authenticationRouter };