import * as Api from "private_modules";
import { Router } from "express";

const router = Router();

router.all("/:target?/:endpoint?", (req, res, next) => {

    let _parser = new Api.parser(res);
    let _apiResponse =Api.messages.use("HTTP_501")
    
    _apiResponse.data = {
        url: req.url,
        headers: req.headers,
        params: req.params,
        body: req.body,
        query: req.query
    }
    return _parser.setResponse(_apiResponse).sendResponse();
}
);

router.all("/*", (req, res, next) => {
    let _parser = new Api.parser(res);
    let _apiResponse =Api.messages.use("HTTP_501");
    _apiResponse.data = {
        url: req.url,
        headers: req.headers,
        params: req.params,
        body: req.body,
        query: req.query
    }
    return _parser.setResponse(_apiResponse).sendResponse();
}
);

export { router as defaultRouter };