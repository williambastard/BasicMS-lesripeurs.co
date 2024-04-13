import ApiInterface from "./api_interface";

export const _HTTP_500: ApiInterface = { statusCode: 500, message: "Internal server error" };
export const _HTTP_501: ApiInterface = { statusCode: 501, message: "Method not implemented !" };
export const _HTTP_400: ApiInterface = { statusCode: 400, message: "Internal server error" };
export const _HTTP_401: ApiInterface = { statusCode: 401, message: "Internal server error" };
export const _HTTP_403: ApiInterface = { statusCode: 403, message: "Forbidden" };
export const _HTTP_404: ApiInterface = { statusCode: 404, message: "Not found" };
export const _HTTP_498: ApiInterface = { statusCode: 498, message: "Token Expired or invalid!" };
export let _PARTIAL: ApiInterface = { statusCode: 201, message: "Success", data: {} };
export let _SUCCESS: ApiInterface = { statusCode: 200, message: "Success", data: {} };