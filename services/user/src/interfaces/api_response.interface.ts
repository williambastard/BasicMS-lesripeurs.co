import { ErrorRequestHandler } from "express";

export interface ApiObject {
    statusCode: number,
    message: string,
    data?: object | undefined,
    details?: Error | ErrorCallback | ErrorEvent | ErrorRequestHandler | unknown
}
export interface ApiResponse {
    statusCode: number,
    message: string,
    data?: object | undefined,
    details?: Error | ErrorCallback | ErrorEvent | ErrorRequestHandler | unknown
}