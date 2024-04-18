import { Router } from "express";
import { UserController } from "../../../controllers/user.controllers";

const userSignUp = Router();

userSignUp.post("/signup", UserController.signup);

export { userSignUp as userSignUpRouter };