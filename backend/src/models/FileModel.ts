import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export interface File extends Express.Multer.File {}

export class FileModel {
    private supabaseInstance;

    constructor() {
        this.supabaseInstance = createClient('https://pfzqpczpptkxgbrqjkkz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmenFwY3pwcHRreGdicnFqa2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDQ3ODksImV4cCI6MjA2MTYyMDc4OX0.hy4n4-WizAZkfbB6w1gckDf97s5_Y1QGUhBOpCgBVsI')
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