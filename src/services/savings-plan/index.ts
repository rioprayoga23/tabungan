import { supabaseAdmin } from "@/lib/supabase/server";
import { success, error, type ServiceResponse } from "@/services/base";
import type { SavingsPlan, Transaction } from "@/types/database";

export interface CreateSavingsPlanInput {
    targetAmount: number;
    targetDate: string;
}

export interface SavingsPlanWithSuggestion {
    id: number;
    target_amount: number;
    target_date: string;
    monthly_suggestion: number;
    created_at: string;
    updated_at: string;
    currentSavings: number;
    remainingAmount: number;
    remainingMonths: number;
    monthlySuggestion: number;
    progressPercentage: number;
}

function calculateMonthlySuggestion(
    targetAmount: number,
    currentSavings: number,
    targetDate: string
): { monthlySuggestion: number; remainingMonths: number } {
    const now = new Date();
    const target = new Date(targetDate);
    const yearDiff = target.getFullYear() - now.getFullYear();
    const monthDiff = target.getMonth() - now.getMonth();
    const remainingMonths = Math.max(1, yearDiff * 12 + monthDiff);
    const remainingAmount = Math.max(0, targetAmount - currentSavings);
    const monthlySuggestion = Math.ceil(remainingAmount / remainingMonths);
    return { monthlySuggestion, remainingMonths };
}

export async function getCurrentSavingsPlan(): Promise<ServiceResponse<SavingsPlanWithSuggestion | null>> {
    try {
        const { data: plan, error: planError } = await supabaseAdmin
            .from("savings_plans")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (planError) {
            if (planError.code === "PGRST116") {
                return success(null);
            }
            return error(`Gagal mengambil rencana tabungan: ${planError.message}`);
        }

        const { data: transactions, error: txError } = await supabaseAdmin
            .from("transactions")
            .select("amount");

        if (txError) {
            return error(`Gagal mengambil total tabungan: ${txError.message}`);
        }

        const txList = transactions as Transaction[];
        const planData = plan as SavingsPlan;

        const currentSavings = txList.reduce((sum, tx) => sum + tx.amount, 0);
        const remainingAmount = Math.max(0, planData.target_amount - currentSavings);
        const progressPercentage = Math.min(100, Math.round((currentSavings / planData.target_amount) * 100));

        const { monthlySuggestion, remainingMonths } = calculateMonthlySuggestion(
            planData.target_amount,
            currentSavings,
            planData.target_date
        );

        return success({
            ...planData,
            currentSavings,
            remainingAmount,
            remainingMonths,
            monthlySuggestion,
            progressPercentage,
        });
    } catch {
        return error("Terjadi kesalahan saat mengambil rencana tabungan");
    }
}

export async function upsertSavingsPlan(
    input: CreateSavingsPlanInput
): Promise<ServiceResponse<SavingsPlan>> {
    try {
        const { data: transactions, error: txError } = await supabaseAdmin
            .from("transactions")
            .select("amount");

        if (txError) {
            return error(`Gagal mengambil total tabungan: ${txError.message}`);
        }

        const txList = transactions as Transaction[];
        const currentSavings = txList.reduce((sum, tx) => sum + tx.amount, 0);
        const { monthlySuggestion } = calculateMonthlySuggestion(
            input.targetAmount,
            currentSavings,
            input.targetDate
        );

        const { data: existingPlan } = await supabaseAdmin
            .from("savings_plans")
            .select("id")
            .limit(1)
            .single();

        if (existingPlan) {
            const existing = existingPlan as SavingsPlan;
            const { data, error: updateError } = await supabaseAdmin
                .from("savings_plans")
                .update({
                    target_amount: input.targetAmount,
                    target_date: input.targetDate,
                    monthly_suggestion: monthlySuggestion,
                    updated_at: new Date().toISOString(),
                } as never)
                .eq("id", existing.id)
                .select()
                .single();

            if (updateError) {
                return error(`Gagal update rencana: ${updateError.message}`);
            }

            return success(data as SavingsPlan);
        } else {
            const { data, error: insertError } = await supabaseAdmin
                .from("savings_plans")
                .insert({
                    target_amount: input.targetAmount,
                    target_date: input.targetDate,
                    monthly_suggestion: monthlySuggestion,
                } as never)
                .select()
                .single();

            if (insertError) {
                return error(`Gagal membuat rencana: ${insertError.message}`);
            }

            return success(data as SavingsPlan);
        }
    } catch {
        return error("Terjadi kesalahan saat menyimpan rencana tabungan");
    }
}
