import { NextFunction, Request, Response } from "express";
/*
import ResponseParser from "../helpers/responseParser";

export class UserAuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            new ResponseParser(req, res, next).response(200, "User was successfully loged !", res.locals.session);
        } catch (error) {
            new ResponseParser(req, res, next).response(500, "Internal server error");
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            new ResponseParser(req, res, next).response(200, "User was successfully finded !", res.locals.session);
        } catch (error) {
            new ResponseParser(req, res, next).response(500, "Internal server error");
        }
    }
}*/