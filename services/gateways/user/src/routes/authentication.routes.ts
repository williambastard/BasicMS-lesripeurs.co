import { Router } from "express";
import ApiParser from "private_modules";

const Authentication = Router();

Authentication.post("/*", async function (req, res, next) {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_500");
    const response = await new ApiParser.Call(req, "user", req.url, 8282).fetch();
    try {
        _apiResponse = response._callresponse;
    }
    catch (UncaughtException) {
        _apiResponse.details = UncaughtException;

    }
    return _apiConstructor.setResponse(_apiResponse).sendResponse();
});

export { Authentication as authenticationRouter };