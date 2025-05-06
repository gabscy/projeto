import { AtualizarPagamentoReservaDTO, ReservarQuadraDTO } from "../dto/QuadraDTO";
import { Pagamento, PagamentoModel } from "../models/PagamentoModel";
import { Reserva, ReservaModel } from "../models/ReservaModel";

export class ReservaController {
    private ReservaModel: ReservaModel;

    constructor() {
        this.ReservaModel = new ReservaModel();
    }

    async criarReserva(dados: ReservarQuadraDTO): Promise<string> {
        const dadosReserva: Reserva = {
            quadraId: dados.quadraId,
            dataReserva: dados.dataReserva,
            nomeCapitao: dados.nomeCapitao,
            slotId: dados.slotId
        }
        const result = await this.ReservaModel.criar(dadosReserva)
        return result.id!.toString()
    }

    async atualizarReserva(dados: AtualizarPagamentoReservaDTO) {
        await this.ReservaModel.atualizar(dados)
    }
}