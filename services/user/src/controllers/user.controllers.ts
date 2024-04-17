import ApiParser from "private_modules";

import { NextFunction, Request, Response } from "express";
import { UserHelper } from "../helpers/user.helper";
import { Authentication } from "../models/authentication";
import { AuthenticateHelper } from "../helpers/authenticate.helper";
import User from "../models/user";

export class UserController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        let _apiConstructor = new ApiParser.ApiConstructor(res);
        let _apiResponse: { statusCode: number, message: string, data: undefined | any } = { statusCode: 403, message: "Sign Up failed : Impossible to create this user.", data: undefined };

        const _userData = new User(req.body);
        const userCreated = await UserHelper.create(_userData);

        if (userCreated) {
            res.locals.session = userCreated;
            _apiResponse = { statusCode: 200, message: "User was successfully registered !", data: { user: _userData } };
        }

        return _apiConstructor.setResponse(_apiResponse).sendResponse();
    }
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        let _apiConstructor = new ApiParser.ApiConstructor(res);
        let _apiResponse = { statusCode: 200, message: "User was successfully fineded !", data: res.locals.session };
        return _apiConstructor.setResponse(_apiResponse).sendResponse();
    }
    static async updateUser(req: Request, res: Response, next: NextFunction) {
        let _apiConstructor = new ApiParser.ApiConstructor(res);
        let _apiResponse = { statusCode: 200, message: "User was successfully updated !", data: res.locals.session };
        return _apiConstructor.setResponse(_apiResponse).sendResponse();
    }
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        const searchUserId = parseInt(req.body.userId ?? req.params.userId) ?? -1;
        const deleted = await UserHelper.deletebyUserId(searchUserId);
        const message = deleted ? "sucessfully" : "unsuccessfully";

        let _apiConstructor = new ApiParser.ApiConstructor(res);
        let _apiResponse = { statusCode: 200, message: `User Id '${searchUserId}' was ${message} deleted !`, data: res.locals.session };
        return _apiConstructor.setResponse(_apiResponse).sendResponse();
    }
}