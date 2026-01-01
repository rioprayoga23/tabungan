export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: number;
                    username: string;
                    password: string;
                    name: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    username: string;
                    password: string;
                    name: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    username?: string;
                    password?: string;
                    name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            transactions: {
                Row: {
                    id: number;
                    user_id: number;
                    amount: number;
                    image_url: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    user_id: number;
                    amount: number;
                    image_url?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    user_id?: number;
                    amount?: number;
                    image_url?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            savings_plans: {
                Row: {
                    id: number;
                    target_amount: number;
                    target_date: string;
                    monthly_suggestion: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    target_amount: number;
                    target_date: string;
                    monthly_suggestion?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    target_amount?: number;
                    target_date?: string;
                    monthly_suggestion?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"];

export type User = Tables<"users">;
export type Transaction = Tables<"transactions">;
export type SavingsPlan = Tables<"savings_plans">;

export type TransactionWithUser = Transaction & {
    users: User | null;
};
