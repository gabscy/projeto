import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repository/UserRepository";

export class UserController {
    private service: UserService;

    constructor() {
        const repository = new UserRepository();
        this.service = new UserService(repository);
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