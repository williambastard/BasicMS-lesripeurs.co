import { NextFunction, Request, Response } from "express";
import * as Api from "private_modules";

export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let _parser = new Api.parser(res);
        let _apiResponse =Api.messages.use("HTTP_500");
        _parser.setResponse(_apiResponse).sendResponse()
    };
};