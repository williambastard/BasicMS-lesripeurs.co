import * as Api from "private_modules";
import { NextFunction, Request, Response } from "express";
import { Authentication } from "../models/authentication";

export abstract class UserAuthController {
    static async login(req: Request, res: Response, next: NextFunction) {

        let isSuccess = false;
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const userLogin = new Authentication(req.body);

            try {
                const authenticationResult = await userLogin.authenticate();
                _apiResponse = { statusCode: 401, message: "Login failed : Wrong password or email." }
                if (authenticationResult) {
                    isSuccess = true;
                    res.locals.session = authenticationResult;
                    _apiResponse = { statusCode: 200, message: "User was successfully loged in !", data: res.locals.session };
                }
            }
            catch (error) {
                _apiResponse.details = error;
            }
        }
        catch (error) {
            _apiResponse = Api.messages.use("HTTP_400");
            _apiResponse.details = error;
        }
        return isSuccess ? next() : _parser.setResponse(_apiResponse).sendResponse();
    }
}