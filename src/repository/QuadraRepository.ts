import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Quadra } from "../models/QuadraModel";
import { PegarHorarioFuncionamentoDTO } from "../dto/QuadraDTO";

export class QuadraRepository {
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
        await db.exec(`
            CREATE TABLE IF NOT EXISTS quadras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                cep TEXT NOT NULL,
                price REAL NOT NULL,
                rules TEXT NOT NULL,
                description TEXT NOT NULL,
                time_start TEXT NOT NULL,
                time_end TEXT NOT NULL,
                slot TEXT NOT NULL,
                image_url TEXT NOT NULL,
                document_url TEXT NOT NULL
            )
        `);
    }

    async criarQuadra(data: Quadra, db: Database): Promise<Quadra> {
        try {
            const result = await db.run(
                "INSERT INTO quadras (name, type, address, city, state, cep, price, rules, description, time_start, time_end, slot, image_url, document_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [data.courtName, data.courtType, data.courtAddress, data.courtCity, data.courtState, data.courtCEP, data.courtPrice, data.courtRules, data.courtDescription, data.selectedTimeStart, data.selectedTimeEnd, data.slot, data.courtImageUrl, data.courtDocumentUrl]
            );
            const id = result.lastID;
            return new Quadra(
                data.courtName,
                data.courtType,
                data.courtAddress,
                data.courtCity,
                data.courtState,
                data.courtCEP,
                data.courtPrice,
                data.courtRules,
                data.courtDescription,
                data.selectedDays,
                data.selectedTimeStart,
                data.selectedTimeEnd,
                data.courtImageUrl,
                data.courtDocumentUrl,
                data.slot,
                id
            );
        } catch (error) {
            throw new Error("Erro ao criar quadra");
        }
    }

    async pegarHorarioFuncionamento(quadraId: string): Promise<PegarHorarioFuncionamentoDTO> {
        const db = await this.dbPromise;
        const query = "SELECT time_start, time_end, slot FROM quadras WHERE id = ?";
        const values = [quadraId];

        const horarioDeFuncionamento = await db.get(query, values) as PegarHorarioFuncionamentoDTO;
        return horarioDeFuncionamento;
    }

    async buscarQuadras(): Promise<Quadra[]> {
        const db = await this.dbPromise;
        const query = "SELECT * FROM quadras;";

        const quadras = await db.all(query) as Quadra[];

        if (quadras.length > 0) {
            return quadras;
        }
        throw new Error("Erro ao buscar quadra no banco de dados");
    }

    async buscarQuadraInfo(id: string): Promise<Quadra> {
        const db = await this.dbPromise;
        const query = "SELECT * FROM quadras WHERE id = ?";
        const values = [id];

        const quadraInfo = await db.get(query, values) as Quadra;
        if (!quadraInfo) throw new Error("Quadra não encontrada");
        return quadraInfo;
    }
}