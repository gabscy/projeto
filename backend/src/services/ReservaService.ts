import { ReservaRepository } from "../repository/ReservaRepository";
import { PagamentoService } from "./PagamentoService";
import { ReservarQuadraDTO } from "../dto/QuadraDTO";
import { Reserva } from "../models/ReservaModel";
import { SlotService } from "./SlotService";
import { getSqlConnection } from "../dbconnection";
import sql from "mssql";

export class ReservaService {
    private reservaRepository: ReservaRepository;
    private pagamentoService: PagamentoService;
    private slotService: SlotService;

    constructor(reservaRepository: ReservaRepository, pagamentoService: PagamentoService, slotService: SlotService) {
        this.reservaRepository = reservaRepository;
        this.pagamentoService = pagamentoService;
        this.slotService = slotService;
    }

    async criarReserva(dados: ReservarQuadraDTO): Promise<Reserva> {
        const pool = await getSqlConnection();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const pagamentoId = await this.pagamentoService.criarPagamento(dados, transaction);

            const reserva = await this.reservaRepository.criarReserva(
                { ...dados, pagamentoId: pagamentoId.toString() },
                transaction
            );

            await this.slotService.alterarDisponibilidade(dados.slotId, transaction);

            await transaction.commit();
            return reserva;
        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao processar reserva:", error);
            throw new Error("Erro ao criar reserva");
        }
    }
}