"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    ScanLine,
    CreditCard,
    LogIn,
} from "lucide-react";
import "../../styles/user_nav.css";

const PublicNavbar: React.FC = () => {
    const router = useRouter();

    return (
        <nav className="user-navbar fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 z-50">
            {/* Left: Home */}
            <div className="flex items-center">
                <button
                    onClick={() => router.push("/")}
                    className="text-gray-600 hover:text-blue-700 transition flex items-center gap-1 text-sm font-medium"
                >
                    <Home size={22} /> Home
                </button>
            </div>

            {/* Right: Pricing + Run Scan + Login */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push("/pricing")}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-sm px-3 py-1.5 rounded-md transition"
                >
                    <CreditCard size={16} />
                    <span>Pricing</span>
                </button>

                <button
                    onClick={() => router.push("/scan")}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-3 py-1.5 rounded-md transition"
                >
                    <ScanLine size={16} />
                    <span>Run Scan</span>
                </button>

                <button
                    onClick={() => router.push("/login")}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-black font-medium text-sm px-3 py-1.5 rounded-md transition"
                >
                    <LogIn size={16} />
                    <span>Login</span>
                </button>
            </div>
        </nav>
    );
};

export default PublicNavbar;
