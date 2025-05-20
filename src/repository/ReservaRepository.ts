import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Reserva } from "../models/ReservaModel";
import { AtualizarPagamentoReservaDTO } from "../dto/QuadraDTO";

export class ReservaRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = open({
            filename: "./database.sqlite",
            driver: sqlite3.Database,
        });
        this.upsertTabela();
    }

    private async upsertTabela(): Promise<void> {
        const db = await this.dbPromise;

        await db.exec("PRAGMA foreign_keys = ON;");

        await db.exec(`
            CREATE TABLE IF NOT EXISTS reservas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quadra_id TEXT NOT NULL,
                data TEXT NOT NULL,
                pagamento_id TEXT,
                slot_id TEXT NOT NULL UNIQUE,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id),
                FOREIGN KEY (pagamento_id) REFERENCES pagamentos(id),
                FOREIGN KEY (slot_id) REFERENCES slots(id)
            )
        `);
    }

    async criarReserva(data: Reserva, db: Database): Promise<Reserva> {
        try {
            const result = await db.run(
                "INSERT INTO reservas (quadra_id, data, pagamento_id, slot_id) VALUES (?,?,?,?)",
                [data.quadraId, data.dataReserva, data.pagamentoId, data.slotId]
            );
            const id = result.lastID;
            if (!id) throw new Error("Erro ao inserir reserva");
            return new Reserva(data.quadraId, data.dataReserva, data.nomeCapitao, data.slotId, data.pagamentoId, id);
        } catch (error) {
            console.error("Erro ao criar reserva:", error);
            throw new Error("Erro ao criar reserva");
        }
    }

    async atualizarReserva(data: AtualizarPagamentoReservaDTO): Promise<void> {
        const db = await this.dbPromise;

        const updates = Object.entries(data)
            .filter(([_, value]) => value !== undefined)
            .map(([key]) => `${key} = ?`);

        if (updates.length === 0) throw new Error("Nenhum campo para atualizar.");

        const query = `UPDATE reservas SET ${updates.join(", ")} WHERE id = ?`;
        const values = Object.values(data).filter(value => value !== undefined);
        values.push(data.id);

        await db.run(query, values);
    }
}