
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import * as Api from "private_modules";
import { cryptoHelper } from "../helpers/crypto.helper";

export class UserController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            const _userData = new User(req.body);
            try {
                const userCreated = await _userData!.create();
                if (userCreated) {
                    res.locals.session = userCreated;
                    res.locals.session.password = "************";
                    _apiResponse = { statusCode: 200, message: "User was successfully registered !", data: { user: _userData } };
                }
            } catch (error) {
                _apiResponse.details = error;
            }
        } catch (error) {
            _apiResponse = Api.messages.use("HTTP_400");
            _apiResponse.details = error
        };
        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async myInformations(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");
        try {
            const _user = new User(res.locals.me);
            _apiResponse = { statusCode: 200, message: "Your informations", data: _user.userWithoutPass() }

        } catch (error) {
            _apiResponse = Api.messages.use("HTTP_400");
            _apiResponse.details = error
        };

        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async getUserById(req: Request, res: Response, next: NextFunction) {

        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        if (!req.params.userId) {
            _apiResponse = Api.messages.use("HTTP_400");
            _apiResponse.details = { message: "Params doesn't contain :userId" }
        }

        if (req.params.userId) {
            const _userId = parseInt(req.params.userId) ?? 0;
            try {
                const _userFound = await User.getUserById(_userId);
                _apiResponse = { statusCode: 200, message: "User was successfully found !", data: { user: _userFound.userWithoutPass() } };
            } catch (error) {
                _apiResponse = { statusCode: 404, message: "Unsuccessfull user search.", details: error };
            }
            return _parser.setResponse(_apiResponse).sendResponse();
        }

    }

    static async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        if (!req.params.email) {
            _apiResponse = Api.messages.use("HTTP_400");
            _apiResponse.details = { message: "Params doesn't contain :email" }
        }

        if (req.params.email) {
            const _email = req.params.email;
            try {
                const _userFound = await User.getUserByEmail(_email);
                _apiResponse = { statusCode: 200, message: "User was successfully found !", data: { user: _userFound.userWithoutPass() } };
            } catch (error) {
                _apiResponse = { statusCode: 404, message: "Unsuccessfull user search.", details: error };
            }
        }
        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async getUserByLastnames(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        if (!req.params.lastnames) {
            _apiResponse = Api.messages.use("HTTP_400");
            _apiResponse.details = { message: "Params doesn't contain :lastnames" }
        }
        if (req.params.lastnames) {
            const _lastnames = req.params.lastnames;
            try {
                const _userFound = await User.getUserByLastnames(_lastnames);
                _apiResponse = { statusCode: 200, message: "User was successfully found !", data: { user: _userFound.userWithoutPass() } };
            } catch (error) {
                _apiResponse = { statusCode: 404, message: "Unsuccessfull user search.", details: error };
            }
        }
        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");
        try {
            _apiResponse = Api.messages.use("HTTP_400");

            const _newData = new User(req.body);

            if (_newData) {
                if (res.locals.me.userId !== _newData.userId!) {
                    _apiResponse = { statusCode: 403, message: "You only have permission to modify your user !" };
                }
                if (res.locals.me.userId === _newData.userId!) {
                    const _userFound = await User.updateUser(_newData.userId!, _newData);
                    if (_userFound) {
                        _apiResponse = { statusCode: 200, message: "User was successfully modified !", data: { user: _userFound.userWithoutPass() } };
                    }
                }
            }
        } catch (error) {
            _apiResponse = { statusCode: 404, message: "Failed to modify this user.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        const searchUserId = parseInt(req.body.userId ?? req.params.userId) ?? -1;
        let _parser = new Api.parser(res);
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_500");

        try {
            _apiResponse = Api.messages.use("HTTP_400");
            const _newData = parseInt(req.body.userId ?? req.params.userId) ?? -1;
            if (_newData) {
                const deleted = await User.deletebyUserId(searchUserId);
                if (deleted) {
                    _apiResponse = { statusCode: 200, message: `User Id '${searchUserId}' was deleted !` };
                }
            }
        } catch (error) {
            _apiResponse = { statusCode: 403, message: "Unsuccessfull user deleting.", details: error };
        }

        return _parser.setResponse(_apiResponse).sendResponse();
    }
}