import { Router } from "express";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { UserController } from "../../../controllers/user.controllers";

const userDelete = Router();

userDelete.delete(
    "/deleteuserById/:userId",
    tokenValidator,
    UserController.deleteUser
);

export { userDelete as userDeleteRouter };