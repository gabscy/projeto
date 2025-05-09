import { UserModel } from "../../models/UserModel"; // Adjust the path
import { Database } from "sqlite";

jest.mock("sqlite", () => ({
    open: jest.fn(() =>
        Promise.resolve({
            exec: jest.fn(),
            run: jest.fn(async () => ({ changes: 1 })),
            get: jest.fn(async () => ({
                id: "1",
                nome: "Gabriel",
                username: "gabriel_user",
                email: "gabriel@example.com",
                cidade: "Rio de Janeiro",
                estado: "RJ",
            })),
        } as unknown as Database)
    ),
}));

describe("UserModel", () => {
    let userModel: UserModel;

    beforeEach(() => {
        userModel = new UserModel();
    });

    test("should create the users table if it does not exist", async () => {
        const db = await userModel["dbPromise"];
        await userModel["criarTabelaSeNaoExistir"]();
        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS users"));
    });

    test("should update a user successfully", async () => {
        const updatedData = {
            id: "1",
            nome: "Gabriel Silva",
            cidade: "São Paulo",
        };

        const result = await userModel.editarConta(updatedData);
        expect(result).toEqual({
            id: "1",
            nome: "Gabriel",
            username: "gabriel_user",
            email: "gabriel@example.com",
            cidade: "Rio de Janeiro",
            estado: "RJ",
        });
    });

    test("should throw an error if no valid fields are provided for updating", async () => {
        await expect(userModel.editarConta({ id: "1" })).rejects.toThrow("Nenhum campo válido para atualizar");
    });

    test("should handle errors when updating user data", async () => {
        const mockDb = {
            run: jest.fn().mockRejectedValue(new Error("Database error")),
        };
        Object.defineProperty(userModel, "dbPromise", {
            value: Promise.resolve(mockDb),
        });

        const updatedData = { id: "1", nome: "New Name" };
        await expect(userModel.editarConta(updatedData)).rejects.toThrow("Não foi possível editar os dados do usuário no banco de dados");
    });
});