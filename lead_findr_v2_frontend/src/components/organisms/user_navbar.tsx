"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    ScanLine,
    Menu,
    CreditCard,
    LogIn
} from "lucide-react";
import Sidebar from "../organisms/user_sidebar";
import UserDropdown from "../molecules/user_nav_dropdown";
import { useUser } from "@/lib/api/swr";
import "../../styles/user_nav.css";

interface UserNavbarProps {
    children?: React.ReactNode;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    const handleCloseSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Top Navbar */}
            <nav className="user-navbar fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 z-50">
                {/* Left Side: Sidebar Toggle + Home */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-700 hover:text-black transition-colors duration-200 ease-in-out focus:outline-none"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={22} />
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors duration-200 ease-in-out flex items-center gap-1 ml-2"
                    >
                        <Home size={20} /> Home
                    </button>
                </div>

                {/* Right Side: Pricing + Run Scan + User Dropdown */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/pricing")}
                        className="flex items-center gap-1.5 text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md transition-all duration-200 ease-in-out"
                        aria-label="View Pricing Plans"
                    >
                        <CreditCard size={16} />
                        <span>Pricing</span>
                    </button>

                    <button
                        onClick={() => router.push("/scan")}
                        className="flex items-center gap-1.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-all duration-200 ease-in-out"
                        aria-label="Run New Scan"
                    >
                        <ScanLine size={16} />
                        <span>Run Scan</span>
                    </button>

                    {/* Show Login or UserDropdown based on auth state */}
                    {user ? (
                        <UserDropdown />
                    ) : (
                        <button
                            onClick={() => router.push("/login")}
                            className="group relative text-gray-600 hover:text-blue-600 transition"
                            aria-label="Log in"
                        >
                            <LogIn size={24} />
                            <span className="absolute w-14 top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block text-xs text-white bg-black px-2 py-1 rounded z-50">
                                Log in
                            </span>
                        </button>

                    )}
                </div>
            </nav>

            {/* Main Layout Body */}
            <div className=''>
                {/* Always mounted, toggled by animation */}
                <Sidebar toggleSidebar={sidebarOpen} onClose={handleCloseSidebar} />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};

export default UserNavbar;