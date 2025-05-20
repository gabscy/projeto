import { Request, Response } from "express";
import { SlotService } from "../services/SlotService";
import { SlotRepository } from "../repository/SlotRepository";
import { BuscarDisponibilidadeDTO } from "../dto/QuadraDTO";

export class SlotController {
    private service: SlotService;

    constructor() {
        const repository = new SlotRepository();
        this.service = new SlotService(repository);
    }

    async buscarDisponibilidade(req: Request, res: Response): Promise<void> {
        try {
            const queryParams = req.query as Partial<BuscarDisponibilidadeDTO>;

            // Validate required fields
            if (!queryParams.date || !queryParams.quadraId) {
                throw new Error("Missing required fields: date and quadraId");
            }

            const horariosReservas = await this.service.buscarDisponibilidade(queryParams as BuscarDisponibilidadeDTO);
            res.status(200).json(horariosReservas);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }
}