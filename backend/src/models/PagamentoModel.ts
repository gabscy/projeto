import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export interface Pagamento {
    id?: number;
    quadraId: string;
    cpfCapitao: string;
    valor: string;
    metodoPagamento: string;
    numeroCartao: string;
    cvv: string;
    vencimento: string;
    nomeCartao: string;
}

export class PagamentoModel {
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
            CREATE TABLE IF NOT EXISTS pagamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quadra_id TEXT NOT NULL,
                cpf_capitao TEXT NOT NULL,
                valor REAL NOT NULL,
                metodo_pagamento TEXT NOT NULL,
                numero_cartao TEXT NOT NULL,
                cvv TEXT NOT NULL,
                vencimento TEXT NOT NULL,
                nome_cartao TEXT NOT NULL,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id)
            )
        `);
    }

    async criar(data: Pagamento): Promise<Pagamento> {
        const db = await this.dbPromise;
        const result = await db.run(
            'INSERT INTO pagamentos (quadra_id, cpf_capitao, valor, metodo_pagamento, numero_cartao, cvv, vencimento, nome_cartao) VALUES (?,?,?,?,?,?,?,?)',
            [data.quadraId, data.cpfCapitao, data.valor, data.metodoPagamento, data.numeroCartao, data.cvv, data.vencimento, data.nomeCartao]
        )
        const id = result.lastID;
        if (id) {
            return {id, ...data}
        }
        throw new Error('Erro ao criar Pagamento')
    }
}