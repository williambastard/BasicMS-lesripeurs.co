
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import * as Api from "private_modules";

export class UserController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const _userData = new User(req.body);
            const userCreated = await _userData.create();

            if (userCreated) {
                res.locals.session = userCreated;
                _apiResponse = { statusCode: 200, message: "User was successfully registered !", data: { user: _userData } };
            }
        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Unssuccessfull user creation.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async getUserById(req: Request, res: Response, next: NextFunction) {

        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const _userId = parseInt(req.params.userId) ?? 0;
            const _userFinded = await User.getUserById(_userId);

            if (_userFinded) {
                _apiResponse = { statusCode: 200, message: "User was successfully finded !", data: { user: _userFinded } };
            }
            if (!_userFinded) {
                _apiResponse = { statusCode: 404, message: "User not found !" };
            }
        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Unssuccessfull user search.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const _email = req.params.email ?? "";
            const _userFinded = await User.getUserByEmail(_email);

            if (_userFinded) {
                _apiResponse = { statusCode: 200, message: "User was successfully finded !", data: { user: _userFinded } };
            }
            if (!_userFinded) {
                _apiResponse = { statusCode: 404, message: "User not found !" };
            }
        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Unssuccessfull user search.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async getUserByLastnames(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const _lastnames = req.params.lastnames ?? "";
            const _userFinded = await User.getUserByLastnames(_lastnames);

            if (_userFinded) {
                _apiResponse = { statusCode: 200, message: "User was successfully finded !", data: { user: _userFinded } };
            }
            if (!_userFinded) {
                _apiResponse = { statusCode: 404, message: "User not found !" };
            }
        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Unssuccessfull user search.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            _apiResponse = Api.messages.use("HTTP_400");
            const _newData = new User(req.body) ?? null;
            if (_newData) {
                const _userFinded = await User.updateUser(_newData.userId!, _newData);
                if (_userFinded) {
                    _apiResponse = { statusCode: 200, message: "User was successfully finded !", data: { user: _userFinded } };
                }
            }
        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Unssuccessfull user search.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        const searchUserId = parseInt(req.body.userId ?? req.params.userId) ?? -1;
        const deleted = await User.deletebyUserId(searchUserId);
        const message = deleted ? "sucessfully" : "unsuccessfully";

        let _parser = new Api.parser(res);
        let _apiResponse = { statusCode: 200, message: `User Id '${searchUserId}' was ${message} deleted !`, data: res.locals.session };
        return _parser.setResponse(_apiResponse).sendResponse();
    }
}