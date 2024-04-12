import { NextFunction, Request, Response } from "express";
export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        return res.status(403).json({ message: "Forbidden" });
    };
};