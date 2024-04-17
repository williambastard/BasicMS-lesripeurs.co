import { Router } from "express";
import * as Api from "private_modules";

const router = Router();

router.put("/*", (req, res, next) => {
    let _parser = new Api.parser(res); 
    
    let _apiResponse =Api.messages.use("HTTP_501");
    _apiResponse.data = {
        url: req.url,
        headers: req.headers,
        params: req.params,
        body: req.body,
        query: req.query
    }
    _parser
        .setResponse(_apiResponse)
        .sendResponse();
}
);

export { router as userPutRouter };