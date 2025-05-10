import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import { Slot } from "../models/SlotModel";
import { BuscarDisponibilidadeDTO } from "../dto/QuadraDTO";

export class SlotRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = open({
            filename: "./database.sqlite",
            driver: sqlite3.Database,
        });
        this.criarTabelaSeNaoExistir();
    }

    private async criarTabelaSeNaoExistir(): Promise<void> {
        const db = await this.dbPromise;
        await db.exec(`
            CREATE TABLE IF NOT EXISTS slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quadra_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            horario_inicio INT NOT NULL,
            horario_fim INT NOT NULL,
            available BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (quadra_id) REFERENCES quadras(id)
            )
        `);
    }

    async criar(slotsDTOs: Slot[], db: Database): Promise<void> {
        const slots = slotsDTOs.map(slot => [
            slot.quadra_id,
            slot.date.toISOString().split("T")[0],
            slot.horario_inicio,
            slot.horario_fim
        ]);

        if (slots.length === 0) {
            throw new Error("Nenhum slot para inserir.");
        }

        const placeholders = slots.map(() => "(?, ?, ?, ?)").join(", ");
        const query = `INSERT INTO slots (quadra_id, date, horario_inicio, horario_fim) VALUES ${placeholders}`;

        try {
            await db.run(query, slots.flat());
        } catch (error: any) {
            throw new Error("Erro ao inserir slots de disponibilidade: " + error.message);
        }
    }

    async buscarPorQuadraId(quadraId: number): Promise<Slot | undefined> {
        const db = await this.dbPromise;
        return await db.get("SELECT * FROM slots WHERE quadra_id = ?", [quadraId]);
    }

    async buscarSlotsDisponiveis(data: BuscarDisponibilidadeDTO): Promise<Slot[]> {
        const db = await this.dbPromise;
        const query = "SELECT * FROM slots WHERE date = ? AND quadra_id = ? AND available = FALSE";
        const values = [data.date, data.quadraId];

        return await db.all(query, values) as Slot[];
    }

    async alterarDisponibilidade(slotId: string, db: Database): Promise<boolean> {
        try {
            await db.run("UPDATE slots SET available = TRUE WHERE id = ?", [slotId]);
            return true;
        } catch (error: any) {
            return false;
        }
    }
}