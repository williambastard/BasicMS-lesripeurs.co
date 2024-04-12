
import { NextFunction, Request, Response } from "express";
import { ApiObject } from "../interfaces/api_response.interface";
import fetchOptions from "../interfaces/fetch_options.interface";
import ApiResponseParser from "../interfaces/api_response.parser";

const headers: HeadersInit = new Headers();


let ApiObject: ApiObject = { statusCode: 500, message: "Error from MS User : Internal server error" };


export const SecurityMicroSevice = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let onFailure = false;
    let _fetchOptions = new fetchOptions(req.method);
    _fetchOptions.setHeader('token', req.get('token') ?? '');
    _fetchOptions.setHeader('ms-security-method', 'GET');
    _fetchOptions.setHeader('ms-target-service', 'security');
    _fetchOptions.setHeader('ms-target-protocol', 'http');
    _fetchOptions.setHeader('ms-target-host', 'security.service.riptest:8484');
    _fetchOptions.setHeader('ms-target-endpoint', req.url.replace('/', ''));


    try {
        const response = await fetch(`${_fetchOptions.getTarget()}`, _fetchOptions)
        const _ms_security_response = await response.json();
        const _ms_security_data = _ms_security_response?.data ?? false;
        const _ms_security_message = _ms_security_response!.message ?? "Undefined jsonResponse.session in MS Security";
        const _ms_security_details = _ms_security_response!.details ?? _ms_security_response;
        const _ms_security_session = _ms_security_data?.session ?? false;
        console.log(_ms_security_response)

        if (!response.ok) {
            ApiObject.statusCode = response.status;
            ApiObject.details = _ms_security_response;
            onFailure = true;
        }
        if (!_ms_security_session) {
            ApiObject = { statusCode: response.status, message: _ms_security_message, details: _ms_security_details };
            onFailure = true;
        }
        res.locals.session = { session: _ms_security_session };

    }
    catch (UncaughtException) {
        ApiObject = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
        onFailure = !onFailure;
    }
    return (onFailure) ? ApiResponseParser.response(res, ApiObject) : next();
};