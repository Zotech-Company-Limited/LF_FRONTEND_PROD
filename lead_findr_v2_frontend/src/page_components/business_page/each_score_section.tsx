"use client";

import React from "react";
import SignalCard from "./signal_card";
import type { Breakdown } from "@/lib/api/businesses";

interface WebsiteSectionProps {
    breakdown?: Breakdown;
}

export default function WebsiteSection({ breakdown }: WebsiteSectionProps) {
    if (!breakdown || Object.keys(breakdown).length === 0) {
        return (
            <div className="p-4 border border-red-200 bg-red-50 text-sm text-red-600 rounded">
                ⚠️ No website score data found or the site was unreachable.
            </div>
        );
    }

    return (
        <section className="mt-6">
            <h2 className="text-lg font-semibold mb-4">🌐 Website Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(breakdown).map(([key, item]) => (
                    <SignalCard
                        key={key}
                        label={item.label}
                        score={item.score}
                        summary={item.summary}
                        tip={item.tip}
                    />
                ))}
            </div>
        </section>
    );
}
