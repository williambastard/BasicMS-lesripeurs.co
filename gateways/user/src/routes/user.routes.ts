import { Router } from "express";

import { authentification } from "../middleware/authentification";
import { authorization } from "../middleware/authorization";
import { UserController } from "../controllers/user.controllers";
import { UserAuthController } from "../controllers/auth.controller";

const router = Router();


router.get(
    '/getUserById/:id',
    authentification,
    authorization(["admin"]),
    UserController.getUsers
);
router.get(
    '/getUserByName/:name',
    authentification,
    authorization(["admin"]),
    UserController.getUsers
);
router.get(
    '/getUserByEmail/:email',
    authentification,
    authorization(["admin"]),
    UserController.getUsers
);



router.post("/login", UserAuthController.login);
router.post("/signup", UserController.signup);


router.put(
    "/update/:id",
    authentification,
    authorization(["user", "admin"]),
    UserController.updateUser
);

router.delete(
    "/delete/:id",
    authentification,
    authorization(["admin"]),
    UserController.deleteUser
);

export { router as userRouter };