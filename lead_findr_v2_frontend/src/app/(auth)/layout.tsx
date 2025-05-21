"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/api/swr";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/");
        }
    }, [user, isLoading, router]);

    // 🛑 Avoid rendering children while loading — helps on production
    if (isLoading || user) return null;

    return <>{children}</>;
}
