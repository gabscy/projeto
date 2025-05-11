import { UserRepository } from "../repository/UserRepository";
import { User } from "../models/UserModel";
import { editarUsuarioDTO } from "../dto/QuadraDTO";

export class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async editarConta(dados: editarUsuarioDTO): Promise<Omit<User, "password" | "tipo">> {
        try {
            const user = await this.repository.editarConta(dados);
            return user;
        } catch (error: any) {
            console.error("Erro ao editar usuário:", error.message);
            throw new Error("Erro ao atualizar dados do usuário.");
        }
    }
}