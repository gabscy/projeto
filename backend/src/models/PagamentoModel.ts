export interface IPagamento {
    id?: number;
    quadraId: string;
    cpfCapitao: string;
    valor: string;
    metodoPagamento: string;
    numeroCartao: string;
    cvv: string;
    vencimento: string;
    nomeCartao: string;
}

export class Pagamento {
    id?: number;
    quadraId: string;
    cpfCapitao: string;
    valor: string;
    metodoPagamento: string;
    numeroCartao: string;
    cvv: string;
    vencimento: string;
    nomeCartao: string;

    constructor(
        quadraId: string,
        cpfCapitao: string,
        valor: string,
        metodoPagamento: string,
        numeroCartao: string,
        cvv: string,
        vencimento: string,
        nomeCartao: string,
        id?: number
    ) {
        this.id = id;
        this.quadraId = quadraId;
        this.cpfCapitao = cpfCapitao;
        this.valor = valor;
        this.metodoPagamento = metodoPagamento;
        this.numeroCartao = numeroCartao;
        this.cvv = cvv;
        this.vencimento = vencimento;
        this.nomeCartao = nomeCartao;
    }
}