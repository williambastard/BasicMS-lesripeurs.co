import { PrismaClient } from '@prisma/client'
import Helper from './helper';
import { Authentication } from '../models/authentication';

const prisma = new PrismaClient()


export abstract class AuthenticateHelper extends Helper {
    static async authenticate(userLogin: Authentication): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                email: userLogin.email ?? "",
                password: userLogin.password ?? "",
            },
        });
        return user;
    }
}