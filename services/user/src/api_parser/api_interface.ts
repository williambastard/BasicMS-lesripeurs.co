import { ErrorRequestHandler } from "express";

export default interface ApiInterface {
    statusCode: number,
    message: string,
    token?: string,
    data?: object | undefined,
    details?: Error | ErrorCallback | ErrorEvent | ErrorRequestHandler | unknown
}