export default class cryptoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'cryptoError';
    }
}
