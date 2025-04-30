import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export interface Quadra {
    id?: number;
    courtName: string;
    courtType: string;
    courtAddress: string;
    courtPrice: number;
    courtRules: string;
    courtDescription: string;
    selectedDays: string;
    selectedTimeStart: number;
    selectedTimeEnd: number;
    slot: number;
    slotId: number;
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
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                address TEXT NOT NULL,
                price REAL NOT NULL,
                rules TEXT NOT NULL,
                description TEXT NOT NULL,
                time_start TEXT NOT NULL,
                time_end TEXT NOT NULL,
                slot TEXT NOT NULL,
                slot_id INTEGER NOT NULL,
                FOREIGN KEY (slot_id) REFERENCES slots(id)
            )
        `);
    }

    async criar(data: Quadra): Promise<Quadra> {
        const db = await this.dbPromise;
        const result = await db.run(
            'INSERT INTO quadras (name, type, address, price, rules, description, time_start, time_end, slot, slot_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [data.courtName, data.courtType, data.courtAddress, data.courtPrice, data.courtRules, data.courtDescription, data.selectedTimeStart, data.selectedTimeEnd, data.slot, data.slotId]
        )
        const id = result.lastID;
        if (id) {
            return {id, ...data}
        }
        throw new Error('Erro ao inserir quadra')
    }
}