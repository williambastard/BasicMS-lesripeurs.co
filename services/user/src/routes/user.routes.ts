import { Router } from "express";

import { UserController } from "../controllers/user.controllers";
import { authentication, tokenValidator } from "../middleware/security_micro_service.middleware";

const router = Router();

router.post("/signup", UserController.signup);

router.get(
    '/getUserById/:userId',
    tokenValidator,
    UserController.getUsers
);

router.get(
    '/getUserByName/:lastnames',
    tokenValidator,
    UserController.getUsers
);
router.get(
    '/getUserByEmail/:email',
    tokenValidator,
    UserController.getUsers
);

router.put(
    "/update/:userId",
    tokenValidator,
    UserController.updateUser
);

router.patch(
    "/update/:userId",
    tokenValidator,
    UserController.updateUser
);

router.delete(
    "/deleteuserById/:userId",
    tokenValidator,
    UserController.deleteUser
);

export { router as userRouter };