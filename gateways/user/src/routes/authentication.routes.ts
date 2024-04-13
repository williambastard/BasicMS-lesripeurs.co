import { Router } from "express";
import fetchOptions from "../interfaces/fetch_options.interface";
import * as ApiContructor from "../api_parser/api_parser";
import ApiInterface from "../api_parser/api_interface";

const router = Router();

router.post("/*", async function (req, res, next) {
    let _apiConstructor = new ApiContructor.Constructor(res);
    let _apiResponse = ApiContructor.default._HTTP_500;

    let _fetchOptions = new fetchOptions(req.method);
    _fetchOptions.setHeader('ms-user-method', req.method);
    _fetchOptions.setHeader('ms-target-service', 'authentication');
    _fetchOptions.setHeader('ms-target-protocol', 'http');
    _fetchOptions.setHeader('ms-target-host', 'user.service.riptest:8383');
    _fetchOptions.setHeader('ms-target-endpoint', req.url.replace('/', ''));
    _fetchOptions.setBody(req.body);


    try {
        const response = await fetch(`${_fetchOptions.getTarget()}`, _fetchOptions)
        const _ms_user_response = await response.json();
        _apiResponse = _ms_user_response;
    }
    catch (UncaughtException) {
        _apiResponse = ApiContructor.default._HTTP_501;
        _apiResponse.details = UncaughtException;

    }
    return _apiConstructor.setResponse(_apiResponse as ApiInterface).sendResponse();
});

export { router as authenticationRouter };