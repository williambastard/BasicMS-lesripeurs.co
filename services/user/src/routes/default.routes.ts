import ApiParser from "private_modules";
import { Router } from "express";

const router = Router();

router.all("/:target?/:endpoint?", (req, res, next) => {

    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_501")
    
    _apiResponse.data = {
        url: req.url,
        headers: req.headers,
        params: req.params,
        body: req.body,
        query: req.query
    }
    return _apiConstructor.setResponse(_apiResponse).sendResponse();
}
);

router.all("/*", (req, res, next) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_501");
    _apiResponse.data = {
        url: req.url,
        headers: req.headers,
        params: req.params,
        body: req.body,
        query: req.query
    }
    return _apiConstructor.setResponse(_apiResponse).sendResponse();
}
);

export { router as defaultRouter };