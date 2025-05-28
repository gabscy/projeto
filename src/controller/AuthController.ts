import { Request, Response } from "express";

export class AuthController {
    async validate(req: Request, res: Response): Promise<void> {
        res.status(200).json({ valid: true, user: (req as any).user });
    }
}