import { Router } from "express";
import ApiParser from "private_modules";

const Authentication = Router();

Authentication.post("/*", async function (req, res, next) {
    let _apiConstructor = new ApiParser.ApiConstructor(res);
    let _apiResponse = ApiParser.ApiJSON.get("HTTP_500");
    const response = await new ApiParser.Call(req, res, "user", "authentication", 8282).fetch();

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

    try {
        _apiResponse = response._callResponse;
    }
    catch (UncaughtException) {
        _apiResponse.details = UncaughtException;

    }
    return _apiConstructor.setResponse(_apiResponse).sendResponse();
});

export { Authentication as authenticationRouter };