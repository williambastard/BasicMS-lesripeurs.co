import { Router } from "express";
import ApiParser from "private_modules";

const router = Router();

router.post("*", async function (req, res, next) {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_500");

    try {
        const response = await new ApiParser.Call(req, res, "user", req.url, 8282).fetch();
        if (!response._isOK) {
            _apiResponse = {
                statusCode: response._status,
                message: "Internal server error during response",
                details: response._callResponse
            };
        }
        if (!response._session) {
            _apiResponse = {
                statusCode: response._status,
                message: "MS User Fault : Impossible to get the Session with the token given see details section for more informations",
                details: response._callResponse
            };
        }
        res.locals.session = response._session;
        _apiResponse = response._callResponse;

    }
    catch (UncaughtException) {
        _apiResponse = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
    }
    return _apiConstructor.setResponse(_apiResponse).sendResponse();
});

export { router as userPostRouter };