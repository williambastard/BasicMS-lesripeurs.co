import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { ApiResponse, ApiObject } from "../interfaces/api_response.interface";

export default abstract class ApiResponseParser {
    static response(ApiObject: ApiResponse) {
        return { statusCode: ApiObject.statusCode, message: ApiObject.message, data: ApiObject?.data, details: ApiObject?.details };
    }
}