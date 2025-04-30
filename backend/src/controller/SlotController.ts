import { Slot, SlotModel } from "../models/SlotModel";

export class SlotController {
    private slotModel = new SlotModel();

    constructor() {
        this.slotModel = new SlotModel();
    }

    async cadastrarSlot(selectedDays: Slot): Promise<number> {
        try {
            const slotCriado = await this.slotModel.criar(selectedDays)
            return slotCriado.id;
        } catch (error: any) {
            console.error("Erro ao criar slot", error);
            throw new Error("Erro ao criar slot");
        }
    }
}