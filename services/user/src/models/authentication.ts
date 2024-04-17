import { PrismaClient } from '@prisma/client'
import { cryptoHelper } from '../helpers/crypto.helper';

const prisma = new PrismaClient()

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

    async authenticate(): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                email: this.email,
                password: cryptoHelper.encrypt(this.password),
            },
        });
        return user;
    }
}