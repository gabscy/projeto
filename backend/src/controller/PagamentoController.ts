import { ReservarQuadraDTO } from "../dto/QuadraDTO";
import { Pagamento, PagamentoModel } from "../models/PagamentoModel";

export class PagamentoController {
    private PagamentoModel: PagamentoModel;

    constructor() {
        this.PagamentoModel = new PagamentoModel();
    }

    async criarPagamento(dados: ReservarQuadraDTO): Promise<string> {
        const dadosPagamento: Pagamento = {
            quadraId: dados.quadraId,
            cpfCapitao: dados.cpfCapitao,
            cvv: dados.cvv,
            metodoPagamento: dados.metodoPagamento,
            nomeCartao: dados.nomeCartao,
            numeroCartao: dados.numeroCartao,
            valor: dados.valor,
            vencimento: dados.vencimento,
        }
        const result = await this.PagamentoModel.criar(dadosPagamento)
        return result.id!.toString()
    }
}