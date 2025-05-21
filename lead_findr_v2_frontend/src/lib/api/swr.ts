import useSWR from "swr";
import axios from "@/lib/axios";
import type { UserData } from "@/lib/api/user_client";
import type { AxiosError } from "axios";

export async function authGet<T = unknown>(endpoint: string): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await axios.get<T>(endpoint);
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: string[] | string }>;

        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Unauthorized");
        }

        if (error.response?.data?.errors) {
            throw new Error(
                Array.isArray(error.response.data.errors)
                    ? error.response.data.errors.join(", ")
                    : error.response.data.errors
            );
        }

        throw new Error("Network error or unexpected failure");
    }
}


export function useUser() {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR<UserData | null>("user", () => authGet<UserData | null>("/user/settings"));

    return {
        user: data,
        isLoading,
        isError: !!error,
        error,
        refreshUser: mutate,
    };
}
