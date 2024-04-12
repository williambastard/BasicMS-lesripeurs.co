import { NextFunction, Request, Response } from "express";
import { ApiObject } from "../interfaces/api_response.interface";
import ApiResponseParser from "../interfaces/api_response.parser";

import * as jwt from "jsonwebtoken";
const _jwtSecretSalt = "DEFAULTSALTRIPEURSCOM_@@03#";  // Retrieve the environment variable 
let ApiObject: ApiObject = { statusCode: 401, message: "Access denied" };

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function generateToken(): string {
    const defaultOptions: object = {
        expiresIn: '1hr',
    };
    const token = jwt.sign({ username: "test" }, _jwtSecretSalt, defaultOptions);
    return token
};

export const authentification = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header('Authorization');
    try {
        const decodedToken = jwt.verify(token!.split(" ")[1], _jwtSecretSalt);
        res.locals.session = decodedToken;
        ApiObject = { statusCode: 200, message: "Token given is valid", data: { session: decodedToken, request_url: req.url, request_type: req.method } };
    } catch (error) {
        ApiObject = { statusCode: 498, message: "Token given is invalid", details: { newToken: generateToken(), error } };
    }
    ApiResponseParser.response(res, ApiObject);
};