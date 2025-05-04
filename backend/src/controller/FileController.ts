import { File, FileModel } from "../models/FileModel";

export class FileController {
    private fileModel: FileModel;

    constructor() {
        this.fileModel = new FileModel();
    }

    async uploadImage(file: File): Promise<string> {
        try {
            const imageUrl = await this.fileModel.uploadImage(file)
            return imageUrl
        } catch (error: any) {
            console.error("Erro ao salvar arquivo", error)
            throw new Error("Erro ao salvar arquivo")
        }
    }
}