import type { UserData } from "@/lib/api/user_client";
import { getUserDataSafe } from "@/lib/api/user_client";

let currentUser: UserData | null = null;

export const getUserSession = async (): Promise<UserData | null> => {
    if (currentUser) return currentUser;

    try {
        const data = await getUserDataSafe();
        currentUser = data;
        return data;
    } catch (e) {
        console.error("❌ Failed to initialize user session:", e);
        return null;
    }
};

export const clearUserSession = () => {
    currentUser = null;
};
