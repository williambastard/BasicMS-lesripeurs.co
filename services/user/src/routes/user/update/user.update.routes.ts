import { Router } from "express";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { UserController } from "../../../controllers/user.controllers";

const userUpdate = Router();

userUpdate.put(
    "/update/:userId",
    tokenValidator,
    UserController.updateUser
); 

userUpdate.patch(
    "/update/:userId",
    tokenValidator,
    UserController.updateUser
);

export { userUpdate as userUpdateRouter };