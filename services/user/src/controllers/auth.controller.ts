import { NextFunction, Request, Response } from "express";
import ApiResponseParser from "../interfaces/api_response.parser";

const ApiObject = { statusCode: 500, message: "Internal server error" };

export class UserAuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully finded !", data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        const ApiObject = { statusCode: 200, message: "User was successfully finded !", data: res.locals.session };
        return ApiResponseParser.response(res, ApiObject);
    }
}