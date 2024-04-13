import { NextFunction, Request, Response } from "express";
import ApiResponseParser from "../interfaces/api_response.parser";
import { Authentication } from "../models/authentication";
import { AuthenticateHelper } from "../helpers/authenticate.helper";

export abstract class UserAuthController {
    static async login(req: Request, res: Response, next: NextFunction) {

        let isSuccess = false;
        let ApiObject = { statusCode: 401, message: "Login failed : Wrong password or email.", data: undefined };

        const userLogin = new Authentication({ email: req.body.email, password: req.body.password });
        const authenticationResult = await AuthenticateHelper.authenticate(userLogin);

        if (authenticationResult) {
            res.locals.session = authenticationResult;
            isSuccess = true;
        }

        return isSuccess ? next() : ApiResponseParser.response(res, ApiObject);
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully finded !", data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }
}