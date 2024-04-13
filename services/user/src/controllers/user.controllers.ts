import { NextFunction, Request, Response } from "express";
import ApiResponseParser from "../interfaces/api_response.parser";
import { UserHelper } from "../helpers/user.helper";

export class UserController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully created !", data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully finded !", data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }
    static async updateUser(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully updated !", data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }
    static async deleteUser(req: Request, res: Response, next: NextFunction) {

        const searchUserId = parseInt(req.body.userId ?? req.params.userId) ?? -1;
        const deleted = await UserHelper.deletebyUserId(searchUserId);
        const message = deleted ? "sucessfully" : "unsuccessfully";
        const ApiObject = { statusCode: 200, message: `User Id '${searchUserId}' was ${message} deleted !`, data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }
}