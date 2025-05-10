import { Request, Response } from "express";
import { SlotService } from "../services/SlotService";
import { SlotRepository } from "../repository/SlotRepository";

export class SlotController {
    private service: SlotService;

    constructor() {
        const repository = new SlotRepository();
        this.service = new SlotService(repository);
    }

    async buscarDisponibilidade(req: Request, res: Response): Promise<void> {
        try {
            const horariosReservas = await this.service.buscarDisponibilidade(req.body);
            res.status(200).json(horariosReservas);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }
}