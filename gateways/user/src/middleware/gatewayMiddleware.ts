import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const _jwtSecretSalt = "DEFAULTSALTRIPEURSCOM_@@03#";  // Retrieve the environment variable 

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function generateForgotPasswordJWT(
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


export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    //console.log(generateForgotPasswordJWT("test"));
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        const decoded = jwt.verify(token?.split(" ")[1], _jwtSecretSalt);
        res.locals.session = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token error", error: error, newToken: generateForgotPasswordJWT("test") });
    }
};