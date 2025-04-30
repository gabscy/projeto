import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export interface Slot {
    id: number;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export class SlotModel {
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
            CREATE TABLE IF NOT EXISTS slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            monday BOOLEAN NOT NULL DEFAULT 0,
            tuesday BOOLEAN NOT NULL DEFAULT 0,
            wednesday BOOLEAN NOT NULL DEFAULT 0,
            thursday BOOLEAN NOT NULL DEFAULT 0,
            friday BOOLEAN NOT NULL DEFAULT 0,
            saturday BOOLEAN NOT NULL DEFAULT 0,
            sunday BOOLEAN NOT NULL DEFAULT 0
            )
        `);
    }

    async criar(slot: Omit<Slot, 'id'>): Promise<Slot> {
        const db = await this.dbPromise;
        const result = await db.run(
          'INSERT INTO slots (monday, tuesday, wednesday, thursday, friday, saturday, sunday) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [slot.monday, slot.tuesday, slot.wednesday, slot.thursday, slot.friday, slot.saturday, slot.sunday]
        );
        const id = result.lastID;
        if (id) {
          return { id, ...slot };
        }
        throw new Error('Erro ao inserir slot de disponibilidade.');
    }

    async buscarPorQuadraId(quadraId: number): Promise<Slot | undefined> {
        const db = await this.dbPromise;
        return await db.get('SELECT * FROM slots WHERE quadraId = ?', [quadraId]);
    }
}