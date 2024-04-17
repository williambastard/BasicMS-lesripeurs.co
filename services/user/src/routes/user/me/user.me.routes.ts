import { Router } from "express";
import { UserController } from "../../../controllers/user.controllers";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { Authorization } from "../../../middleware/authorization";

const userMe = Router();

userMe.all("/me", tokenValidator, Authorization.checkExistance, UserController.myInformations);

export { userMe as userMeRouter };