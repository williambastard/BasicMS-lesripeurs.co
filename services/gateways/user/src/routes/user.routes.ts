import { Router } from "express";
import * as Api from "private_modules";

const userGateway = Router();

userGateway.all("*", async (req, res, next) => {
    let _parser = new Api.parser(res);
    let _apiResponse = Api.messages.use("HTTP_500");

    try {
        const response = await new Api.call(req, res, "user", req.url, Number(process.env.USER_SERVICE_HTTP_PORT!.toString())).setGatewayIp(process.env.GATEWAYIP!.toString()).fetch()

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
}
);
export { userGateway as userGatewayRouter };