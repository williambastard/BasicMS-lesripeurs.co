import { Router } from "express";
import * as ApiContructor from "../api_parser/api_parser";
import ApiInterface from "../api_parser/api_interface";
const router = Router();

router.all("/*", (req, res, next) => {
    let _apiConstructor = new ApiContructor.Constructor(res);
    let _apiResponse =
    {
        statusCode: 501,
        message: "Functionality not implemented yet but the system work",
        data: {
            url: req.url,
            headers: req.headers,
            params: req.params,
            body: req.body,
            query: req.query
        }
    };

    _apiConstructor
        .setResponse(_apiResponse as ApiInterface)
        .sendResponse();
}
);

export { router as defaultRouter };