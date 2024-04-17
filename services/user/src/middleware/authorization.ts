import { NextFunction, Request, Response } from "express";
import * as Api from "private_modules";
import User from "../models/user";

export abstract class Authorization {
    static async checkExistance(req: Request, res: Response, next: NextFunction) {
        let isValidUser = false;
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const _userId = parseInt(res.locals.session.session.userId) ?? 0;
            const _userFound = await User.getUserById(_userId);

            res.locals.me = _userFound;
            _apiResponse = { statusCode: 200, message: "Your informations", data: { user: _userFound } };
            isValidUser = true;

        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Sorry you are not allowed to perfom this action because the user for this token doesn't exists anymore.", details: error };
        }

        return isValidUser ? next() : _parser.setResponse(_apiResponse).sendResponse();
    }
}