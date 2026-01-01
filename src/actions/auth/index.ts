"use server";

import {
    loginUser,
    logoutUser,
    getUserById,
    getAllUsers,
    type LoginCredentials,
    type AuthUser,
} from "@/services/auth";
import type { ServiceResponse } from "@/services/base";

export async function login(
    credentials: LoginCredentials
): Promise<ServiceResponse<AuthUser>> {
    return loginUser(credentials);
}

export async function logout(): Promise<ServiceResponse<null>> {
    return logoutUser();
}

export async function getUser(id: number): Promise<ServiceResponse<AuthUser | null>> {
    return getUserById(id);
}

export async function getUsers(): Promise<ServiceResponse<AuthUser[]>> {
    return getAllUsers();
}
