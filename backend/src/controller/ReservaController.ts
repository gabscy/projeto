import { Request, Response } from "express";
import { ReservaService } from "../services/ReservaService";
import { ReservaRepository } from "../repository/ReservaRepository";
import { PagamentoRepository } from "../repository/PagamentoRepository";
import { PagamentoService } from "../services/PagamentoService";
import { SlotService } from "../services/SlotService";
import { SlotRepository } from "../repository/SlotRepository";

export class ReservaController {
    private service: ReservaService;

    constructor() {
        const reservaRepository = new ReservaRepository();
        const pagamentoRepository = new PagamentoRepository();
        const pagamentoService = new PagamentoService(pagamentoRepository);
        const slotRepository = new SlotRepository();
        const slotService = new SlotService(slotRepository);
        this.service = new ReservaService(reservaRepository, pagamentoService, slotService);
    }

    async criarReserva(req: Request, res: Response): Promise<void> {
        try {
            const reserva = await this.service.criarReserva(req.body);
            res.status(201).json(reserva);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }
}