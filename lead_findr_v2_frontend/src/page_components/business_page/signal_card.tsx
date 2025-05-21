"use client";

import React, { useState } from "react";
import { Lightbulb, Info } from "lucide-react";

interface SignalCardProps {
    label: string;
    score: number;         // e.g. 10
    maxScore?: number;     // e.g. 25 — needed for percentage
    tip: string;
    summary: string;
}

export default function SignalCard({
    label,
    score,
    maxScore = 25, // default fallback if not provided
    tip,
    summary,
}: SignalCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const percent = Math.round((score / maxScore) * 100);

    const dotColor =
        percent < 40
            ? "bg-red-500"
            : percent < 80
                ? "bg-yellow-500"
                : "bg-green-500";

    return (
        <div className="relative rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between group">
            {/* Tier Dot */}
            <div className={`absolute top-4 left-[-6px] w-2 h-2 rounded-full ${dotColor}`} />

            {/* Header */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-1 text-sm font-semibold text-gray-800 max-w-[75%] break-words leading-snug">
                    <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span>{label}</span>
                </div>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded shrink-0">
                    {percent}%
                </span>
            </div>

            {/* Summary */}
            <p className="text-xs text-gray-600 mt-2">{summary}</p>

            {/* Tooltip */}
            <div
                className="relative mt-3 flex items-center gap-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Lightbulb className="w-4 h-4 text-blue-500 cursor-pointer" />

                {isHovered && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-white border border-gray-200 shadow-lg rounded text-xs text-gray-800 z-50">
                        {tip}
                        <div className="absolute top-full left-4 w-3 h-3 bg-white rotate-45 border-l border-b border-gray-200"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
