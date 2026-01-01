import { supabaseAdmin } from "@/lib/supabase/server";
import { success, error, type ServiceResponse } from "@/services/base";

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "bukti-transfer";

export interface UploadResult {
    url: string;
    path: string;
}

export async function uploadTransferProof(
    file: File,
    userId: number
): Promise<ServiceResponse<UploadResult>> {
    try {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return error("Hanya file gambar (JPG, PNG, WebP) yang diizinkan");
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return error("Ukuran file maksimal 5MB");
        }

        const timestamp = Date.now();
        const extension = file.name.split(".").pop();
        const fileName = `${userId}/${timestamp}.${extension}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { data, error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, { contentType: file.type, upsert: false });

        if (uploadError) {
            return error(`Gagal upload gambar: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return success({ url: publicUrl, path: data.path });
    } catch {
        return error("Terjadi kesalahan saat upload gambar");
    }
}

export async function deleteTransferProof(path: string): Promise<ServiceResponse<null>> {
    try {
        const { error: deleteError } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .remove([path]);

        if (deleteError) {
            return error(`Gagal menghapus gambar: ${deleteError.message}`);
        }

        return success(null);
    } catch {
        return error("Terjadi kesalahan saat menghapus gambar");
    }
}
