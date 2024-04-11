import { NextFunction, Request, Response } from "express";
import ApiResponseParser from "../helpers/api_response.parser";

export class UserController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully created !", data: res.locals.session  };
        return res.status(ApiObject.statusCode).json(ApiResponseParser.response(ApiObject));
    }
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully finded !", data: res.locals.session };
        return res.status(ApiObject.statusCode).json(ApiResponseParser.response(ApiObject));
    }
    static async updateUser(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully updated !", data: res.locals.session };
        return res.status(ApiObject.statusCode).json(ApiResponseParser.response(ApiObject));
    }
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully deleted !", data: res.locals.session };
        return res.status(ApiObject.statusCode).json(ApiResponseParser.response(ApiObject));
    }
}