
import { NextFunction, Request, Response } from "express";
import fetchOptions from "../interfaces/fetch_options.interface";
import ApiParser from "private_modules";

export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiDefaultResponse.get("HTTP_500");

    let _fetchOptions = new fetchOptions(req.method);
    _fetchOptions.setHeader('ms-security-method', req.method);
    _fetchOptions.setHeader('ms-target-service', 'authentication');
    _fetchOptions.setHeader('ms-target-protocol', 'http');
    _fetchOptions.setHeader('ms-target-host', 'security.service.riptest:8181');
    _fetchOptions.setHeader('ms-target-endpoint', req.url.replace('/', ''));
    _fetchOptions.setBody(res.locals.session);


    try {
        const response = await fetch(`${_fetchOptions.getTarget()}`, _fetchOptions)
        const _ms_security_response = await response.json();
        const _ms_security_data = _ms_security_response?.data ?? false;
        const _ms_security_token = _ms_security_data?.token ?? false;
        const _ms_security_message = _ms_security_response!.message ?? "Undefined jsonResponse.token in MS Security";

        if (!_ms_security_token) {
            _apiResponse = {
                statusCode: response.status,
                message: _ms_security_message,
                details: _ms_security_response
            };
        }
        _apiResponse = {
            statusCode: response.status,
            message: "User connected with success !",
            token: _ms_security_token, data: {
                token: _ms_security_token
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
    return _apiConstructor.setResponse(_apiResponse).sendResponse()
};

export const tokenValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiDefaultResponse.get("HTTP_500");

    let onFailure = false;
    let _fetchOptions = new fetchOptions(req.method);
    _fetchOptions.setHeader('token', req.get('token') ?? '');
    _fetchOptions.setHeader('ms-security-method', 'GET');
    _fetchOptions.setHeader('ms-target-service', 'security');
    _fetchOptions.setHeader('ms-target-protocol', 'http');
    _fetchOptions.setHeader('ms-target-host', 'security.service.riptest:8181');
    _fetchOptions.setHeader('ms-target-endpoint', req.url.replace('/', ''));


    try {
        const response = await fetch(`${_fetchOptions.getTarget()}`, _fetchOptions)
        const _ms_security_response = await response.json();
        const _ms_security_data = _ms_security_response?.data ?? false;
        const _ms_security_message = _ms_security_response!.message ?? "Undefined jsonResponse.session in MS Security";
        const _ms_security_details = _ms_security_response!.details ?? _ms_security_response;
        const _ms_security_session = _ms_security_data?.session ?? false;


        if (!response.ok) {
            _apiResponse = {
                statusCode: response.status,
                message: "Internal server error",
                details: _ms_security_response
            };
            onFailure = true;
        }
        if (!_ms_security_session) {
            _apiResponse = {
                statusCode: response.status,
                message: _ms_security_message,
                details: _ms_security_details
            };
            onFailure = true;
        }
        res.locals.session = {
            session: _ms_security_session
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
    return (onFailure) ? _apiConstructor.setResponse(_apiResponse).sendResponse() : next();
};