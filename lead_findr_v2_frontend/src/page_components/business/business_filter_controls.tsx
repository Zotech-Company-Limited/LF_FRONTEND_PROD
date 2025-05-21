"use client";

import { useBusinessFilters } from "@/context/business_filter_context";
import { Search, SlidersHorizontal, LayoutList, Map } from "lucide-react";

interface Props {
    onToggleFilters: () => void;
    showFilters: boolean;
}

export default function BusinessFilterControls({ onToggleFilters, showFilters }: Props) {
    const { filters, updateFilter } = useBusinessFilters();

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* 🔍 Search Input */}
            <div className="relative">
                <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search businesses..."
                    value={filters.search || ""}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-8 pr-3 py-2 w-64 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* ⛃ Filter Toggle Button */}
            <button
                onClick={onToggleFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md shadow-sm hover:ring-1 hover:ring-blue-500"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {showFilters ? "▲" : "▼"}
            </button>

            {/* 🗂 Sort Dropdown */}
            <select
                value={filters.sort_by || ""}
                onChange={(e) => updateFilter("sort_by", e.target.value)}
                className=" select-modern"
            >
                <option value="">Sort by</option>
                <option value="dpi_desc">DPI Score (High → Low)</option>
                <option value="dpi_asc">DPI Score (Low → High)</option>
                <option value="name_asc">Business Name (A → Z)</option>
                <option value="name_desc">Business Name (Z → A)</option>
                <option value="date_desc">Newest</option>
                <option value="date_asc">Oldest</option>
            </select>

            {/* 🧭 View Toggle */}
            <div className="flex items-center gap-1">
                <button
                    className={`p-2 rounded-full ${filters.view_mode === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
                    onClick={() => updateFilter("view_mode", "list")}
                    aria-pressed={filters.view_mode === "list"}
                    title="List view"
                >
                    <LayoutList size={16} />
                </button>
                <button
                    className={`p-2 rounded-full ${filters.view_mode === "map" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
                    onClick={() => updateFilter("view_mode", "map")}
                    aria-pressed={filters.view_mode === "map"}
                    title="Map view"
                >
                    <Map size={16} />
                </button>
            </div>
        </div>
    );
}
