import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repository/UserRepository";
import jwt from "jsonwebtoken";


export class UserController {
    private service: UserService;

    constructor() {
        const repository = new UserRepository();
        this.service = new UserService(repository);
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha } = req.body;
            const user = await this.service.login(email, senha);
            // Generate JWT token here
            const token = jwt.sign(
                { userId: user.id, tipo: user.tipo },
                process.env.JWT_SECRET || "your_jwt_secret",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token,
                tipo: user.tipo
            });
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }

    async editarConta(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.service.editarConta(req.body);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }
}