import { Pagamento } from '../models/PagamentoModel';
import { getSqlConnection } from '../dbconnection';
import sql from "mssql";

export class PagamentoRepository {
    constructor() {
        this.ensureTableExists();
    }

    private async ensureTableExists(): Promise<void> {
        const pool = await getSqlConnection();
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pagamentos' AND xtype='U')
            CREATE TABLE pagamentos (
                id INT IDENTITY(1,1) PRIMARY KEY,
                quadra_id INT NOT NULL,
                cpf_capitao NVARCHAR(255) NOT NULL,
                valor FLOAT NOT NULL,
                metodo_pagamento NVARCHAR(255) NOT NULL,
                numero_cartao NVARCHAR(255) NOT NULL,
                cvv NVARCHAR(255) NOT NULL,
                vencimento NVARCHAR(255) NOT NULL,
                nome_cartao NVARCHAR(255) NOT NULL,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id)
            )
        `);
    }

    async criarPagamento(data: Pagamento, transaction: sql.Transaction): Promise<number> {
        try {
            const request = transaction.request();
            const result = await request
                .input('quadra_id', sql.Int, data.quadraId)
                .input('cpf_capitao', sql.NVarChar(255), data.cpfCapitao)
                .input('valor', sql.Float, data.valor)
                .input('metodo_pagamento', sql.NVarChar(255), data.metodoPagamento)
                .input('numero_cartao', sql.NVarChar(255), data.numeroCartao)
                .input('cvv', sql.NVarChar(255), data.cvv)
                .input('vencimento', sql.NVarChar(255), data.vencimento)
                .input('nome_cartao', sql.NVarChar(255), data.nomeCartao)
                .query(
                    `INSERT INTO pagamentos 
                    (quadra_id, cpf_capitao, valor, metodo_pagamento, numero_cartao, cvv, vencimento, nome_cartao)
                    OUTPUT INSERTED.id
                    VALUES (@quadra_id, @cpf_capitao, @valor, @metodo_pagamento, @numero_cartao, @cvv, @vencimento, @nome_cartao)`
                );
            return result.recordset[0].id;
        } catch (error: any) {
            throw new Error('Erro ao criar pagamento');
        }
    }
}