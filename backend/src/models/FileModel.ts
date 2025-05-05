import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export interface File extends Express.Multer.File {}

export class FileModel {
    private supabaseInstance;

    constructor() {
        this.supabaseInstance = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)
    }

    async uploadImage(file: File): Promise<string> {
        const { data: uploadData, error: uploadError } = await this.supabaseInstance.storage
            .from('images')
            .upload(`${randomUUID()}${file.originalname.slice(-4)}`, file.buffer, {
              cacheControl: '3600',
              upsert: false
            })

        const { data: urlData } = await this.supabaseInstance
            .storage
            .from('images')
            .getPublicUrl(`${uploadData?.path}`)

        return urlData.publicUrl
    }
}