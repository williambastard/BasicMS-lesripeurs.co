import { PrismaClient } from '@prisma/client'
import { cryptoHelper } from '../helpers/crypto.helper';
import { z } from 'zod';

const prisma = new PrismaClient()

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export class AuthenticationInterface {
    email!: string;
    password!: string;
}
export class Authentication implements AuthenticationInterface {
    readonly email!: string;
    readonly password!: string;

    constructor(_userLogin: AuthenticationInterface) {

        try {
            const validatedUserData = UserSchema.parse(_userLogin);
            this.email = validatedUserData.email;
            this.password = cryptoHelper.encrypt(validatedUserData.password);
            return this;

        } catch (error) {
            throw error
        }
    }

    async authenticate(): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                email: this.email,
                password: this.password,
            },
        });
        return user;
    }
}