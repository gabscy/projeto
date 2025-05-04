import { BuscarDisponibilidadeDTO } from "../dto/QuadraDTO";
import { Quadra, QuadraModel } from "../models/QuadraModel";

export class QuadraController {
    private quadraModel: QuadraModel;

    constructor() {
        this.quadraModel = new QuadraModel();
    }

    async cadastrarQuadra(dados: Quadra): Promise<Quadra> {
        const novaQuadra: Quadra = {
            courtName: dados.courtName,
            courtType: dados.courtType,
            courtAddress: dados.courtAddress,
            courtPrice: dados.courtPrice,
            courtRules: dados.courtRules,
            courtDescription: dados.courtDescription,
            selectedDays: dados.selectedDays,
            selectedTimeStart: dados.selectedTimeStart,
            selectedTimeEnd: dados.selectedTimeEnd,
            courtImageUrl: dados.courtImageUrl,
            courtDocumentUrl: dados.courtDocumentUrl,
            slot: dados.slot,
            slotId: dados.slotId,
        }

        try {
            const quadraCriada = await this.quadraModel.criar(novaQuadra);
            return quadraCriada
        } catch (error: any) {
            console.error("Erro ao criar quadra no banco de dados", error);
            throw new Error("Erro ao cadastrar quadra");
        }
    }

    async buscarDisponibilidade(dados: BuscarDisponibilidadeDTO) {
    }
}