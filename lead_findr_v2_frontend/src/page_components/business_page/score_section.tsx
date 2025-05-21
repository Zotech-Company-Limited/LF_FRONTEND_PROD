"use client";

import React from "react";
import SignalCard from "./signal_card";
import type { Breakdown } from "@/lib/api/businesses";

interface ScoreSectionProps {
    title: string;
    icon: string;
    breakdown?: Breakdown;
}

const fallbackMessages: Record<string, string> = {
    Website: "We couldn't detect a website for this business. Most likely, they don't have one — though it's possible their site is temporarily offline or using a setup our system can't access.",
    'Social Media': "We didn’t find any social profiles for this business. They may not be active on public platforms, or their accounts could be under nonstandard names or settings.",
    Backlinks: "We couldn’t detect any backlinks or external mentions for this business. This usually means low external visibility, but it could also reflect a very new or niche site.",
    Brand: "We didn’t find any brand visibility signals. That likely means low search volume or coverage — but it could also result from naming ambiguity or limited public exposure.",
};

export default function ScoreSection({ title, icon, breakdown }: ScoreSectionProps) {
    const fallbackMessage = fallbackMessages[title] || "No data available for this section.";

    if (!breakdown || Object.keys(breakdown).length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 shadow-sm">
                <p className="font-medium mb-1">No {title} data available</p>
                <p className="text-sm">{fallbackMessage}</p>
            </div>
        );
    }

    const validEntries = Object.entries(breakdown).filter(
        ([, item]) => item && item.label && typeof item.score === "number"
    );

    if (validEntries.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 shadow-sm">
                <p className="font-medium mb-1">No {title} data available</p>
                <p className="text-sm">{fallbackMessage}</p>
            </div>
        );
    }

    // 🔢 Calculate section-wide score percentage
    const totalEarned = validEntries.reduce((sum, [, item]) => sum + (item.score || 0), 0);
    const totalPossible = validEntries.reduce((sum, [, item]) => sum + (item.max_score || 25), 0);
    const sectionScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

    return (
        <section className="mt-2">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span>{icon}</span>
                    {title} Breakdown
                </h2>
                <span className="text-sm font-medium text-gray-600">
                    Total: {sectionScore}%
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {validEntries.map(([key, item]) => (
                    <SignalCard
                        key={key}
                        label={item.label}
                        score={item.score}
                        maxScore={item.max_score ?? 25}
                        summary={item.summary}
                        tip={item.tip}
                    />
                ))}
            </div>
        </section>
    );
}
