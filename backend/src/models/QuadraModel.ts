import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export interface Quadra {
    id?: number;
    nome: string;
    tipo: string;
    endereco: string;
    preco: number;
    regras: string;
    descricao: string;
}

export class QuadraModel {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = open({
            filename: './database.sqlite',
            driver: sqlite3.Database,
        })
        this.upsertTabela();
    }

    private async upsertTabela(): Promise<void> {
        const db = await this.dbPromise;
        await db.exec(`
            CREATE TABLE IF NOT EXISTS quadras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                tipo TEXT NOT NULL,
                endereco TEXT NOT NULL,
                preco REAL NOT NULL,
                regras TEXT NOT NULL,
                descricao TEXT NOT NULL
            )
        `);
    }

    async criar(data: Quadra): Promise<Quadra> {
        const db = await this.dbPromise;
        const result = await db.run(
            'INSERT INTO quadras (nome, tipo, endereco, preco, regras, descricao) VALUES (?, ?, ?, ?, ?, ?)',
            [data.nome, data.tipo, data.endereco, data.preco, data.regras, data.descricao]
        )
        const id = result.lastID;
        if (id) {
            return {id, ...data}
        }
        throw new Error('Erro ao inserir quadra')
    }
}