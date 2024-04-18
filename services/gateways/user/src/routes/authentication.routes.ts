import { Router } from "express";
import * as Api from "private_modules";

const Authentication = Router();

Authentication.post("/*", async function (req, res, next) {
    let _parser = new Api.parser(res);
    let _apiResponse = Api.messages.use("HTTP_500");
    const response = await new Api.call(req, res, "user", "authentication", 8282).setGatewayIp("176.25.1.1").fetch()

    try {
        // Convertir les en-têtes en un objet clé-valeur
        const fetchHeaders: Record<string, string> = {};
        for (const [key, value] of response._callHeaders.entries()) {
            fetchHeaders[key] = value;
        }
        // Définir les en-têtes dans la réponse Express
        for (const [key, value] of Object.entries(fetchHeaders)) {
            const formatedKeyName = key.split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join('-')
            res.set(formatedKeyName, value as string);
        }

        _apiResponse = response._callResponse;
    }
    catch (UncaughtException) {
        _apiResponse.details = UncaughtException;

    }
    return _parser.setResponse(_apiResponse).sendResponse();
});

export { Authentication as authenticationRouter };