import { clear } from "console";
import { NextFunction, Request, Response } from "express";

const API_SERVICE = "user";
const API_PROCOTOL = "http://";
const API_USER_HOST = "127.0.0.10:8084";

export const AuthProxy = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', req.get("Authorization") ?? "".toString());
    const options = {
        headers: headers,
        method: req.method
    };
    const response = await fetch(
        `${API_PROCOTOL}${API_USER_HOST}/${API_SERVICE}${req.url}`,
        options
    ).then(responses => responses.json());

    if (response.status !== 200) {
        res.json(response)
        next(response);
    }
    next();

};