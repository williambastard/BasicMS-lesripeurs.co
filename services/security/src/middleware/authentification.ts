import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
const _jwtSecretSalt = "DEFAULTSALTRIPEURSCOM_@@03#";  // Retrieve the environment variable 

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function generateToken(
    password: string,
    payload: object = {},
    options: object = {}
): string {
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
    if (!token) return res.status(401).json({ status: "error", message: 'Access denied' });
    try {
        const decoded = jwt.verify(token?.split(" ")[1], _jwtSecretSalt);
        res.locals.session = decoded;
        res.status(200).json({ status: "success", message: "Token valid", request_url: req.url, request_type: req.method });
    } catch (error) {
        res.status(401).json({ status: "error", message: "Token error", error: error, newToken: generateToken("test") });
    }
};