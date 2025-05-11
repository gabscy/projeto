import { Request, Response } from "express";
import { QuadraService } from "../services/QuadraService";
import { QuadraRepository } from "../repository/QuadraRepository";
import { FileService } from "../services/FileService";
import { SlotService } from "../services/SlotService";
import { SlotRepository } from "../repository/SlotRepository";

export class QuadraController {
    private service: QuadraService;

    constructor() {
        const quadraRepository = new QuadraRepository();
        const slotRepository = new SlotRepository();
        const slotService = new SlotService(slotRepository);
        const fileService = new FileService();
    
        this.service = new QuadraService(quadraRepository, slotService, fileService);
    }


    async cadastrarQuadra(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const formattedFiles = {
                courtImage: files["courtImage"] || [], 
                courtDocument: files["courtDocument"] || [], 
            };

            const novaQuadra = await this.service.cadastrarQuadra(req.body, formattedFiles);

            res.status(201).json(novaQuadra);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }


    async buscarQuadras(req: Request, res: Response): Promise<void> {
        try {
            const quadras = await this.service.buscarQuadras();
            res.status(200).json(quadras);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }

    async buscarInfoQuadra(req: Request, res: Response): Promise<void> {
        try {
            const quadraInfo = await this.service.buscarInfoQuadra(req.params.id);
            res.status(200).json(quadraInfo);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }
}