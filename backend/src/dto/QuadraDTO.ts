import { Slot } from "../models/SlotModel";

export interface BuscarDisponibilidadeDTO {
    date: string;
    quadraId: string;
}

export interface disponibilidadeDTO {
    quadra_info: PegarHorarioFuncionamentoDTO;
    reservas: horarioFuncionamentoDTO[]
}

export interface ReservarQuadraDTO {
    quadraId: string;
    dataReserva: string;
    nomeCapitao: string;
    cpfCapitao: string;
    slotId: string;
    valor: string;
    metodoPagamento: string;
    numeroCartao: string;
    cvv: string;
    vencimento: string;
    nomeCartao: string;
    reservaId?: string;
}

export interface AtualizarPagamentoReservaDTO {
    id: string;
    pagamento_id: string;
}

export interface PegarReservasDTO {
    date: string,
    quadraId: string,
}

export interface PegarHorarioFuncionamentoDTO {
    horario_inicio: string, 
    horario_fim: string, 
    slot: string
}

export interface horarioFuncionamentoDTO {
    horario_inicio: string,
    horario_fim: string,
}

export interface cadastrarSlotDTO {
    dias_funcionamento: string,
    quadra_id: number,
    horario_inicio: number,
    horario_fim: number,
    slot: number,
    slots: Slot[],
}