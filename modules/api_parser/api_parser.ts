import { Response } from "express";
import ApiInterface from "./api_interface";

export default class ApiContructor {
    _response: Response;
    _responseAPI?: ApiInterface;

    constructor(_response: Response) {
        Object.assign(this._response, _response)
        return this;
    }
    setResponse(_responseAPI: ApiInterface) {
        this._responseAPI = _responseAPI;
        return this;
    }
    sendResponse() {
        return this._response.status(this._responseAPI!.statusCode).json(this._responseAPI);
    }
}