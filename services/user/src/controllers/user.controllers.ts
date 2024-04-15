import ApiParser from "private_modules";

import { NextFunction, Request, Response } from "express";
import { UserHelper } from "../helpers/user.helper";

export class UserController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        let _apiConstructor = new ApiParser.ApiConstructor(res);
        let _apiResponse = { statusCode: 200, message: "User was successfully created !", data: res.locals.session };
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