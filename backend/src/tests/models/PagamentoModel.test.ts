import { PagamentoModel } from "../../models/PagamentoModel"; // Adjust the path as needed
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

jest.mock("sqlite", () => ({
    open: jest.fn(() =>
        Promise.resolve({
            exec: jest.fn(),
            run: jest.fn(async () => ({ lastID: 1 })),
        } as unknown as Database)
    ),
}));

describe("PagamentoModel", () => {
    let pagamentoModel: PagamentoModel;

    beforeEach(() => {
        pagamentoModel = new PagamentoModel();
    });

    test("should create the pagamentos table if it does not exist", async () => {
        const db = await pagamentoModel["dbPromise"];
        await pagamentoModel["upsertTabela"]();
        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS pagamentos"));
    });

    test("should create a new pagamento successfully", async () => {
        const newPagamento = {
            quadraId: "123",
            cpfCapitao: "99999999999",
            valor: "100.5",
            metodoPagamento: "cartao",
            numeroCartao: "1234567812345678",
            cvv: "123",
            vencimento: "12/25",
            nomeCartao: "João Silva",
        };

        const result = await pagamentoModel.criar(newPagamento);
        expect(result).toEqual({ id: 1, ...newPagamento });
    });

    test("should throw an error if pagamento creation fails", async () => {
        // Create a mock database instance with `run()` throwing an error
        const mockDb = {
            run: jest.fn().mockRejectedValue(new Error("Erro ao criar Pagamento")),
        };
    
        // Override `dbPromise` to return this mock database
        Object.defineProperty(pagamentoModel, "dbPromise", {
            value: Promise.resolve(mockDb),
        });
    
        const newPagamento = {
            quadraId: "123",
            cpfCapitao: "99999999999",
            valor: "100.5",
            metodoPagamento: "cartao",
            numeroCartao: "1234567812345678",
            cvv: "123",
            vencimento: "12/25",
            nomeCartao: "João Silva",
        };
    
        await expect(pagamentoModel.criar(newPagamento)).rejects.toThrow("Erro ao criar Pagamento");
    });
});