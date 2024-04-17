import { Router } from "express";
import { tokenValidator } from "../../../middleware/security_micro_service.middleware";
import { UserController } from "../../../controllers/user.controllers";
import { Authorization } from "../../../middleware/authorization";

const userFind = Router();

userFind.get('/getUserById/:userId', tokenValidator, Authorization.checkExistance, UserController.getUserById);
userFind.get('/getUserByLastnames/:lastnames', tokenValidator, Authorization.checkExistance, UserController.getUserByLastnames);
userFind.get('/getUserByEmail/:email', tokenValidator, Authorization.checkExistance, UserController.getUserByEmail);

export { userFind as userFindRouter };