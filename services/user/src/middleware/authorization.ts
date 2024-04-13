import { NextFunction, Request, Response } from "express";
import * as ApiContructor from "../api_parser/api_parser";
import ApiInterface from "../api_parser/api_interface";

export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let _apiConstructor = new ApiContructor.Constructor(res);
        let _apiResponse = ApiContructor.default._HTTP_500;
        _apiConstructor.setResponse(_apiResponse as ApiInterface).sendResponse()
    };
};