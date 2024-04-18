import { NextFunction, Request, Response } from "express";
import * as Api from "private_modules";

export abstract class Authorization {
    static async checkIP(req: Request, res: Response, next: NextFunction) {

        // Récupérer l'adresse IP du client
        const clientIP = req.ip ?? "";

        let _parser = new Api.parser(res);
        const allowedIPPatterns = [
            /176\.25\.1\..*/,   // Modèle d'adresse IP pour le sous-réseau 176.25.1.x
            /127\.0\..*/,      // Modèle d'adresse IP pour le sous-réseau 127.0.x.x
        ];
        let _apiResponse: Api.ResponseInterface = Api.messages.use("HTTP_403");
        _apiResponse.details = { reqIP: clientIP };

        // Vérifier si l'adresse IP du client correspond à l'un des modèles autorisés
        const isAllowed = allowedIPPatterns.some(pattern => pattern.test(clientIP));

        return isAllowed ? next() : _parser.setResponse(_apiResponse).sendResponse();
    }
}