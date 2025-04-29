import { Quadra, QuadraModel } from "../models/QuadraModel";

export class QuadraController {
    private quadraModel: QuadraModel;

    constructor() {
        this.quadraModel = new QuadraModel();
    }

    async cadastrarQuadra(dados: Quadra): Promise<Quadra> {
        const novaQuadra: Quadra = {
            nome: dados.nome,
            tipo: dados.tipo,
            endereco: dados.endereco,
            descricao: dados.descricao,
            preco: dados.preco,
            regras: dados.regras
        }

        try {
            const quadraCriada = await this.quadraModel.criar(novaQuadra);
            return quadraCriada
        } catch (error: any) {
            console.error("Erro ao criar quadra no banco de dados", error);
            throw new Error("Erro ao cadastrar quadra");
        }
    }
}