import { getSqlConnection } from "../dbconnection";
import { Slot } from "../models/SlotModel";
import { BuscarDisponibilidadeDTO } from "../dto/QuadraDTO";
import sql from "mssql";

export class SlotRepository {
    constructor() {
        this.ensureTableExists();
    }

    private async ensureTableExists(): Promise<void> {
        try {
            const pool = await getSqlConnection();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='slots' AND xtype='U')
                CREATE TABLE slots (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    quadra_id INT NOT NULL,
                    date DATE NOT NULL,
                    horario_inicio INT NOT NULL,
                    horario_fim INT NOT NULL,
                    available BIT NOT NULL DEFAULT 0,
                    FOREIGN KEY (quadra_id) REFERENCES quadras(id)
                )
            `);
        } catch (error: any) {
            console.error("Erro ao garantir a existência da tabela slots:", error.message);
        }
    }

    async criar(slotsDTOs: Slot[], transaction: sql.Transaction): Promise<void> {
        if (slotsDTOs.length === 0) {
            throw new Error("Nenhum slot para inserir.");
        }
        const table = new sql.Table('slots');
        table.create = false;
        table.columns.add('quadra_id', sql.Int, { nullable: false });
        table.columns.add('date', sql.Date, { nullable: false });
        table.columns.add('horario_inicio', sql.Int, { nullable: false });
        table.columns.add('horario_fim', sql.Int, { nullable: false });

        for (const slot of slotsDTOs) {
            table.rows.add(
                slot.quadra_id,
                slot.date instanceof Date ? slot.date : new Date(slot.date),
                slot.horario_inicio,
                slot.horario_fim
            );
        }

        try {
            const request = transaction.request();
            await request.bulk(table);
        } catch (error: any) {
            throw new Error("Erro ao inserir slots de disponibilidade: " + error.message);
        }
    }

    async buscarPorQuadraId(quadraId: number): Promise<Slot | undefined> {
        const pool = await getSqlConnection();
        const result = await pool.request()
            .input('quadra_id', sql.Int, quadraId)
            .query("SELECT * FROM slots WHERE quadra_id = @quadra_id");
        return result.recordset[0];
    }

    async buscarSlotsDisponiveis(data: BuscarDisponibilidadeDTO): Promise<Slot[]> {
        const pool = await getSqlConnection();
        const result = await pool.request()
            .input('date', sql.Date, data.date)
            .input('quadra_id', sql.Int, data.quadraId)
            .query("SELECT * FROM slots WHERE date = @date AND quadra_id = @quadra_id");
        return result.recordset as Slot[];
    }

    // Now supports transaction for atomic updates if needed
    async alterarDisponibilidade(slotId: string, transaction?: sql.Transaction): Promise<boolean> {
        try {
            let request;
            if (transaction) {
                request = transaction.request();
            } else {
                const pool = await getSqlConnection();
                request = pool.request();
            }
            await request
                .input('id', sql.Int, Number(slotId))
                .query("UPDATE slots SET available = 1 WHERE id = @id");
            return true;
        } catch (error: any) {
            return false;
        }
    }
}