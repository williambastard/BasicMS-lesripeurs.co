import { Router } from "express";
import * as Api from "private_modules";

const router = Router();

router.delete("/*", (req, res, next) => {
    let _parser = new Api.parser(res);
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

    _parser
        .setResponse(_apiResponse)
        .sendResponse();
}
);

export { router as userDeleteRouter };