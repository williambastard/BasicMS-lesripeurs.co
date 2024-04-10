import { Request, Response } from "express";

export class UserController {
    static async signup(req: Request, res: Response) {
        return res
            .status(200)
            .json({ message: "User created successfully" });
    }
    static async getUsers(req: Request, res: Response) {
        return res.status(200).json({ message: "User was get successfully" });
    }
    static async updateUser(req: Request, res: Response) {
        res.status(200).json({ message: "udpdated" });
    }
    static async deleteUser(req: Request, res: Response) {
        res.status(200).json({ message: "ok" });
    }
}