export interface BuscarDisponibilidadeDTO {
    date: string;
    quadraId: string;
}

export interface ReservarQuadraDTO {
    quadraId: string;
    dataReserva: string;
    nomeCapitao: string;
    horarioInicio: string;
    horarioFim: string;
    cpfCapitao: string;
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