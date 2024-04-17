import ApiParser from "private_modules";
import { NextFunction, Request, Response } from "express";
import { cryptoHelper } from "../helpers/crypto.helper";
import { timeHelper } from "../helpers/time.helper";

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export const generateToken = (
    req: Request,
    res: Response
) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_500");

    if (req.body?.userId > 0) {
        const expireIn = req.body?.expireIn ?? "1d";
        const userId = req.body?.userId ?? -1;
        const token = cryptoHelper.encrypt({ userId: userId, expireIn: expireIn });
        
        const _options = {
            maxAge: timeHelper.cookieDuration(expireIn), // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
            signed: true // Indicates if the cookie should be signed
        };

        res.set('X-Session-Id', token);
        res.set('X-Session-Max-Age-Value', `${_options.maxAge.toString()}`);
        res.set('X-Session-Max-Age-Unit', `seconds`);

        res.cookie('session', token, _options);
        res.cookie('sessionExpiryDate', _options.maxAge, _options);

        _apiResponse = { statusCode: 200, message: "Your token is ready, find it in data.token. He is valid for " + expireIn, token: token, data: { token: token, request_url: req.url, request_type: req.method } };
    } else {
        _apiResponse = { statusCode: 401, message: "Le payload ne contient pas de userId correcte à qui assigner ce token.", details: { payload: req.body } };
    }

    return _apiConstructor.setResponse(_apiResponse).sendResponse();
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_500");

    try {
        const token = (req.header('authorization') ?? "")?.replace('token ', '');
        const decodedToken = cryptoHelper.decrypt(token!);

        res.locals.session = decodedToken;
        _apiResponse = { statusCode: 200, message: "Your token is valid !", data: { session: decodedToken, request_url: req.url, request_type: req.method } };
    } catch (error) {
        _apiResponse = { statusCode: 498, message: "Your token is invalid or expired !", details: { error: error!.toString() } };
    }

    return _apiConstructor.setResponse(_apiResponse).sendResponse();
};