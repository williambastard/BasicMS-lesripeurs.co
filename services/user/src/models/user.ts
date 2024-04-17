import { PrismaClient } from '@prisma/client'
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
        await prisma.user.create({
            data: this,
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

    static async getUserById(_userId: number): Promise<User | null> {
        const _userFinded = await prisma.user.findUnique({
            where: {
                userId: _userId,
            },
        }).catch(prismaError => {
            throw prismaError
        })

        return _userFinded ? new User(_userFinded) : null;
    }

    static async getUserByEmail(_email: string): Promise<User | null> {
        const _userFinded = await prisma.user.findUnique({
            where: {
                email: _email,
            },
        }).catch(prismaError => {
            throw prismaError
        })

        return _userFinded ? new User(_userFinded) : null;
    }

    static async getUserByLastnames(_lastnames: string): Promise<User | null> {
        const _userFinded = await prisma.user.findFirst({
            where: {
                lastnames: { contains: _lastnames },
            },
        }).catch(prismaError => {
            throw prismaError
        })

        return _userFinded ? new User(_userFinded) : null;
    }


    static async updateUser(_userId: number, _newData: User): Promise<User | null> {
        const _userFinded = await prisma.user.update({
            where: {
                userId: _userId,
            },
            data: _newData
        }).catch(prismaError => {
            throw prismaError
        })

        return _userFinded ? new User(_userFinded) : null;
    }
}