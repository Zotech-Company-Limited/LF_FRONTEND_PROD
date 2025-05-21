"use client";

import React from "react";
import { Ghost, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-6">
            <Ghost size={64} className="text-blue-500 mb-4 animate-pulse" />

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                404 — Page Not Found
            </h1>

            <p className="text-gray-600 text-base mb-6 max-w-md">
                This page is more lost than your last cold lead. Let’s get you back to where the action is.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
            >
                <ArrowLeft size={18} />
                Go to Homepage
            </Link>

            <div className="text-xs text-gray-400 mt-10">
                © {new Date().getFullYear()} Lead Findr by Zotech Designs.
            </div>
        </div>
    );
};

export default NotFoundPage;
