import { supabaseAdmin } from "@/lib/supabase/server";
import { success, error, type ServiceResponse } from "@/services/base";
import type { Transaction, TransactionWithUser, User } from "@/types/database";

export interface CreateTransactionInput {
    userId: number;
    amount: number;
    imageUrl?: string;
    notes?: string;
}

export interface DashboardSummary {
    totalSavings: number;
    userSavings: { userId: number; name: string; total: number }[];
    recentTransactions: TransactionWithUser[];
}

export async function getTransactions(
    limit?: number
): Promise<ServiceResponse<TransactionWithUser[]>> {
    try {
        let query = supabaseAdmin
            .from("transactions")
            .select("*, users(*)")
            .order("created_at", { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error: dbError } = await query;

        if (dbError) {
            return error(`Gagal mengambil transaksi: ${dbError.message}`);
        }

        return success(data as unknown as TransactionWithUser[]);
    } catch {
        return error("Terjadi kesalahan saat mengambil transaksi");
    }
}

export async function getTransactionsByUser(
    userId: number
): Promise<ServiceResponse<Transaction[]>> {
    try {
        const { data, error: dbError } = await supabaseAdmin
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (dbError) {
            return error(`Gagal mengambil transaksi: ${dbError.message}`);
        }

        return success(data as Transaction[]);
    } catch {
        return error("Terjadi kesalahan saat mengambil transaksi");
    }
}

export async function getTransactionById(
    id: number
): Promise<ServiceResponse<TransactionWithUser>> {
    try {
        const { data, error: dbError } = await supabaseAdmin
            .from("transactions")
            .select("*, users(*)")
            .eq("id", id)
            .single();

        if (dbError) {
            return error(`Gagal mengambil transaksi: ${dbError.message}`);
        }

        return success(data as unknown as TransactionWithUser);
    } catch {
        return error("Terjadi kesalahan saat mengambil transaksi");
    }
}

export async function createTransaction(
    input: CreateTransactionInput
): Promise<ServiceResponse<Transaction>> {
    try {
        const { data, error: dbError } = await supabaseAdmin
            .from("transactions")
            .insert({
                user_id: input.userId,
                amount: input.amount,
                image_url: input.imageUrl || null,
                notes: input.notes || null,
            } as never)
            .select()
            .single();

        if (dbError) {
            return error(`Gagal membuat transaksi: ${dbError.message}`);
        }

        return success(data as Transaction);
    } catch {
        return error("Terjadi kesalahan saat membuat transaksi");
    }
}

export async function getDashboardSummary(): Promise<ServiceResponse<DashboardSummary>> {
    try {
        const { data: users, error: usersError } = await supabaseAdmin
            .from("users")
            .select("*");

        if (usersError) {
            return error(`Gagal mengambil data users: ${usersError.message}`);
        }

        const { data: transactions, error: txError } = await supabaseAdmin
            .from("transactions")
            .select("*, users(*)")
            .order("created_at", { ascending: false });

        if (txError) {
            return error(`Gagal mengambil transaksi: ${txError.message}`);
        }

        const txList = transactions as unknown as TransactionWithUser[];
        const userList = users as User[];

        const totalSavings = txList.reduce((sum, tx) => sum + tx.amount, 0);

        const userSavings = userList.map((user) => {
            const userTransactions = txList.filter((tx) => tx.user_id === user.id);
            const total = userTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            return { userId: user.id, name: user.name, total };
        });

        const recentTransactions = txList.slice(0, 10);

        return success({ totalSavings, userSavings, recentTransactions });
    } catch {
        return error("Terjadi kesalahan saat mengambil summary");
    }
}

export async function getAllTransactionsForExport(): Promise<ServiceResponse<TransactionWithUser[]>> {
    try {
        const { data, error: dbError } = await supabaseAdmin
            .from("transactions")
            .select("*, users(*)")
            .order("created_at", { ascending: false });

        if (dbError) {
            return error(`Gagal mengambil transaksi: ${dbError.message}`);
        }

        return success(data as unknown as TransactionWithUser[]);
    } catch {
        return error("Terjadi kesalahan saat mengambil transaksi untuk export");
    }
}
