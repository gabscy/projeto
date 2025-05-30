import { getSqlConnection } from "../dbconnection";
import { Quadra } from "../models/QuadraModel";
import { PegarHorarioFuncionamentoDTO } from "../dto/QuadraDTO";
import sql from "mssql";

export class QuadraRepository {
    constructor() {
        this.ensureTableExists();
    }

    private async ensureTableExists(): Promise<void> {
        try {
            const pool = await getSqlConnection();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='quadras' AND xtype='U')
                CREATE TABLE quadras (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(255) NOT NULL,
                    type NVARCHAR(255) NOT NULL,
                    address NVARCHAR(255) NOT NULL,
                    city NVARCHAR(255) NOT NULL,
                    state NVARCHAR(255) NOT NULL,
                    cep NVARCHAR(255) NOT NULL,
                    price FLOAT NOT NULL,
                    rules NVARCHAR(MAX) NOT NULL,
                    description NVARCHAR(MAX) NOT NULL,
                    time_start NVARCHAR(50) NOT NULL,
                    time_end NVARCHAR(50) NOT NULL,
                    slot NVARCHAR(50) NOT NULL,
                    image_url NVARCHAR(MAX) NOT NULL,
                    document_url NVARCHAR(MAX) NOT NULL
                )
            `);
        } catch (error: any) {
            console.error("Erro ao garantir a existência da tabela quadras:", error.message);
        }
    }

    async criarQuadra(
        data: Quadra,
        transaction: sql.Transaction
    ): Promise<Quadra> {
        try {
            const request = transaction.request();
            const result = await request
                .input('name', sql.NVarChar(255), data.courtName)
                .input('type', sql.NVarChar(255), data.courtType)
                .input('address', sql.NVarChar(255), data.courtAddress)
                .input('city', sql.NVarChar(255), data.courtCity)
                .input('state', sql.NVarChar(255), data.courtState)
                .input('cep', sql.NVarChar(255), data.courtCEP)
                .input('price', sql.Float, data.courtPrice)
                .input('rules', sql.NVarChar(sql.MAX), data.courtRules)
                .input('description', sql.NVarChar(sql.MAX), data.courtDescription)
                .input('time_start', sql.NVarChar(50), data.selectedTimeStart)
                .input('time_end', sql.NVarChar(50), data.selectedTimeEnd)
                .input('slot', sql.NVarChar(50), data.slot)
                .input('image_url', sql.NVarChar(sql.MAX), data.courtImageUrl)
                .input('document_url', sql.NVarChar(sql.MAX), data.courtDocumentUrl)
                .query(
                    `INSERT INTO quadras 
                    (name, type, address, city, state, cep, price, rules, description, time_start, time_end, slot, image_url, document_url)
                    OUTPUT INSERTED.id
                    VALUES (@name, @type, @address, @city, @state, @cep, @price, @rules, @description, @time_start, @time_end, @slot, @image_url, @document_url)`
                );
            const id = result.recordset[0].id;
            return { ...data, id };
        } catch (error) {
            throw new Error("Erro ao criar quadra");
        }
    }

    async pegarHorarioFuncionamento(quadraId: string): Promise<PegarHorarioFuncionamentoDTO> {
        const pool = await getSqlConnection();
        const result = await pool.request()
            .input('id', sql.Int, quadraId)
            .query("SELECT time_start, time_end, slot FROM quadras WHERE id = @id");
        if (!result.recordset[0]) throw new Error("Quadra não encontrada");
        return result.recordset[0] as PegarHorarioFuncionamentoDTO;
    }

    async buscarQuadras(): Promise<Quadra[]> {
        const pool = await getSqlConnection();
        const result = await pool.request().query("SELECT * FROM quadras;");
        const quadras = result.recordset as Quadra[];
        if (quadras.length > 0) {
            return quadras;
        }
        throw new Error("Erro ao buscar quadra no banco de dados");
    }

    async buscarQuadraInfo(id: string): Promise<Quadra> {
        const pool = await getSqlConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM quadras WHERE id = @id");
        const quadraInfo = result.recordset[0] as Quadra;
        if (!quadraInfo) throw new Error("Quadra não encontrada");
        return quadraInfo;
    }
}