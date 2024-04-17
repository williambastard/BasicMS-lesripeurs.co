
import { NextFunction, Request, Response } from "express";
import * as Api from "private_modules";

export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let _parser = new Api.parser(res);
    let _apiResponse = Api.messages.use("HTTP_500");

    try {
        req.body.userId = res.locals.session.userId ?? 0;
        const response = await new Api.call(req, res, "security", "authentication", 8181).fetch();

        if (!response._isOK) {
            _apiResponse = {
                statusCode: response._status,
                message: "Internal server error",
                details: response._callResponse
            };
        }

        _apiResponse = {
            statusCode: 200,
            message: "User connected with success !",
            token: response._callResponse.token,
            data: {
                token: response._callResponse.token
            },
            details: {
                session: res.locals.session,
            }
        };
    }
    catch (UncaughtException) {
        _apiResponse = {
            statusCode: 500,
            message: "UncaughtException Exception",
            details: UncaughtException
        };
    }
    return _parser.setResponse(_apiResponse).sendResponse()
};

export const tokenValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let _parser = new Api.parser(res);
    let _apiResponse = Api.messages.use("HTTP_500");
    let onFailure = false;
    try {
        const response = await new Api.call(req, res, "security", "authentication/tokenValidator", 8181).fetch();
        
        if (!response._isOK) {
            _apiResponse = {
                statusCode: response._status,
                message: "Internal server error",
                details: response._callResponse
            };
            onFailure = true;
        }
        if (!response._session) {
            _apiResponse = {
                statusCode: response._status,
                message: response._callResponse.message
            };
            onFailure = true;
        }
        res.locals.session = {
            session: response._session
        };

    }
    catch (UncaughtException) {
        _apiResponse = {
            statusCode: 500,
            message: "UncaughtException Exception",
            details: UncaughtException
        };
        onFailure = !onFailure;
    }
    return (onFailure) ? _parser.setResponse(_apiResponse).sendResponse() : next();
};