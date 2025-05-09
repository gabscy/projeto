import { SlotModel } from "../../models/SlotModel"; // Adjust path if needed
import { open, Database } from "sqlite";

jest.mock("sqlite", () => ({
    open: jest.fn(() =>
        Promise.resolve({
            exec: jest.fn(),
            run: jest.fn(async () => ({ lastID: 1, changes: 1 })),
            all: jest.fn(async () => [
                { quadra_id: 1, date: "2025-05-09", horario_inicio: 8, horario_fim: 18 }
            ]),
            get: jest.fn(async () => ({ quadra_id: 1, date: "2025-05-09", horario_inicio: 8, horario_fim: 18 })),
        } as unknown as Database)
    ),
}));

describe("SlotModel", () => {
    let slotModel: SlotModel;

    beforeEach(() => {
        slotModel = new SlotModel();
    });

    test("should create the slots table if it does not exist", async () => {
        const db = await slotModel["dbPromise"];
        await slotModel["criarTabelaSeNaoExistir"]();
        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS slots"));
    });

    test("should insert multiple slots successfully", async () => {
        const newSlots = [
            { quadra_id: 1, date: new Date("2025-05-09"), horario_inicio: 8, horario_fim: 18 },
            { quadra_id: 1, date: new Date("2025-05-10"), horario_inicio: 10, horario_fim: 20 }
        ];

        await slotModel.criar(newSlots);
        expect(await slotModel["dbPromise"]).toBeDefined();
    });

    test("should throw an error if no slots are provided for insertion", async () => {
        await expect(slotModel.criar([])).rejects.toThrow("Nenhum slot para inserir.");
    });

    test("should retrieve slots by quadraId", async () => {
        const result = await slotModel.buscarPorQuadraId(1);
        expect(result).toEqual({ quadra_id: 1, date: "2025-05-09", horario_inicio: 8, horario_fim: 18 });
    });

    test("should fetch available slots based on date and quadra_id", async () => {
        const data = { date: "2025-05-09", quadraId: "1" };
        const result = await slotModel.buscarSlotsDisponiveis(data);
        expect(result).toEqual([{ quadra_id: 1, date: "2025-05-09", horario_inicio: 8, horario_fim: 18 }]);
    });

    test("should handle errors when inserting slots", async () => {
        const mockDb = {
            run: jest.fn().mockRejectedValue(new Error("Erro ao inserir slots")),
        };
        Object.defineProperty(slotModel, "dbPromise", {
            value: Promise.resolve(mockDb),
        });

        const newSlots = [{ quadra_id: 1, date: new Date(), horario_inicio: 8, horario_fim: 18 }];
        await expect(slotModel.criar(newSlots)).rejects.toThrow("Erro ao inserir slots de disponibilidade");
    });
});