"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    LogOut,
    Settings,
    ArrowUpRight,
    LogIn,
} from "lucide-react";
import { logoutUser } from "@/lib/api/auth";
import { useUser } from "@/lib/api/swr";
import { cn } from "@/lib/utils";

export default function UserDropdown() {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        router.push("/login");
    };

    // 🔄 Show login if not logged in (after loading finishes)
    if (!isLoading && !user) {
        return (
            <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition"
            >
                <LogIn size={16} />
                <span>Login</span>
            </button>
        );
    }

    //  Show dropdown only if user exists
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition"
                aria-label="User Menu"
            >
                <User size={20} />
            </button>

            {open && (
                <div
                    className={cn(
                        "absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in",
                        "p-3"
                    )}
                >
                    {user && user.plan === "free" && (
                        <button
                            onClick={() => {
                                router.push("/pricing");
                                setOpen(false);
                            }}
                            className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-800 w-full font-medium px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition"
                        >
                            <span>Upgrade to Pro</span>
                            <ArrowUpRight size={16} />
                        </button>
                    )}

                    <button
                        onClick={() => {
                            router.push("/settings");
                            setOpen(false);
                        }}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black w-full mt-3 px-3 py-2 rounded-md transition hover:bg-gray-100"
                    >
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>

                    <div className="border-t my-3"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full px-3 py-2 rounded-md transition hover:bg-red-50"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
