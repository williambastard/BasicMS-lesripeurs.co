import { Router } from "express";
const router = Router();

router.all("*", (req, res, next) => {
    res.status(505).json({ message: "Bad Request MS User" })
}
);

export { router as defaultRouter };