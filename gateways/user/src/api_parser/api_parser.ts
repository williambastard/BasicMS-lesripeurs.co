import { Response } from "express";
import ApiInterface from "./api_interface";
import * as ApiConstantes from "./api_constantes";

export class Constructor {
    _response!: Response;
    _responseAPI?: ApiInterface;

    constructor(_response: Response) {
        this._response = _response
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
export default ApiConstantes;