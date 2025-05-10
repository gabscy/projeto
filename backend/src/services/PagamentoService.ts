import { PagamentoRepository } from "../repository/PagamentoRepository";
import { Pagamento } from "../models/PagamentoModel";
import { ReservarQuadraDTO } from "../dto/QuadraDTO";
import { Database } from 'sqlite';

export class PagamentoService {
    private repository: PagamentoRepository;

    constructor(repository: PagamentoRepository) {
        this.repository = repository;
    }

    async criarPagamento(dados: ReservarQuadraDTO, db: Database): Promise<number> {
        if (parseFloat(dados.valor) <= 0) {
            throw new Error("O valor do pagamento deve ser positivo.");
        }

        const dadosPagamento = new Pagamento(
            dados.quadraId,
            dados.cpfCapitao,
            dados.valor,
            dados.metodoPagamento,
            dados.numeroCartao,
            dados.cvv,
            dados.vencimento,
            dados.nomeCartao
        );

        const pagamentoCriado = await this.repository.criarPagamento(dadosPagamento, db);

        if (pagamentoCriado) {
            return pagamentoCriado;
        }
        throw new Error("Erro ao criar pagamento")

    }
}