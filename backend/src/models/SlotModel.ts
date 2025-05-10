export interface Slot {
    quadra_id: number;
    date: Date;
    horario_inicio: number;
    horario_fim: number;
}

export class Slot {
    constructor(
        quadra_id: number,
        date: Date,
        horario_inicio: number,
        horario_fim: number
    ) {
        this.quadra_id = quadra_id;
        this.date = date;
        this.horario_inicio = horario_inicio;
        this.horario_fim = horario_fim;
    }
}