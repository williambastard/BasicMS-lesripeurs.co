import { NextFunction, Request, Response } from "express";
import ApiParser from "private_modules";

export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let _apiConstructor = new ApiParser.ApiConstructor(res);
        let _apiResponse = ApiParser.ApiJSON.get("HTTP_500");
        _apiConstructor.setResponse(_apiResponse).sendResponse()
    };
};