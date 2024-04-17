import { PrismaClient } from '@prisma/client'
import { cryptoHelper } from '../helpers/crypto.helper';
const prisma = new PrismaClient()

export class UserInterface {
    email!: string;
    phone!: string;
    lastnames!: string;
    firstnames!: string;
    password!: string;
    createdAt?: Date | undefined;
    userId?: number | undefined;
}
export default class User implements UserInterface {
    readonly email!: string;
    readonly phone!: string;
    readonly lastnames!: string;
    readonly firstnames!: string;
    readonly password!: string;
    readonly createdAt?: Date | undefined;
    readonly userId?: number | undefined;

    constructor(userObject: UserInterface) {
        Object.assign(this, userObject);
        return this;
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
        userClone.password = cryptoHelper.encrypt(userClone.password);
        await prisma.user.create({
            data: userClone,
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
        const userClone = JSON.parse(JSON.stringify(_newData));
        userClone.password = cryptoHelper.encrypt(userClone.password);
        const _userFinded = await prisma.user.update({
            where: {
                userId: _userId,
            },
            data: userClone
        }).catch(prismaError => {
            throw prismaError
        })
        return new User(_userFinded);
    }
}