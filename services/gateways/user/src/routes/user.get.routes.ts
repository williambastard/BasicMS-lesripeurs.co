import { Router } from "express";
import * as Api from "private_modules";

const router = Router();

router.get("*", async function (req, res, next) {
    let _parser = new Api.parser(res);
    let _apiResponse =Api.messages.use("HTTP_500");

    try {
        const response = await new Api.call(req, res, "user", req.url, 8282).fetch();

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
            }
        }
        res.locals.session = response._session;
        _apiResponse = response._callResponse;

    }
    catch (UncaughtException) {
        _apiResponse = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
    }

    _parser
        .setResponse(_apiResponse)
        .sendResponse();
});

export { router as userGetRouter };