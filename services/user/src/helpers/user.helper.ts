import { PrismaClient } from '@prisma/client'
import Helper from './helper';
import User from '../models/user';
import { Authentication } from '../models/authentication';

const prisma = new PrismaClient()


export abstract class UserHelper extends Helper {
    static async create(userData: User): Promise<boolean> {
        let isSuccess = false;
        try {
            const user = await prisma.user.create({
                data: userData,
            });
            isSuccess = true;
        } catch (prismaError) {
            console.log(
                'There is a unique constraint violation, a new user cannot be created with this email'
            )
        }
        return isSuccess;
    }

    static async deletebyUserId(userId: number): Promise<boolean> {
        let isSuccess = false;
        try {
            const deleteUser = await prisma.user.delete({
                where: {
                    userId: userId,
                },
            })
            isSuccess = true;
        } catch (prismaError) {
            //console.log(prismaError)
        }
        return isSuccess;
    }

    static async deleteByEmail(email: string): Promise<boolean> {
        let isSuccess = false;
        try {
            const deleteUser = await prisma.user.delete({
                where: {
                    email: email,
                },
            })
            isSuccess = true;
        } catch (prismaError) {
            console.log(prismaError)
        }

        return isSuccess;
    }
}