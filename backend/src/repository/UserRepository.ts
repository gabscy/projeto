import { User } from "../models/UserModel";
import { editarUsuarioDTO, tipoDTO } from "../dto/QuadraDTO";
import { getSqlConnection } from '../dbconnection';

export class UserRepository {
    constructor() {
        this.ensureTableExists();
    }

    private async ensureTableExists() {
        try {
            const pool = await getSqlConnection();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
                CREATE TABLE users (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    nome NVARCHAR(255),
                    username NVARCHAR(255),
                    email NVARCHAR(255) UNIQUE,
                    password NVARCHAR(255),
                    cidade NVARCHAR(255),
                    estado NVARCHAR(255),
                    tipo NVARCHAR(50) NOT NULL CHECK (tipo IN ('ADM', 'CAP', 'JOG'))
                )
            `);
        } catch (error: any) {
            console.error("Erro ao garantir a existência da tabela users:", error.message);
        }
    }

    async login(email: string, senha: string): Promise<tipoDTO | null> {
        try {
            const pool = await getSqlConnection();
            const result = await pool.request()
                .input('email', email)
                .input('senha', senha)
                .query('SELECT id, tipo, estado FROM users WHERE email = @email AND password = @senha');
            return result.recordset[0] || null;
        } catch (error: any) {
            console.error("Erro ao buscar usuário no banco de dados", error.message);
            throw new Error("Não foi possível autenticar o usuário");
        }
    }

    async editarConta(dados: editarUsuarioDTO): Promise<Omit<User, "password" | "tipo">> {
        try {
            const pool = await getSqlConnection();

            // Build dynamic update query
            const updates = [];
            const values: any[] = [];
            for (const [key, value] of Object.entries(dados)) {
                if (key !== "id" && value !== undefined && value !== null) {
                    updates.push(`${key} = @${key}`);
                    values.push({ name: key, value });
                }
            }
            if (updates.length === 0) {
                throw new Error("Nenhum campo válido para atualizar");
            }

            const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE id = @id`;
            const request = pool.request();
            for (const param of values) {
                request.input(param.name, param.value);
            }
            request.input("id", dados.id);
            await request.query(updateQuery);

            // Fetch updated user
            const selectResult = await pool.request()
                .input("id", dados.id)
                .query("SELECT id, nome, username, email, cidade, estado FROM users WHERE id = @id");
            return selectResult.recordset[0];
        } catch (error: any) {
            console.error("Erro ao editar os dados do usuário no banco de dados", error.message);
            throw new Error("Não foi possível editar os dados do usuário no banco de dados");
        }
    }
}