import { clear } from "console";
import { NextFunction, Request, Response } from "express";
import { hasUncaughtExceptionCaptureCallback } from "process";
import { ApiObject } from "../interfaces/api_response.interface";

import ApiResponseParser from "../helpers/api_response.parser";

const headers: HeadersInit = new Headers();


headers.set('Content-Type', 'application/json');

export const AuthProxy = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let ApiObject: ApiObject = { statusCode: 500, message: "Error from MS User : Internal server error" };
    let onFailure = false;
    const MS_SECURITY_URL = "http://127.0.0.10:8084/user";
    const options = {
        headers: {
            'Authorization': req.get('Authorization') ?? '',
            'Content-Type': 'application/json'
        },
        method: req.method,
    };

    try {
        const response = await fetch(`${MS_SECURITY_URL}${req.url}`, options)
        const _ms_security_response = await response.json();
        const _ms_security_data = _ms_security_response?.data ?? false;
        const _ms_security_session = _ms_security_data?.session ?? false;

        if (!response.ok) {
            ApiObject.statusCode = response.status;
            ApiObject.details = _ms_security_response;
            onFailure = !onFailure;
        }
        if (!_ms_security_session) {
            ApiObject = { statusCode: response.status, message: "Undefined jsonResponse.session in MS Security", details: _ms_security_response };
            onFailure = !onFailure;
        }
        res.locals.session = _ms_security_session;



    }
    catch (UncaughtException) {
        ApiObject = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
        onFailure = !onFailure;
    }
    return (onFailure) ? ApiResponseParser.response(res, ApiObject) : next();

};