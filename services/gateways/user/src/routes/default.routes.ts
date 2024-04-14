import { Router } from "express";
import ApiParser from "private_modules";

const router = Router();

router.all("/*", (req, res, next) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiDefaultResponse.get("HTTP_501");
    _apiResponse.data = {
        url: req.url,
        headers: req.headers,
        params: req.params,
        body: req.body,
        query: req.query
    }


    _apiConstructor
        .setResponse(_apiResponse)
        .sendResponse();
}
);

export { router as defaultRouter };