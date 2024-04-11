import { Router } from "express";
import { authentification } from "../middleware/authentification";

const router = Router();

router.all("*", authentification);

export { router as authRouter };