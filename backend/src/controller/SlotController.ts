import { cadastrarSlotDTO } from "../dto/QuadraDTO";
import { Slot, SlotModel } from "../models/SlotModel";

export class SlotController {
    private slotModel = new SlotModel();

    constructor() {
        this.slotModel = new SlotModel();
    }

    async cadastrarSlot(slotData: Omit<cadastrarSlotDTO, 'slots'>): Promise<void> {
        try {
            const dias_funcionamento = JSON.parse(slotData.dias_funcionamento)
            const { quadra_id, horario_inicio, horario_fim, slot } = slotData;
            const slots: Slot[] = [];
            const today = new Date();

            const daysMap: Record<string, number> = {
                sunday: 0,
                monday: 1,
                tuesday: 2,
                wednesday: 3,
                thursday: 4,
                friday: 5,
                saturday: 6,
            };
    
            // Convert JSON `dias_funcionamento` to an active days list
            const activeDays = Object.entries(dias_funcionamento)
                .filter(([day, isActive]) => isActive) // Filter only active days
                .map(([day]) => daysMap[day]); // Convert to numeric values

            // Loop through the next 30 days
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i); // Move forward by `i` days

                const dayOfWeek = date.getDay(); // Numeric day (0-6)

                // Check if the court operates on this day
                if (activeDays.includes(dayOfWeek)) {
                    let currentHour = horario_inicio;

                    // Generate slots within working hours based on `slot` duration
                    while (Number(currentHour) + slot / 60 <= horario_fim) {
                        slots.push({
                            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                            horario_inicio: Number(currentHour),
                            horario_fim: Number(currentHour) + slot / 60, // Set slot length dynamically
                            quadra_id: quadra_id
                        });

                        currentHour = Number(currentHour) + slot / 60; // Move to the next slot
                    }
                }
            }

            await this.slotModel.criar(slots)

            return;
        } catch (error: any) {
            console.error("Erro ao criar slot", error);
            throw new Error("Erro ao criar slot");
        }
    }
}