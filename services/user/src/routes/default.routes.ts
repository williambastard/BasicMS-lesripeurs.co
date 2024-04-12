import { Router } from "express";
import ApiResponseParser from "../interfaces/api_response.parser";
const router = Router();

router.all("/:target?/:endpoint?", (req, res, next) => {
    const ApiObject = { statusCode: 501, message: "Functionality not implemented yet but the system work !", data: { url: req.url, headers: req.headers, params: req.params, body: req.body, query: req.query } };
    return ApiResponseParser.response(res, ApiObject);
}
);

router.all("/*", (req, res, next) => {
    const ApiObject = { statusCode: 501, message: "Functionality not implemented yet but the system work", data: { url: req.url, headers: req.headers, params: req.params, body: req.body, query: req.query } };
    return ApiResponseParser.response(res, ApiObject);
}
);

export { router as defaultRouter };