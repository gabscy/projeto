import { ReservaModel } from "../../models/ReservaModel"; // Adjust path if needed
import { open, Database } from "sqlite";

jest.mock("sqlite", () => ({
    open: jest.fn(() =>
        Promise.resolve({
            exec: jest.fn(),
            run: jest.fn(async () => ({ lastID: 1, changes: 1 })),
            all: jest.fn(async () => [{ id: 1, quadra_id: "123", data: "2025-05-09", pagamento_id: null, slot_id: "slot123" }]),
        } as unknown as Database)
    ),
}));

describe("ReservaModel", () => {
    let reservaModel: ReservaModel;

    beforeEach(() => {
        reservaModel = new ReservaModel();
    });

    test("should create the reservas table if it does not exist", async () => {
        const db = await reservaModel["dbPromise"];
        await reservaModel["upsertTabela"]();
        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS reservas"));
    });

    test("should insert a new reserva successfully", async () => {
        const newReserva = {
            quadraId: "123",
            dataReserva: "2025-05-09",
            nomeCapitao: "Gabriel",
            pagamentoId: undefined,
            slotId: "slot123",
        };
        // @ts-ignore
        const result = await reservaModel.criar(newReserva);
        expect(result).toEqual({ id: 1, ...newReserva });
    });

    test("should update an existing reserva successfully", async () => {
        const updateData = {
            id: 1,
            pagamentoId: "456",
        };

        const db = await reservaModel["dbPromise"];
        db.run = jest.fn().mockResolvedValue({ changes: 1 });
        // @ts-ignore
        const result = await reservaModel.atualizar(updateData);
        expect(result).toEqual({ changes: 1 });
    });

    test("should handle errors when creating a reserva", async () => {
        const mockDb = {
            run: jest.fn().mockRejectedValue(new Error("Erro ao inserir quadra")),
        };
        Object.defineProperty(reservaModel, "dbPromise", {
            value: Promise.resolve(mockDb),
        });

        const newReserva = {
            quadraId: "123",
            dataReserva: "2025-05-09",
            nomeCapitao: "Gabriel",
            pagamentoId: null,
            slotId: "slot123",
        };
        // @ts-ignore
        await expect(reservaModel.criar(newReserva)).rejects.toThrow("Erro ao inserir quadra");
    });

    test("should throw an error when updating a reserva with no valid fields", async () => {
        // @ts-ignore
        await expect(reservaModel.atualizar({})).rejects.toThrow("Nenhum campo para atualizar.");
    });
});