import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { AtualizarPagamentoReservaDTO } from '../dto/QuadraDTO';

export interface Reserva {
    id?: number;
    quadraId: string;
    dataReserva: string;
    nomeCapitao: string;
    pagamentoId?: string;
    slotId: string;
}

export class ReservaModel {
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
            CREATE TABLE IF NOT EXISTS reservas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quadra_id TEXT NOT NULL,
                data TEXT NOT NULL,
                pagamento_id TEXT,
                slot_id TEXT NOT NULL UNIQUE,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id)
                FOREIGN KEY (pagamento_id) REFERENCES pagamentos(id)
                FOREIGN KEY (slot_id) REFERENCES slots(id)
            )
        `);
    }

    async criar(data: Reserva): Promise<Reserva> {
        const db = await this.dbPromise;
        const result = await db.run(
            'INSERT INTO reservas (quadra_id, data, pagamento_id, slot_id) VALUES (?,?,?,?)',
            [data.quadraId, data.dataReserva, data.pagamentoId, data.slotId]
        )
        const id = result.lastID;
        if (id) {
            return {id, ...data}
        }
        throw new Error('Erro ao inserir quadra')
    }

    async atualizar(data: AtualizarPagamentoReservaDTO): Promise<any> {
        const db = await this.dbPromise;
    
        // Extract fields that need updating
        const updates = Object.entries(data)
            .filter(([_, value]) => value !== undefined) // Ignore undefined fields
            .map(([key]) => `${key} = ?`); // Map to SQL column assignments
    
        if (updates.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
        }
    
        const query = `UPDATE reservas SET ${updates.join(', ')} WHERE id = ?`;
        const values = Object.values(data).filter(value => value !== undefined);
        values.push(data.id); // Append the ID for WHERE clause
    
        const result = await db.run(query, values);
        return result; // Fetch updated record
    }
}