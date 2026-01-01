"use server";

import {
    getTransactions,
    createTransaction,
    getDashboardSummary,
    getAllTransactionsForExport,
    type CreateTransactionInput,
    type DashboardSummary,
} from "@/services/transaction";
import { uploadTransferProof } from "@/services/storage";
import type { ServiceResponse } from "@/services/base";
import type { Transaction, TransactionWithUser } from "@/types/database";

export async function fetchTransactions(
    limit?: number
): Promise<ServiceResponse<TransactionWithUser[]>> {
    return getTransactions(limit);
}

export async function fetchDashboardSummary(): Promise<
    ServiceResponse<DashboardSummary>
> {
    return getDashboardSummary();
}

export async function addTransaction(
    formData: FormData
): Promise<ServiceResponse<Transaction>> {
    const userId = Number(formData.get("userId"));
    const amount = Number(formData.get("amount"));
    const notes = formData.get("notes") as string | null;
    const image = formData.get("image") as File | null;

    // Validate input
    if (!userId || isNaN(userId)) {
        return { data: null, error: "User ID wajib diisi", success: false };
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        return { data: null, error: "Jumlah harus lebih dari 0", success: false };
    }

    let imageUrl: string | undefined;

    // Upload image if provided
    if (image && image.size > 0) {
        const uploadResult = await uploadTransferProof(image, userId);
        if (!uploadResult.success) {
            return {
                data: null,
                error: uploadResult.error || "Gagal upload gambar",
                success: false,
            };
        }
        imageUrl = uploadResult.data?.url;
    }

    // Create transaction
    const input: CreateTransactionInput = {
        userId,
        amount,
        notes: notes || undefined,
        imageUrl,
    };

    return createTransaction(input);
}

export async function fetchTransactionsForExport(): Promise<
    ServiceResponse<TransactionWithUser[]>
> {
    return getAllTransactionsForExport();
}
