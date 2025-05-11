import { ReservaRepository } from "../repository/ReservaRepository";
import { PagamentoService } from "../services/PagamentoService";
import { ReservarQuadraDTO } from "../dto/QuadraDTO";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Reserva } from "../models/ReservaModel";
import { SlotService } from "./SlotService";

export class ReservaService {
    private reservaRepository: ReservaRepository;
    private pagamentoService: PagamentoService;
    private slotService: SlotService;
    private dbPromise: Promise<Database>;

    constructor(reservaRepository: ReservaRepository, pagamentoService: PagamentoService, slotService: SlotService) {
        this.reservaRepository = reservaRepository;
        this.pagamentoService = pagamentoService;
        this.slotService = slotService;
        this.dbPromise = open({ filename: "./database.sqlite", driver: sqlite3.Database });
    }

    async criarReserva(dados: ReservarQuadraDTO): Promise<Reserva> {
        const db = await this.dbPromise;

        try {
            await db.run("BEGIN TRANSACTION");

            const pagamentoId = await this.pagamentoService.criarPagamento(dados, db);

            const reserva = await this.reservaRepository.criarReserva({...dados, pagamentoId: pagamentoId.toString()}, db);

            await this.slotService.alterarDisponibilidade(dados.slotId, db);

            await db.run("COMMIT");
            return reserva;
        } catch (error) {
            await db.run("ROLLBACK");
            console.error("Erro ao processar reserva:", error);
            throw new Error("Erro ao criar reserva");
        }
    }
}