import * as Api from "private_modules";
import { NextFunction, Request, Response } from "express";
import { Authentication } from "../models/authentication";

export abstract class UserAuthController {
    static async login(req: Request, res: Response, next: NextFunction) {

        let isSuccess = false;
        let _parser = new Api.parser(res);
        let _apiResponse = { statusCode: 401, message: "Login failed : Wrong password or email.", data: undefined };

        const userLogin = new Authentication({ email: req.body.email, password: req.body.password });
        const authenticationResult = await userLogin.authenticate();

        if (authenticationResult) {
            isSuccess = true;
            authenticationResult.password = "************";
            res.locals.session = authenticationResult;
            _apiResponse = { statusCode: 200, message: "User was successfully loged in !", data: res.locals.session };
        }

        return isSuccess ? next() : _parser.setResponse(_apiResponse).sendResponse();
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse = { statusCode: 200, message: "User was successfully finded !", data: res.locals.session };
        return _parser.setResponse(_apiResponse).sendResponse();
    }
}