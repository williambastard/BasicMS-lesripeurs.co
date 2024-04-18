import { Router } from "express";
import * as Api from "private_modules";

const securityGateway = Router();

securityGateway.all("/tokenValidator", async (req, res, next) => {
    let _parser = new Api.parser(res);
    let _apiResponse = Api.messages.use("HTTP_500");

    try {
        const response = await new Api.call(req, res, "security", "authentication/tokenValidator", 8181).setGatewayIp("176.25.1.1").fetch()

        if (!response._isOK) {
            _apiResponse = {
                statusCode: response._status,
                message: "Internal server error during response",
                details: response._callResponse
            };
        }

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
export { securityGateway as securityGatewayRouter };