import { Router } from "express";

import { UserController } from "../controllers/user.controllers";
//import { UserAuthController } from "../controllers/controllers/auth.controller";
import { AuthProxy } from "../middleware/auth.proxy";

const router = Router();

router.get(
    '/getUserById/:id',
    AuthProxy,
    UserController.getUsers
);

router.get(
    '/getUserByName/:name',
    AuthProxy,
    UserController.getUsers
);
router.get(
    '/getUserByEmail/:email',
    AuthProxy,
    UserController.getUsers
);

//router.post("/login", UserAuthController.login);
//router.post("/signup", UserController.signup);


router.put(
    "/update/:id",
    AuthProxy,
    UserController.updateUser
);

router.delete(
    "/delete/:id",
    AuthProxy,
    UserController.deleteUser
);

export { router as userRouter };