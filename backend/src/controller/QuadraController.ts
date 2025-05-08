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
            courtCity: dados.courtCity,
            courtState: dados.courtState,
            courtCEP: dados.courtCEP,
            courtPrice: dados.courtPrice,
            courtRules: dados.courtRules,
            courtDescription: dados.courtDescription,
            selectedDays: dados.selectedDays,
            selectedTimeStart: dados.selectedTimeStart,
            selectedTimeEnd: dados.selectedTimeEnd,
            courtImageUrl: dados.courtImageUrl,
            courtDocumentUrl: dados.courtDocumentUrl,
            slot: dados.slot,
        }

        try {
            const quadraCriada = await this.quadraModel.criar(novaQuadra);
            return quadraCriada
        } catch (error: any) {
            console.error("Erro ao criar quadra no banco de dados", error);
            throw new Error("Erro ao cadastrar quadra");
        }
    }

    async buscarQuadras(): Promise<Quadra[]> {
        try {
            const quadras = await this.quadraModel.buscarQuadras();
            return quadras
        } catch (error: any) {
            console.error("Não foi possível filtrar quadras ", error)
            throw new Error("Não foi possível filtrar quadras")
        }
    }

    async buscarInfoQuadra(id: string): Promise<Quadra> {
        try {
            const quadraInfo = await this.quadraModel.buscarQuadraInfo(id);
            return quadraInfo;
        } catch (error: any) {
            console.error("Erro ao encontrar dados da quadra")
            throw new Error("Não foi possível retornar os dados da quadra")
        }
    }
}