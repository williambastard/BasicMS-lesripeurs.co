import { Router } from "express";

import { UserController } from "../controllers/user.controllers";
//import { UserAuthController } from "../controllers/controllers/auth.controller";
import { SecurityMicroSevice } from "../middleware/security_micro_service.middleware";

const router = Router();

//router.post("/login", UserAuthController.login);
//router.post("/signup", UserController.signup);

router.get(
    '/getUserById/:id',
    SecurityMicroSevice,
    UserController.getUsers
);

router.get(
    '/getUserByName/:name',
    SecurityMicroSevice,
    UserController.getUsers
);
router.get(
    '/getUserByEmail/:email',
    SecurityMicroSevice,
    UserController.getUsers
);

router.put(
    "/update/:id",
    SecurityMicroSevice,
    UserController.updateUser
);

router.patch(
    "/update/:id",
    SecurityMicroSevice,
    UserController.updateUser
);

router.delete(
    "/delete/:id",
    SecurityMicroSevice,
    UserController.deleteUser
);

export { router as userRouter };