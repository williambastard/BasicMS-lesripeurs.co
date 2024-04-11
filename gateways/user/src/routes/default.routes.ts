import { Router } from "express";
const router = Router();

router.all("*", (req, res, next) => {
    console.log(req.url);
    res.status(505).json({ message: "Bad Request API Gateway" })
}
);

export { router as defaultRouter };