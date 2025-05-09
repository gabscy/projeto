import { QuadraModel } from "../../models/QuadraModel";
import { open, Database } from "sqlite";

jest.mock("sqlite", () => ({
    open: jest.fn(() =>
        Promise.resolve({
            exec: jest.fn(),
            run: jest.fn(async () => ({ lastID: 1 })),
            all: jest.fn(async () => [{ time_start: "08:00", time_end: "18:00", slot: 2 }]),
        } as unknown as Database)
    ),
}));

describe("QuadraModel", () => {
    let quadraModel: QuadraModel;

    beforeEach(() => {
        quadraModel = new QuadraModel();
    });

    test("should create the quadras table if it does not exist", async () => {
        const db = await quadraModel["dbPromise"];
        await quadraModel["upsertTabela"]();
        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS quadras"));
    });

    test("should insert a new quadra successfully", async () => {
        const newQuadra = {
            courtName: "Arena 1",
            courtType: "Futebol",
            courtAddress: "Rua 123",
            courtCity: "São Paulo",
            courtState: "SP",
            courtCEP: "01234-567",
            courtPrice: 100,
            courtRules: "Sem bebidas alcoólicas",
            courtDescription: "Quadra oficial",
            selectedDays: "Segunda, Quarta, Sexta",
            selectedTimeStart: 8,
            selectedTimeEnd: 18,
            courtImageUrl: "https://example.com/image.jpg",
            courtDocumentUrl: "https://example.com/doc.pdf",
            slot: 2,
        };

        const result = await quadraModel.criar(newQuadra);
        expect(result).toEqual({ id: 1, ...newQuadra });
    });

    test("should retrieve operation hours of a quadra", async () => {
        const horarioFuncionamento = await quadraModel.pegarHorarioFuncionamento("1");
        expect(horarioFuncionamento).toEqual([{ time_start: "08:00", time_end: "18:00", slot: 2 }]);
    });

    test("should fetch all quadras", async () => {
        const db = await quadraModel["dbPromise"];
        db.all = jest.fn().mockResolvedValue([{ id: 1, name: "Arena 1" }]);

        const quadras = await quadraModel.buscarQuadras();
        expect(quadras).toEqual([{ id: 1, name: "Arena 1" }]);
    });

    test("should fetch quadra info by ID", async () => {
        const db = await quadraModel["dbPromise"];
        db.all = jest.fn().mockResolvedValue([
            {
                courtName: "Arena 1",
                courtType: "Futebol",
                courtAddress: "Rua 123",
                courtCity: "São Paulo",
                courtState: "SP",
                courtCEP: "01234-567",
                courtPrice: 100,
                courtRules: "Sem bebidas alcoólicas",
                courtDescription: "Quadra oficial",
                selectedDays: "Segunda, Quarta, Sexta",
                selectedTimeStart: 8,
                selectedTimeEnd: 18,
                courtImageUrl: "https://example.com/image.jpg",
                courtDocumentUrl: "https://example.com/doc.pdf",
                slot: 2,
            }
        ]);

        const quadraInfo = await quadraModel.buscarQuadraInfo("1");
        expect(quadraInfo).toEqual(
            [{
                courtName: "Arena 1",
                courtType: "Futebol",
                courtAddress: "Rua 123",
                courtCity: "São Paulo",
                courtState: "SP",
                courtCEP: "01234-567",
                courtPrice: 100,
                courtRules: "Sem bebidas alcoólicas",
                courtDescription: "Quadra oficial",
                selectedDays: "Segunda, Quarta, Sexta",
                selectedTimeStart: 8,
                selectedTimeEnd: 18,
                courtImageUrl: "https://example.com/image.jpg",
                courtDocumentUrl: "https://example.com/doc.pdf",
                slot: 2,
            }]
        );
    });

    test("should throw an error if quadra creation fails", async () => {
        // Create a mock database instance where `run()` always fails
        const mockDb = {
            run: jest.fn().mockRejectedValue(new Error("Erro ao criar quadra")),
        };
    
        // Override `dbPromise` to return this mocked database instance
        Object.defineProperty(quadraModel, "dbPromise", {
            value: Promise.resolve(mockDb),
        });
    
        const newQuadra = {
            courtName: "Arena 1",
            courtType: "Futebol",
            courtAddress: "Rua 123",
            courtCity: "São Paulo",
            courtState: "SP",
            courtCEP: "01234-567",
            courtPrice: 100,
            courtRules: "Sem bebidas alcoólicas",
            courtDescription: "Quadra oficial",
            selectedDays: "Segunda, Quarta, Sexta",
            selectedTimeStart: 8,
            selectedTimeEnd: 18,
            courtImageUrl: "https://example.com/image.jpg",
            courtDocumentUrl: "https://example.com/doc.pdf",
            slot: 2,
        };
    
        await expect(quadraModel.criar(newQuadra)).rejects.toThrow("Erro ao criar quadra");
    });
});