import { editarUsuarioDTO } from "../dto/QuadraDTO";
import { User, UserModel } from "../models/UserModel";

export class UserController {
    private UserModel: UserModel;

    constructor() {
        this.UserModel = new UserModel();
    }

    async editarConta(dados: editarUsuarioDTO): Promise<Omit<User, 'password' | 'tipo'>> {
        const user = await this.UserModel.editarConta(dados)
        return user
    }
}