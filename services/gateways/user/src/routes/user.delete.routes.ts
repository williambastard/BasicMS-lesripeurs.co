import { Router } from "express";
import ApiParser from "private_modules";

const router = Router();

router.delete("/*", (req, res, next) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
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
        .setResponse(_apiResponse)
        .sendResponse();
}
);

export { router as userDeleteRouter };