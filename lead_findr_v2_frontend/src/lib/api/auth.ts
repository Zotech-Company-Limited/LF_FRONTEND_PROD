import axios from "../axios";
import { mutate } from "swr";
import type { AxiosError } from "axios";



interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

// 🔐 Register user
export async function register(payload: RegisterPayload) {
    const res = await axios.post("/auth/register", payload);
    return res.data;
}

// 🔐 Login user
type LoginResponse =
    | { access_token: string }
    | { errors: string[] | string };

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const res = await axios.post("/auth/login", payload);

        if (res.data.access_token) {
            localStorage.setItem("token", res.data.access_token);
            await mutate("user"); //  wait for session to be hydrated
            return { access_token: res.data.access_token };
        }

        if (res.data.errors) {
            return { errors: res.data.errors };
        }

        return { errors: "Login failed — unknown response format" };
    } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: string[] | string }>;
        if (error.response?.data?.errors) {
            return { errors: error.response.data.errors };
        }
        return { errors: "Network error or invalid credentials" };
    }
}


// 🔐 Logout user
export async function logoutUser() {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await axios.post("/logout", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.warn("⚠️ Logout request failed:", error);
    } finally {
        localStorage.removeItem("token");
        await mutate("user", null, false); // clear user from cache
        window.location.href = "/login";
    }
}

//  Token verification
export async function getCurrentUserId(): Promise<string | null> {
    try {
        const response = await axios.post("/auth/verify-token");
        if (response.data.success) {
            return response.data.user_id;
        }
        return null;
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        return null;
    }
}

// 👤 Admin activity feed
export interface ScanLogEntry {
    timestamp: string;
    city: string;
    user_email: string;
    status: string;
    error?: string | null;
}

export interface ActivityFeedResponse {
    scans: ScanLogEntry[];
}

export async function getActivityFeed(): Promise<ActivityFeedResponse> {
    const response = await axios.get("/user/admin/activity");
    return response.data;
}

// 🔑 Forgot/reset password
export async function forgotPassword(email: string) {
    const res = await axios.post("/auth/forgot-password", { email });
    return res.data;
}

interface ResetPasswordPayload {
    current_password: string;
    new_password: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
    const res = await axios.post("/auth/reset-password", payload);
    return res.data;
}
