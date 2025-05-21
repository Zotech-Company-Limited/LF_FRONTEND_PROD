// lib/api/user_client.ts

import axios from "../axios";
import { isAxiosError } from "axios";
import { mutate } from "swr";

export interface UserData {
    id: number;
    username: string | null;
    full_name: string | null;
    email: string;
    phone: string | null;
    google_api_key: string | null;
    gemini_api_key: string | null;
    google_search_api_key: string | null;
    google_search_cx: string | null;
    plan: string;
    plan_status: string;
    plan_renewal: string | null;
    scan_usage: number;
    scan_limit: number;
    role: string;
    is_verified: boolean;
    verification_token: string | null;
    created_at: string;
}

// 1. Get current user data (safe)
export async function getUserDataSafe(): Promise<UserData | null> {
    try {
        const response = await axios.get<UserData>("/user/settings");
        return response.data;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.warn("⚠️ No logged-in user detected.");
            } else {
                console.error("❌ Axios error in getUserDataSafe:", error.message);
            }
        } else {
            console.error("❌ Non-Axios error in getUserDataSafe:", error);
        }
        return null;
    }
}

// 2. Update user profile & API keys
export async function updateUserAccount(payload: Partial<Omit<UserData, "id" | "created_at" | "plan" | "plan_status" | "scan_limit" | "scan_usage" | "role" | "is_verified" | "verification_token">>) {
    const res = await axios.patch("/user/account", payload);
    await mutate("user");
    return res.data;
}

// 3. Delete account and reassign data
export async function deleteUserAccount(): Promise<{ message: string }> {
    const res = await axios.delete("/user/delete-account");
    localStorage.removeItem("token");
    await mutate("user", null, false);
    return res.data;
}

// 4. Get analytics and dashboard data
export async function getUserScanAnalytics() {
    const res = await axios.get("/user/scan-analytics");
    return res.data;
}

export async function getUserScanScatter() {
    const res = await axios.get("/user/dashboard/scatter");
    return res.data;
}

export async function getUserDashboardInsights() {
    const res = await axios.get("/user/dashboard/insights");
    return res.data;
}

// 5. Get user_id (from localStorage)
export function getCurrentUserId(): number | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user_id");
    return raw ? parseInt(raw, 10) : null;
}

export async function getUserSettings() {
    const res = await axios.get("/user/settings");
    return res.data;
}