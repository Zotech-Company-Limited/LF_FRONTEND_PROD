"use client";

import React from "react";
import { Trophy, RefreshCw, Clock, MapPin } from "lucide-react";

interface InsightCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color?: string;
}

function InsightCard({ icon, title, description, color = "bg-blue-50" }: InsightCardProps) {
    return (
        <div className={`p-4 rounded-lg shadow-sm border ${color} flex items-start gap-4`}>
            <div className="text-blue-600">{icon}</div>
            <div className="flex flex-col">
                <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
                <p className="text-xs text-gray-600 leading-snug mt-1">{description}</p>
            </div>
        </div>
    );
}

interface InsightHighlightStripProps {
    insights: {
        type: "most_scanned_city" | "streak" | "best_city" | "peak_time";
        city?: string;
        count?: number;
        dpi?: number;
        time?: string;
    }[];
}

export default function InsightHighlightStrip({ insights }: InsightHighlightStripProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {insights.map((insight, idx) => {
                switch (insight.type) {
                    case "most_scanned_city":
                        return (
                            <InsightCard
                                key={idx}
                                icon={<MapPin className="w-5 h-5" />}
                                title="Most Scanned City"
                                description={`${insight.city} (${insight.count} scans)`}
                                color="bg-yellow-50"
                            />
                        );
                    case "streak":
                        return (
                            <InsightCard
                                key={idx}
                                icon={<RefreshCw className="w-5 h-5" />}
                                title="Scan Streak"
                                description={`You've scanned for ${insight.count} weeks in a row!`}
                                color="bg-green-50"
                            />
                        );
                    case "best_city":
                        return (
                            <InsightCard
                                key={idx}
                                icon={<Trophy className="w-5 h-5" />}
                                title="Best Performing City"
                                description={`${insight.city} — Avg DPI: ${insight.dpi}%`}
                                color="bg-purple-50"
                            />
                        );
                    case "peak_time":
                        return (
                            <InsightCard
                                key={idx}
                                icon={<Clock className="w-5 h-5" />}
                                title="Peak Scan Time"
                                description={`You scan most at ${insight.time}`}
                                color="bg-blue-50"
                            />
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}
