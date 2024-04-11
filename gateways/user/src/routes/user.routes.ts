import { Router } from "express";
import { ApiObject } from "../interfaces/api_response.interface";

import ApiResponseParser from "../helpers/api_response.parser";

const router = Router();

router.all("*", async (req, res, next) => {
    let ApiObject: ApiObject = { statusCode: 500, message: "Error from Gateway User : Internal server error" };
    const MS_USER_URL = "http:/127.0.0.10:8083/user";
    const options = {
        headers: {
            'Authorization': req.get('Authorization') ?? '',
            'Content-Type': 'application/json'
        },
        method: req.method,
    };

    try {
        const response = await fetch(`${MS_USER_URL}${req.url}`, options)
        const _ms_user_response = await response.json();
        const _ms_user_data = _ms_user_response?.data ?? false;
        const _ms_user_session = _ms_user_data?.session ?? false;

        if (!response.ok) {
            ApiObject.statusCode = response.status;
            ApiObject.details = _ms_user_response;
        }
        if (!_ms_user_session) {
            ApiObject = { statusCode: response.status, message: "Undefined jsonResponse.session in MS User", details: _ms_user_response };
        }
        if (_ms_user_session && response.ok) {
            res.locals.session = _ms_user_session;
        }


    }
    catch (UncaughtException) {
        ApiObject = { statusCode: 500, message: "UncaughtException Exception", details: UncaughtException };
    }
    return ApiResponseParser.response(res, ApiObject);
});

export { router as userRouter };