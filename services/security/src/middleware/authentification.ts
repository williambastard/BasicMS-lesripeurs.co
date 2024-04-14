import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import ApiParser from "private_modules";


/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */



const _jwtSecretSalt = "DEFAULTSALTRIPEURSCOM_@@03#";  // Retrieve the environment variable 
export function tokenGenerator(object: Object): string {
    const defaultOptions: object = {
        expiresIn: '1hr',
    };
    const token = jwt.sign(object, _jwtSecretSalt, defaultOptions);
    return token
};

export const generateToken = (
    req: Request,
    res: Response
) => {
    const token = tokenGenerator(req.body ?? { userId: -1, lastnames: "COMPTE DE TEST", firstnames: "Albert" });
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = { statusCode: 200, message: "Your token is ready, find it in data.token", token: token, data: { token: token, request_url: req.url, request_type: req.method } };

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
        const token = req.header('Token') ?? "";
        const decodedToken = jwt.verify(token!, _jwtSecretSalt);
        res.locals.session = decodedToken;

        _apiResponse = { statusCode: 200, message: "Your token is valid !", data: { session: decodedToken, request_url: req.url, request_type: req.method } };
    } catch (error) {
        _apiResponse = { statusCode: 498, message: "Your token is invalid or expired !", details: { error } };
    }

    return _apiConstructor.setResponse(_apiResponse).sendResponse();
};