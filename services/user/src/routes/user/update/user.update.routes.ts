import { Router } from "express";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { UserController } from "../../../controllers/user.controllers";
import { Authorization } from "../../../middleware/authorization";

const userUpdate = Router();

userUpdate.put("/update/:userId", tokenValidator, Authorization.checkExistance, UserController.updateUser);

userUpdate.patch("/update/:userId", tokenValidator, Authorization.checkExistance, UserController.updateUser);

export { userUpdate as userUpdateRouter };