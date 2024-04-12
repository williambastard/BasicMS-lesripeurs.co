import { Router } from "express";
import { ApiObject } from "../interfaces/api_response.interface";

import fetchOptions from "../interfaces/fetch_options.interface";
//import ApiResponseParser from "../helpers/api_response.parser";



let ApiObject: ApiObject = { statusCode: 500, message: "Error from Gateway User : Internal server error" };
let _fetchOptions = new fetchOptions("GET");

const router = Router();


router.put("*", async function (req, res, next) {

    _fetchOptions.setHeader('Authorization', req.get('Authorization') ?? '');
    _fetchOptions.setHeader('ms-user-method', 'GET');
    _fetchOptions.setHeader('ms-target-service', 'user');
    _fetchOptions.setHeader('ms-target-protocol', 'http');
    _fetchOptions.setHeader('ms-target-host', 'localhost:8383');
    _fetchOptions.setHeader('ms-target-endpoint', req.url.replace('/', ''));
    _fetchOptions.setBody(JSON.stringify(req.body));
    _fetchOptions.setMethod(req.method);


    try {
        const response = await fetch(`${_fetchOptions.getTarget()}`, _fetchOptions)
        const _ms_user_response = await response.json();
        const _ms_user_data = _ms_user_response!.data ?? false;
        const _ms_user_session = _ms_user_data!.session ?? false;


        if (!response.ok) {
            ApiObject.statusCode = response.status;
            ApiObject.details = _ms_user_response;
        }
        if (!_ms_user_session) {
            ApiObject = { statusCode: response.status, message: "MS User Fault : Impossible to get the Session with the token given see details section for more informations", details: _ms_user_response };
        }
        res.locals.session = _ms_user_session;
        ApiObject = _ms_user_response;

    }
    catch (UncaughtException) {
        ApiObject = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
    }
    //return ApiResponseParser.response(res, ApiObject);
});

export { router as userRouterPut };