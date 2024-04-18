import { Router } from "express";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { UserController } from "../../../controllers/user.controllers";
import { Authorization } from "../../../middleware/authorization";

const userDelete = Router();

userDelete.delete(
    "/deleteuserById/:userId",
    tokenValidator, Authorization.checkExistance,UserController.deleteUser
);

export { userDelete as userDeleteRouter };