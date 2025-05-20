import { SlotRepository } from "../repository/SlotRepository";
import { Slot } from "../models/SlotModel";
import { BuscarDisponibilidadeDTO, cadastrarSlotDTO } from "../dto/QuadraDTO";
import { Database } from "sqlite";

export class SlotService {
    private repository: SlotRepository;

    constructor(repository: SlotRepository) {
        this.repository = repository;
    }

    async cadastrarSlot(slotData: Omit<cadastrarSlotDTO, "slots">, db: Database): Promise<void> {
        try {
            const dias_funcionamento = JSON.parse(slotData.dias_funcionamento);
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
                .filter(([_, isActive]) => isActive)
                .map(([day]) => daysMap[day]);

            // Generate slots for the next 30 days
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                if (activeDays.includes(date.getDay())) {
                    let currentHour = Number(horario_inicio);
                    while (Number(currentHour) + Number(slot) / 60 <= Number(horario_fim)) {
                        slots.push(new Slot(quadra_id, date, currentHour, currentHour + slot / 60));
                        currentHour += slot / 60;
                    }
                }
            }

            await this.repository.criar(slots, db);
        } catch (error) {
            console.error("Erro ao criar slot", error);
            throw new Error("Erro ao criar slot");
        }
    }

    async buscarDisponibilidade(dados: BuscarDisponibilidadeDTO): Promise<Slot[]> {
        return await this.repository.buscarSlotsDisponiveis(dados);
    }

    async alterarDisponibilidade(slotId: string, db: Database): Promise<boolean> {
        return await this.repository.alterarDisponibilidade(slotId, db);
    }
}