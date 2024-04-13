export class AuthenticationInterface {
    email!: string;
    password!: string;
}
export class Authentication implements AuthenticationInterface {
    readonly email!: string;
    readonly password!: string;

    constructor(userLogin: AuthenticationInterface) {
        Object.assign(this, userLogin);
        return this;
    }

}