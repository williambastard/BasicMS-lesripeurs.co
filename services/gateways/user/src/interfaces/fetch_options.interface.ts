export interface fetchOptionsInterface {
    headers: Headers;
    method: string;
    body?: any;
}

export default class fetchOptions implements fetchOptionsInterface {
    headers: Headers;
    method: string;
    body?: any;

    constructor(method: string) {
        this.headers = new Headers({
            'author': 'William BASTARD',
            'content-type': 'application/json'
        });
        this.method = method;
    }

    getHeader(headerKey: string) {
        return this.headers.get(headerKey);
    }
    setHeader(headerKey: string, headerValue: string) {
        this.headers.set(headerKey, headerValue);
    }
    setMethod(method: string) {
        this.method = method;
    }
    setBody(body: object) {
        this.body = JSON.stringify(body);
    }

    getTarget() {
        return this.getHeader("ms-target-protocol") +
            "://" + this.getHeader("ms-target-host") +
            "/" + this.getHeader("ms-target-service") +
            "/" + this.getHeader('ms-target-endpoint');
    }
}