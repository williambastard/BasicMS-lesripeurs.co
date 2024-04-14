import { Router } from "express";
import fetchOptions from "../interfaces/fetch_options.interface";
import ApiParser from "private_modules";

const router = Router();

router.post("*", async function (req, res, next) {

    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiDefaultResponse.get("HTTP_500");

    let _fetchOptions = new fetchOptions(req.method);
    _fetchOptions.setHeader('token', req.get('token') ?? '');
    _fetchOptions.setHeader('ms-user-method', 'GET');
    _fetchOptions.setHeader('ms-target-service', 'user');
    _fetchOptions.setHeader('ms-target-protocol', 'http');
    _fetchOptions.setHeader('ms-target-host', 'user.service.riptest:8282');
    _fetchOptions.setHeader('ms-target-endpoint', req.url.replace('/', ''));


    try {
        const response = await fetch(`${_fetchOptions.getTarget()}`, _fetchOptions)
        const _ms_user_response = await response.json();
        const _ms_user_data = _ms_user_response!.data ?? false;
        const _ms_user_session = _ms_user_data!.session ?? false;


        if (!response.ok) {
            _apiResponse = {
                statusCode: response.status,
                message: "Internal server error during response",
                details: _ms_user_response
            };
        }
        if (!_ms_user_session) {
            _apiResponse = {
                statusCode: response.status,
                message: "MS User Fault : Impossible to get the Session with the token given see details section for more informations",
                details: _ms_user_response
            };
        }
        res.locals.session = _ms_user_session;
        _apiResponse = _ms_user_response;

    }
    catch (UncaughtException) {
        _apiResponse = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
    }
    return _apiConstructor.setResponse(_apiResponse).sendResponse();
});

export { router as userPostRouter };