import { NextFunction, Request, Response } from "express";
import * as Api from "private_modules";
import User from "../models/user";

export abstract class Authorization {
    static async checkIP(req: Request, res: Response, next: NextFunction) {
        // Récupérer l'adresse IP du client
        const clientIP = req.ip ?? "";

        let _parser = new Api.parser(res);

        // Récupérer la liste blanche d'adresses IP depuis la variable d'environnement
        const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];

        // Générer les modèles d'expressions régulières à partir de la liste blanche
        const allowedIPPatterns = whitelist.map(ip => new RegExp(ip.replace(/\./g, '\\.')));

        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_403");

        _apiResponse.details = { reqIP: clientIP };

        // Vérifier si l'adresse IP du client correspond à l'un des modèles autorisés
        const isAllowed = allowedIPPatterns.some(pattern => pattern.test(clientIP));


        return isAllowed ? next() : _parser.setResponse(_apiResponse).sendResponse();
    }

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