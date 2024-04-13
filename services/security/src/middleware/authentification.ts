import { NextFunction, Request, Response } from "express";
import { ApiObject } from "../interfaces/api_response.interface";
import ApiResponseParser from "../interfaces/api_response.parser";
import * as jwt from "jsonwebtoken";

const _jwtSecretSalt = "DEFAULTSALTRIPEURSCOM_@@03#";  // Retrieve the environment variable 
let ApiObject: ApiObject = { statusCode: 401, message: "Access denied" };

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
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
    ApiObject = { statusCode: 200, message: "Your token is ready, find it in data.token", data: { token: tokenGenerator(req.body ?? { userId: -1, lastnames: "COMPTE DE TEST", firstnames: "Albert" }), request_url: req.url, request_type: req.method } };
    ApiResponseParser.response(res, ApiObject);
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header('Token');
    try {
        const decodedToken = jwt.verify(token!, _jwtSecretSalt);
        res.locals.session = decodedToken;
        ApiObject = { statusCode: 200, message: "Your token is valid !", data: { session: decodedToken, request_url: req.url, request_type: req.method } };
    } catch (error) {
        ApiObject = { statusCode: 498, message: "Your token is invalid or expired !", details: { error } };
    }
    ApiResponseParser.response(res, ApiObject);
};