import { open, Database } from "sqlite";
import { QuadraRepository } from "../repository/QuadraRepository";
import { SlotService } from "../services/SlotService";
import { FileService } from "../services/FileService";
import { Quadra } from "../models/QuadraModel";
import sqlite3 from 'sqlite3';

export class QuadraService {
    private quadraRepository: QuadraRepository;
    private slotService: SlotService;
    private fileService: FileService;
    private dbPromise: Promise<Database>;

    constructor(repository: QuadraRepository, slotService: SlotService, fileService: FileService) {
        this.quadraRepository = repository;
        this.slotService = slotService;
        this.fileService = fileService;
        this.dbPromise = open({ filename: "./database.sqlite", driver: sqlite3.Database }); // ✅ Initialize database connection
    }


    async cadastrarQuadra(dados: Quadra, files: { courtImage: Express.Multer.File[], courtDocument: Express.Multer.File[] }): Promise<Quadra> {
        const db = await this.dbPromise;
        try {
            await db.run("BEGIN TRANSACTION");
    
            const courtImageUrl = await this.fileService.uploadImage(files.courtImage[0]);
            const courtDocumentUrl = await this.fileService.uploadImage(files.courtDocument[0]);
    
            const novaQuadra = await this.quadraRepository.criarQuadra({ ...dados, courtImageUrl, courtDocumentUrl }, db);

            await this.slotService.cadastrarSlot({
                quadra_id: novaQuadra.id!,
                horario_inicio: novaQuadra.selectedTimeStart,
                horario_fim: novaQuadra.selectedTimeEnd,
                dias_funcionamento: novaQuadra.selectedDays,
                slot: novaQuadra.slot,
            }, db);
    
            await db.run("COMMIT");
            return novaQuadra;
    
        } catch (error) {
            await db.run("ROLLBACK");
            console.error("Erro ao cadastrar quadra:", error);
            throw new Error("Erro ao processar quadra e slots");
        }
    }

    async buscarQuadras(): Promise<Quadra[]> {
        try {
            return await this.quadraRepository.buscarQuadras();
        } catch (error) {
            console.error("Erro ao buscar quadras:", error);
            throw new Error("Não foi possível filtrar quadras");
        }
    }

    async buscarInfoQuadra(id: string): Promise<Quadra> {
        try {
            return await this.quadraRepository.buscarQuadraInfo(id);
        } catch (error) {
            console.error("Erro ao encontrar dados da quadra:", error);
            throw new Error("Não foi possível retornar os dados da quadra");
        }
    }
}