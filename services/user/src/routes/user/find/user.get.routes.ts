import { Router } from "express";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { UserController } from "../../../controllers/user.controllers";

const userFind = Router();

userFind.get(
    '/getUserById/:userId',
    tokenValidator,
    UserController.getUserById
);

userFind.get(
    '/getUserByLastnames/:lastnames',
    tokenValidator,
    UserController.getUserByLastnames
);
userFind.get(
    '/getUserByEmail/:email',
    tokenValidator,
    UserController.getUserByEmail
);

export { userFind as userFindRouter };