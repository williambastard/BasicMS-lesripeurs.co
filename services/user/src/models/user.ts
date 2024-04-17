import { z } from 'zod';
import { PrismaClient } from '@prisma/client'
import { cryptoHelper } from '../helpers/crypto.helper';
const prisma = new PrismaClient()

export class UserInterface {
    email!: string;
    phone!: string;
    lastnames!: string;
    firstnames!: string;
    password!: string;
    createdAt?: Date;
    userId?: number;
}
const UserSchema = z.object({
    email: z.string().email(),
    phone: z.string(),
    lastnames: z.string(),
    firstnames: z.string(),
    password: z.string(),
    createdAt: z.date().optional(),
    userId: z.number().optional()
});
export default class User implements UserInterface {
    readonly email!: string;
    readonly phone!: string;
    readonly lastnames!: string;
    readonly firstnames!: string;
    readonly password!: string;
    readonly createdAt?: Date;
    readonly userId?: number;

    constructor(userObject: any) {

        try {
            const validatedUserData = UserSchema.parse(userObject);

            // Affecter les valeurs comme avant
            this.email = validatedUserData.email;
            this.phone = validatedUserData.phone;
            this.lastnames = validatedUserData.lastnames;
            this.firstnames = validatedUserData.firstnames;
            this.password = cryptoHelper.encrypt(validatedUserData.password);
            this.createdAt = validatedUserData.createdAt;
            this.userId = validatedUserData.userId;
            return this;

        } catch (error) {
            throw error
        }


    }
    userWithoutPass(): User {
        const clone = this.clone();
        const cloneJSON = JSON.parse(JSON.stringify(clone));
        cloneJSON.password = "************";
        return JSON.parse(JSON.stringify(cloneJSON)) as User;
    }


    clone(): User {
        return JSON.parse(JSON.stringify(this)) as User;
    }

    set(UserModifed: Object): User {
        const UserClone = this.clone();
        const UserJSON = JSON.parse(JSON.stringify(UserClone));
        Object.assign(UserJSON, UserModifed);
        Object.assign(UserClone, UserJSON as User);
        return UserClone;
    }

    get(): User {
        return this;
    }

    async create(): Promise<User> {
        const userClone = JSON.parse(JSON.stringify(this));
        const user = new User(userClone)

        await prisma.user.create({
            data: user,
        }).catch(prismaError => {
            throw prismaError
        })
        return this;
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

    static async getUserById(_userId: number): Promise<User> {
        const _userFinded = await prisma.user.findFirstOrThrow({
            where: {
                userId: _userId,
            },
        }).catch(prismaError => {
            throw prismaError
        })

        return new User(_userFinded)
    }

    static async getUserByEmail(_email: string): Promise<User> {
        const _userFinded = await prisma.user.findFirstOrThrow({
            where: {
                email: _email,
            },
        }).catch(prismaError => {
            throw prismaError
        })
        return new User(_userFinded)
    }

    static async getUserByLastnames(_lastnames: string): Promise<User> {
        const _userFinded = await prisma.user.findFirstOrThrow({
            where: {
                lastnames: { contains: _lastnames },
            },
        }).catch(prismaError => {
            throw prismaError
        })
        return new User(_userFinded)
    }


    static async updateUser(_userId: number, _newData: User): Promise<User> {
        const _userFinded = await prisma.user.update({
            where: {
                userId: _userId,
            },
            data: _newData
        }).catch(prismaError => {
            throw prismaError
        })
        return _newData;
    }
}