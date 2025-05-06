import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { editarUsuarioDTO } from '../dto/QuadraDTO';

export interface User {
    id: string,
    email: string,
    nome: string,
    username: string,
    cidade: string,
    estado: string,
    password: string,
    tipo: string,
}

export class UserModel {
    private dbPromise: Promise<Database>

    constructor() {
        this.dbPromise = open({
            filename: './database.sqlite',
            driver: sqlite3.Database,
        });
        this.criarTabelaSeNaoExistir();
    }

    private async criarTabelaSeNaoExistir(): Promise<void> {
        const db = await this.dbPromise;
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL, 
            password TEXT NOT NULL,
            nome TEXT NOT NULL,
            username TEXT NOT NULL,
            cidade TEXT NOT NULL,
            estado TEXT NOT NULL,
            tipo TEXT NOT NULL CHECK(tipo IN ('ADM', 'CAP', 'JOG'))
            )
        `);
    }

    async editarConta(dados: editarUsuarioDTO): Promise<Omit<User, 'password' | 'tipo'>> {
        const db = await this.dbPromise;
        const updates = Object.entries(dados)
            .filter(([key, value]) => key !== "id" && value !== undefined && value !== null)
            .map(([key, _]) => `${key} = ?`);

        const values = Object.entries(dados)
            .filter(([key, value]) => key !== "id" && value !== undefined && value !== null)
            .map(([_, value]) => value);

        if (updates.length === 0) {
            throw new Error("Nenhum campo válido para atualizar");
        }

        const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
        values.push(dados.id); // Ensure 'id' is used only in the WHERE clause
    
        try {
            await db.run(query, values);

            const selectQuery = 'SELECT id, nome, username, email, cidade, estado FROM users WHERE id = ?'
            const updatedUser = await db.get(selectQuery, [dados.id])

            return updatedUser
        } catch (error: any) {
            console.error("Erro ao editar os dados do usuário no banco de dados ", error.message)
            throw new Error("Não foi possível editar os dados do usuário no banco de dados")
        }
    }
}