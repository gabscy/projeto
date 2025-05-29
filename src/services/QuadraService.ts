import { QuadraRepository } from "../repository/QuadraRepository";
import { SlotService } from "./SlotService";
import { FileService } from "./FileService";
import { Quadra } from "../models/QuadraModel";
import { getSqlConnection } from "../dbconnection";
import sql from "mssql";

export class QuadraService {
    private quadraRepository: QuadraRepository;
    private slotService: SlotService;
    private fileService: FileService;

    constructor(repository: QuadraRepository, slotService: SlotService, fileService: FileService) {
        this.quadraRepository = repository;
        this.slotService = slotService;
        this.fileService = fileService;
    }

    async cadastrarQuadra(
        dados: Quadra,
        files: { courtImage: Express.Multer.File[], courtDocument: Express.Multer.File[] }
    ): Promise<Quadra> {
        const pool = await getSqlConnection();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const courtImageUrl = await this.fileService.uploadImage(files.courtImage[0]);
            const courtDocumentUrl = await this.fileService.uploadImage(files.courtDocument[0]);

            // Pass the transaction to the repository
            const novaQuadra = await this.quadraRepository.criarQuadra(
                { ...dados, courtImageUrl, courtDocumentUrl },
                transaction
            );

            await this.slotService.cadastrarSlot({
                quadra_id: novaQuadra.id!,
                horario_inicio: novaQuadra.selectedTimeStart,
                horario_fim: novaQuadra.selectedTimeEnd,
                dias_funcionamento: novaQuadra.selectedDays,
                slot: novaQuadra.slot,
            }, transaction);

            await transaction.commit();
            return novaQuadra;
        } catch (error) {
            await transaction.rollback();
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