import { Router } from "express";

import { UserController } from "../controllers/user.controllers";
//import { UserAuthController } from "../controllers/controllers/auth.controller";
import { SecurityMicroSevice } from "../middleware/security_micro_service.middleware";

const router = Router();

//router.post("/login", UserAuthController.login);
//router.post("/signup", UserController.signup);

router.get(
    '/getUserById/:userId',
    SecurityMicroSevice,
    UserController.getUsers
);

router.get(
    '/getUserByName/:lastnames',
    SecurityMicroSevice,
    UserController.getUsers
);
router.get(
    '/getUserByEmail/:email',
    SecurityMicroSevice,
    UserController.getUsers
);

router.put(
    "/update/:userId",
    SecurityMicroSevice,
    UserController.updateUser
);

router.patch(
    "/update/:userId",
    SecurityMicroSevice,
    UserController.updateUser
);

router.delete(
    "/deleteuserById/:userId",
    SecurityMicroSevice,
    UserController.deleteUser
);

export { router as userRouter };