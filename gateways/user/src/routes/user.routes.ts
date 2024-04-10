import { Router } from "express";

import { authentification } from "../middleware/authentification";
import { authorization } from "../middleware/authorization";
import { UserController } from "../controllers/user.controllers";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get(
    "/users",
    authentification,
    authorization(["admin"]),
    UserController.getUsers
);
router.post("/login", AuthController.login);
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