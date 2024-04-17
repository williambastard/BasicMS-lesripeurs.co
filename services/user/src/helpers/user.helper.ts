import { Prisma, PrismaClient } from '@prisma/client'
import Helper from './helper';
import User from '../models/user';

const prisma = new PrismaClient();

export abstract class UserHelper extends Helper {
    static async create(_userData: User): Promise<User> {
        await prisma.user.create({
            data: _userData,
        }).catch(prismaError => {
            throw prismaError
        })
        return _userData;
    }

    static async deletebyUserId(userId: number): Promise<boolean> {
        const deleteUser = await prisma.user.delete({
            where: {
                userId: userId,
            },
        }).catch(prismaError => {
            throw prismaError
        })
        return deleteUser ? true : false;
    }

    static async deleteByEmail(email: string): Promise<boolean> {
        const deleteUser = await prisma.user.delete({
            where: {
                email: email,
            },
        }).catch(prismaError => {
            throw prismaError
        })
        return deleteUser ? true : false;
    }
}