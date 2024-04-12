import { Router } from "express";
import ApiResponseParser from "../interfaces/api_response.parser";
const router = Router();

router.all("/:target/:endpoint?", (req, res, next) => {
    const ApiObject = { statusCode: 200, message: "Functionality not implemented yetm but it's work !", data: { url: req.url, headers: req.headers, params: req.params, body: req.body, query: req.query } };
    return ApiResponseParser.response(res, ApiObject);
}
);

export { router as defaultRouter };