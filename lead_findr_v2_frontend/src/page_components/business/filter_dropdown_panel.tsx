// components/molecules/filter_dropdown_panel.tsx
"use client";

import { useBusinessFilters } from "@/context/business_filter_context";
import { useState } from "react";

export default function FilterDropdownPanel() {
    const { filters, updateFilter, resetFilters } = useBusinessFilters();
    const [dpiMode, setDpiMode] = useState<"min" | "max">("min");

    const handleDpiChange = (value: number) => {
        if (dpiMode === "min") {
            updateFilter("min_dpi", value);
        } else {
            updateFilter("max_dpi", value);
        }
    };

    const handleBadgeToggle = (badge: string) => {
        const current = filters.badges || [];
        if (current.includes(badge)) {
            updateFilter("badges", current.filter((b) => b !== badge));
        } else {
            updateFilter("badges", [...current, badge]);
        }
    };

    const badgeOptions = [
        "🔥 Web Leader",
        "💪 Established",
        "😐 Average",
        "👀 Basic",
        "🦕 Invisible",
    ];

    return (
        <div className="absolute z-40 mt-2 w-full max-w-5xl bg-white rounded-xl shadow-lg p-4 transition-transform scale-95">
            <div className="flex flex-wrap gap-6 items-start">
                {/* DPI Range Slider */}
                <div className="flex items-center gap-3">
                    <select
                        value={dpiMode}
                        onChange={(e) => setDpiMode(e.target.value as "min" | "max")}
                        className="border rounded-md text-sm px-2 py-1"
                    >
                        <option value="min">Min DPI</option>
                        <option value="max">Max DPI</option>
                    </select>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={dpiMode === "min" ? filters.min_dpi || 0 : filters.max_dpi || 100}
                        onChange={(e) => handleDpiChange(Number(e.target.value))}
                        className="w-28"
                    />
                    <span className="text-sm text-gray-700">
                        {dpiMode === "min" ? filters.min_dpi || 0 : filters.max_dpi || 100}
                    </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    {badgeOptions.map((badge) => (
                        <button
                            key={badge}
                            onClick={() => handleBadgeToggle(badge)}
                            className={`text-sm px-2 py-1 rounded-full border ${filters.badges?.includes(badge)
                                ? "bg-blue-100 border-blue-500 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700"
                                }`}
                        >
                            {badge}
                        </button>
                    ))}
                </div>

                {/* Website Toggle */}
                <div className="flex items-center gap-2 text-sm">
                    <span>Website:</span>
                    {[true, false, undefined].map((val, idx) => (
                        <button
                            key={idx}
                            className={`px-2 py-1 rounded-md border text-xs ${filters.has_website === val
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                            onClick={() => updateFilter("has_website", val)}
                        >
                            {val === true ? "Has" : val === false ? "None" : "All"}
                        </button>
                    ))}
                </div>

                {/* HTTPS Toggle */}
                <div className="flex items-center gap-2 text-sm">
                    <span>HTTPS:</span>
                    {[true, false, undefined].map((val, idx) => (
                        <button
                            key={idx}
                            className={`px-2 py-1 rounded-md border text-xs ${filters.is_secure === val
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                            onClick={() => updateFilter("is_secure", val)}
                        >
                            {val === true ? "Secure" : val === false ? "Not Secure" : "All"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 text-right">
                <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
}