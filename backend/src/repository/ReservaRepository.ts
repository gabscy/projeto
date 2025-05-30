import { Reserva } from "../models/ReservaModel";
import { AtualizarPagamentoReservaDTO } from "../dto/QuadraDTO";
import { getSqlConnection } from "../dbconnection";
import sql from "mssql";

export class ReservaRepository {
    constructor() {
        this.ensureTableExists();
    }

    private async ensureTableExists(): Promise<void> {
        const pool = await getSqlConnection();
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reservas' AND xtype='U')
            CREATE TABLE reservas (
                id INT IDENTITY(1,1) PRIMARY KEY,
                quadra_id INT NOT NULL,
                data DATE NOT NULL,
                pagamento_id INT,
                slot_id INT NOT NULL UNIQUE,
                nome_capitao NVARCHAR(255),
                FOREIGN KEY (quadra_id) REFERENCES quadras(id),
                FOREIGN KEY (pagamento_id) REFERENCES pagamentos(id),
                FOREIGN KEY (slot_id) REFERENCES slots(id)
            )
        `);
    }

    async criarReserva(data: Reserva, transaction: sql.Transaction): Promise<Reserva> {
        try {
            const request = transaction.request();
            const result = await request
                .input('quadra_id', sql.Int, data.quadraId)
                .input('data', sql.Date, new Date(data.dataReserva))
                .input('pagamento_id', sql.Int, data.pagamentoId ? Number(data.pagamentoId) : null)
                .input('slot_id', sql.Int, data.slotId)
                .input('nome_capitao', sql.NVarChar(255), data.nomeCapitao)
                .query(
                    `INSERT INTO reservas (quadra_id, data, pagamento_id, slot_id, nome_capitao)
                     OUTPUT INSERTED.id
                     VALUES (@quadra_id, @data, @pagamento_id, @slot_id, @nome_capitao)`
                );
            const id = result.recordset[0].id;
            if (!id) throw new Error("Erro ao inserir reserva");
            return new Reserva(
                data.quadraId,
                data.dataReserva,
                data.nomeCapitao,
                data.slotId,
                data.pagamentoId,
                id
            );
        } catch (error) {
            console.error("Erro ao criar reserva:", error);
            throw new Error("Erro ao criar reserva");
        }
    }

    async atualizarReserva(data: AtualizarPagamentoReservaDTO): Promise<void> {
        const pool = await getSqlConnection();

        const updates = Object.entries(data)
            .filter(([key, value]) => key !== "id" && value !== undefined)
            .map(([key]) => `${key} = @${key}`);

        if (updates.length === 0) throw new Error("Nenhum campo para atualizar.");

        const query = `UPDATE reservas SET ${updates.join(", ")} WHERE id = @id`;
        const request = pool.request();
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                request.input(key, value);
            }
        }
        await request.query(query);
    }
}