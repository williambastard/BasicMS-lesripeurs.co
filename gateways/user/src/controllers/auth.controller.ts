import { Request, Response } from "express";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            return res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getProfile(req: Request, res: Response) {
        try {
            return res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}