import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { BuscarDisponibilidadeDTO, cadastrarSlotDTO } from '../dto/QuadraDTO';

export interface Slot {
    quadra_id: number;
    date: Date;
    horario_inicio: number;
    horario_fim: number;
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
            quadra_id TEXT NOT NULL, 
            date TEXT NOT NULL,
            horario_inicio INT NOT NULL,
            horario_fim INT NOT NULL,
            FOREIGN KEY (quadra_id) REFERENCES quadras(id)
            )
        `);
    }

    async criar(slotsDTOs: Array<Slot>): Promise<void> {
        const db = await this.dbPromise;
    
        // Extract all slots from multiple cadastrarSlotDTO entries
        const slots = slotsDTOs.map(slot => [slot.quadra_id, slot.date.toISOString().split("T")[0], slot.horario_inicio, slot.horario_fim])
    
        if (slots.length === 0) {
            throw new Error("Nenhum slot para inserir.");
        }
    
        // Prepare dynamic SQL query
        const placeholders = slots.map(() => "(?, ?, ?, ?)").join(", ");
        const query = `INSERT INTO slots (quadra_id, date, horario_inicio, horario_fim) VALUES ${placeholders}`;
    
        try {
            await db.run(query, slots.flat()); // Flatten values array
        } catch (error: any) {
            throw new Error("Erro ao inserir slots de disponibilidade: " + error.message);
        }
    }

    async buscarPorQuadraId(quadraId: number): Promise<Slot | undefined> {
        const db = await this.dbPromise;
        return await db.get('SELECT * FROM slots WHERE quadraId = ?', [quadraId]);
    }

    async buscarSlotsDisponiveis(data: BuscarDisponibilidadeDTO): Promise<Slot[]> {
        const db = await this.dbPromise;
        const query = "SELECT * FROM slots WHERE date = ? AND quadra_id = ?";
        const values = [data.date, data.quadraId];

        const result = await db.all(query, values) as Slot[];
          
        return result
    }
}