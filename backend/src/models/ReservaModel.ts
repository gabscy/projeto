export interface Reserva {
    id?: number;
    quadraId: string;
    dataReserva: string;
    nomeCapitao: string;
    pagamentoId?: string;
    slotId: string;
}

export class Reserva {
    constructor(
        quadraId: string,
        dataReserva: string,
        nomeCapitao: string,
        slotId: string,
        pagamentoId?: string,
        id?: number
    ) {
        this.id = id;
        this.quadraId = quadraId;
        this.dataReserva = dataReserva;
        this.nomeCapitao = nomeCapitao;
        this.pagamentoId = pagamentoId;
        this.slotId = slotId;
    }
}