import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { ApiResponse, ApiObject } from "./api_response.interface";

export default abstract class ApiResponseParser {
    static response(res: Response, ApiObject: ApiResponse) {
        return res.status(ApiObject.statusCode).json({ statusCode: ApiObject.statusCode, message: ApiObject.message, data: ApiObject?.data, details: ApiObject?.details });
    }
}