import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export interface File extends Express.Multer.File {}

export class FileService {
    private supabaseInstance;

    constructor() {
        this.supabaseInstance = createClient(
            process.env.SUPABASE_URL as string, 
            process.env.SUPABASE_KEY as string
        );
    }

    async uploadImage(file: File): Promise<string> {
        try {
            const fileName = `${randomUUID()}${file.originalname.slice(-4)}`;
            const { data: uploadData, error: uploadError } = await this.supabaseInstance.storage
                .from("images")
                .upload(fileName, file.buffer, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (uploadError) throw new Error(`Erro ao fazer upload: ${uploadError.message}`);

            const { data: urlData } = await this.supabaseInstance
                .storage
                .from("images")
                .getPublicUrl(uploadData?.path!);

            return urlData.publicUrl;
        } catch (error) {
            console.error("Erro ao processar upload de imagem:", error);
            throw new Error("Erro ao fazer upload do arquivo.");
        }
    }
}