import { Router } from "express";
const router = Router();

router.all("*", (req, res, next) => {
        res.status(501).json({ message: "Functionality not implemented yet" })
    }
);

export { router as defaultRouter };