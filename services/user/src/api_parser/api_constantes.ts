import ApiInterface from "./api_interface";

export const _HTTP_400: ApiInterface = { statusCode: 400, message: "Bad Request" };
export const _HTTP_401: ApiInterface = { statusCode: 401, message: "Unauthorized" };
export const _HTTP_402: ApiInterface = { statusCode: 402, message: "Payment Required" };
export const _HTTP_403: ApiInterface = { statusCode: 403, message: "Forbidden" };
export const _HTTP_404: ApiInterface = { statusCode: 404, message: "Not Found" };
export const _HTTP_405: ApiInterface = { statusCode: 405, message: "Not Allowed" };
export const _HTTP_406: ApiInterface = { statusCode: 406, message: "Not Acceptable" };
export const _HTTP_407: ApiInterface = { statusCode: 407, message: "Proxy Authentication required" };
export const _HTTP_498: ApiInterface = { statusCode: 498, message: "Token expired / invalid" };
export const _HTTP_500: ApiInterface = { statusCode: 500, message: "Internal Server Error" };
export const _HTTP_501: ApiInterface = { statusCode: 501, message: "Not Implemented" };
export const _HTTP_502: ApiInterface = { statusCode: 502, message: "Bad Gateway" };
export const _HTTP_503: ApiInterface = { statusCode: 503, message: "Service Unavailable" };
export const _HTTP_504: ApiInterface = { statusCode: 504, message: "Gateway Timeout" };

export const _OK: ApiInterface = { statusCode: 200, message: "Success", data: {} };
export const _CREATED: ApiInterface = { statusCode: 201, message: "Created", data: {} };
export const _ACCEPTED: ApiInterface = { statusCode: 202, message: "Accepted", data: {} };
export const _NO_CONTENT: ApiInterface = { statusCode: 204, message: "No Content", data: {} };
export const _RESET_CONTENT: ApiInterface = { statusCode: 205, message: "Reset Content", data: {} };
export const _PARTIAL_CONTENT: ApiInterface = { statusCode: 206, message: "Partial Content", data: {} };
export const _ALREADY_REPORTED: ApiInterface = { statusCode: 208, message: "Already Reported", data: {} };