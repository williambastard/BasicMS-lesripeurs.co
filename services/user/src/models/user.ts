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
}