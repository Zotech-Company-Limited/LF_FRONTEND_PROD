"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/api/swr";
import {
    ScanLine,
    User,
    Briefcase,
    ShieldCheck,
    X,
    LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
    toggleSidebar: boolean;
    onClose: () => void;
}

export default function Sidebar({ toggleSidebar, onClose }: SidebarProps) {
    const { user } = useUser(); // no early return needed now
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            className={`
        fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 z-60 bg-white shadow-xl 
        transition-transform duration-300 ease-in-out
        ${toggleSidebar ? "translate-x-0" : "-translate-x-full"}
      `}
            ref={ref}
        >
            <div className="relative p-6 h-full flex flex-col text-sm text-gray-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                >
                    <X size={18} />
                </button>

                <div className="text-xs uppercase font-semibold text-gray-500 tracking-wide mb-4 mt-2">
                    Navigation
                </div>

                <nav className="space-y-1">
                    <Link
                        href="/user-dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                        href="/scan"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <ScanLine size={16} /> Run Scan
                    </Link>
                    <Link
                        href="/businesses"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <Briefcase size={16} /> View Businesses
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <User size={16} /> Settings
                    </Link>
                </nav>

                {user?.role === "superadmin" && (
                    <>
                        <div className="mt-6 mb-2 text-xs uppercase font-semibold text-gray-500 tracking-wide">
                            Admin
                        </div>
                        <nav className="space-y-1">
                            <Link
                                href="/admin-dashboard"
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <ShieldCheck size={16} /> Admin Dashboard
                            </Link>
                        </nav>
                    </>
                )}
            </div>
        </div>
    );
}
