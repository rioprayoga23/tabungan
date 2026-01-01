import { supabaseAdmin } from "@/lib/supabase/server";
import { success, error, type ServiceResponse } from "@/services/base";
import type { User } from "@/types/database";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthUser {
    id: number;
    username: string;
    name: string;
}

export async function loginUser(
    credentials: LoginCredentials
): Promise<ServiceResponse<AuthUser>> {
    try {
        const { username, password } = credentials;

        const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("username", username)
            .eq("password", password)
            .single();

        if (userError || !userData) {
            return error("Username atau password salah");
        }

        return success({
            id: (userData as User).id,
            username: (userData as User).username,
            name: (userData as User).name,
        });
    } catch {
        return error("Terjadi kesalahan saat login");
    }
}

export async function logoutUser(): Promise<ServiceResponse<null>> {
    return success(null);
}

export async function getUserById(
    id: number
): Promise<ServiceResponse<AuthUser | null>> {
    try {
        const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (userError || !userData) {
            return success(null);
        }

        return success({
            id: (userData as User).id,
            username: (userData as User).username,
            name: (userData as User).name,
        });
    } catch {
        return error("Terjadi kesalahan saat mengambil data user");
    }
}

export async function getAllUsers(): Promise<ServiceResponse<AuthUser[]>> {
    try {
        const { data: users, error: usersError } = await supabaseAdmin
            .from("users")
            .select("id, username, name")
            .order("name", { ascending: true });

        if (usersError) {
            return error(`Gagal mengambil users: ${usersError.message}`);
        }

        return success(users as AuthUser[]);
    } catch {
        return error("Terjadi kesalahan saat mengambil data users");
    }
}
