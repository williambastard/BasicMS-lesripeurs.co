import { Router } from "express";
import { UserController } from "../../../controllers/user.controllers";

const router = Router();

router.post("/signup", UserController.signup);

export { router as userSignUpRouter };