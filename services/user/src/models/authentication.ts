export class AuthenticationInterface {
    email!: string;
    password!: string;
}
export class Authentication implements AuthenticationInterface {
    readonly email!: string;
    readonly password!: string;

    constructor(_userLogin: AuthenticationInterface) {
        Object.assign(this, _userLogin);
        return this;
    }

}