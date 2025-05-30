import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function validateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, user) => {
        if (err) {
            res.sendStatus(401);
            return;
        }
        (req as any).user = user;
        next();
    });
}