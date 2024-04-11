import { Router } from "express";

import { UserController } from "../../../../services/user/src/controllers/user.controllers";
import { UserAuthController } from "../../../../services/user/src/controllers/auth.controller";

const router = Router();

router.all("*", (req, res, next) => {
    console.log(req.url);
    next();
}
);

router.get(
    '/getUserById/:id',
    UserController.getUsers
);

router.get(
    '/getUserByName/:name',
    UserController.getUsers
);
router.get(
    '/getUserByEmail/:email',
    UserController.getUsers
);

router.post("/login", UserAuthController.login);
router.post("/signup", UserController.signup);


router.put(
    "/update/:id",
    UserController.updateUser
);

router.delete(
    "/delete/:id",
    UserController.deleteUser
);

export { router as userRouter };