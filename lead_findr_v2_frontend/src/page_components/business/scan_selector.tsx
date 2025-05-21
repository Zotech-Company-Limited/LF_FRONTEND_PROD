"use client";

import { useEffect, useRef, useState } from "react";
import { FlaskConical, Landmark, CheckCircle, XCircle } from "lucide-react";

interface Scan {
    scan_id: string;
    city: string;
    state?: string;
    business_count: number;
}

interface City {
    city: string;
    state?: string;
    country?: string;
    business_count: number;
}

interface Props {
    scans: Scan[];
    cities: City[];
    mode: "scan" | "city";
    selectedScanId?: string;
    selectedCity?: City;
    onModeChange: (mode: "scan" | "city") => void;
    onSelect: (selection: { type: "scan" | "city"; value: string }) => void;
}

export default function ScanCitySelector({
    scans,
    cities,
    mode,
    selectedScanId,
    selectedCity,
    onModeChange,
    onSelect,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [showOnlyWithBusinesses, setShowOnlyWithBusinesses] = useState(true);
    const perPage = 10;
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredScans = showOnlyWithBusinesses ? scans.filter(s => s.business_count > 0) : scans;
    const filteredCities = showOnlyWithBusinesses ? cities.filter(c => c.business_count > 0) : cities;

    const scanPages = Math.ceil(filteredScans.length / perPage);
    const cityPages = Math.ceil(filteredCities.length / perPage);

    const scanList = filteredScans.slice((page - 1) * perPage, page * perPage);
    const cityList = filteredCities.slice((page - 1) * perPage, page * perPage);

    const handleSelect = (value: string) => {
        onSelect({ type: mode, value });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel =
        mode === "scan"
            ? selectedScanId
                ? scans.find((s) => s.scan_id === selectedScanId)?.city + ", " +
                scans.find((s) => s.scan_id === selectedScanId)?.state
                : "All Scans"
            : selectedCity
                ? `${selectedCity.city}, ${selectedCity.state}`
                : "All Cities";

    return (
        <div className="relative inline-block w-64" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-left shadow-sm hover:border-blue-500"
            >
                {selectedLabel}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                    {/* Tab Switcher */}
                    <div className="flex border-b border-gray-200 text-sm">
                        <button
                            className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${mode === "scan" ? "bg-gray-100 font-semibold" : ""}`}
                            onClick={() => {
                                onModeChange("scan");
                                setPage(1);
                            }}
                        >
                            <FlaskConical className="w-4 h-4" />
                            Scans
                        </button>
                        <button
                            className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${mode === "city" ? "bg-gray-100 font-semibold" : ""}`}
                            onClick={() => {
                                onModeChange("city");
                                setPage(1);
                            }}
                        >
                            <Landmark className="w-4 h-4" />
                            Cities
                        </button>
                    </div>

                    {/* Filter Toggle */}
                    <li className="px-3 py-2 font-medium text-blue-600 flex items-center justify-between hover:bg-gray-100">
                        <span>
                            {mode === "scan"
                                ? `All Scans (${filteredScans.length})`
                                : `All Cities (${filteredCities.length})`}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowOnlyWithBusinesses((prev) => !prev);
                                setPage(1);
                            }}
                            title={
                                showOnlyWithBusinesses
                                    ? "Click to show all"
                                    : "Click to show only with businesses"
                            }
                            className={`text-sm ${showOnlyWithBusinesses ? "text-green-600" : "text-gray-500"}`}
                        >
                            {showOnlyWithBusinesses ? < CheckCircle className="w-5 h-5" /> : < XCircle className="w-5 h-5" />}
                        </button>
                    </li>

                    {/* List */}
                    <ul className="max-h-48 overflow-y-auto text-sm">
                        {(mode === "scan" ? scanList : cityList).map((item, idx) => {
                            const hasBusinesses = item.business_count > 0;
                            const isSelected =
                                mode === "scan"
                                    ? selectedScanId === (item as Scan).scan_id
                                    : selectedCity?.city === (item as City).city;

                            return (
                                <li
                                    key={idx}
                                    onClick={() =>
                                        handleSelect(
                                            mode === "scan"
                                                ? (item as Scan).scan_id
                                                : (item as City).city
                                        )
                                    }
                                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-blue-50 font-medium" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {hasBusinesses ? (
                                            <CheckCircle className="text-green-500 w-4 h-4" />
                                        ) : (
                                            <XCircle className="text-red-500 w-4 h-4" />
                                        )}
                                        <span>
                                            {item.city}, {item.state}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">{item.business_count}</span>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Pagination */}
                    {(mode === "scan" ? scanPages : cityPages) > 1 && (
                        <div className="flex justify-between items-center px-3 py-2 border-t border-gray-200 text-xs text-gray-600 bg-gray-50">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="disabled:opacity-40"
                            >
                                ⬅ Prev
                            </button>
                            <span>
                                Page {page} of {mode === "scan" ? scanPages : cityPages}
                            </span>
                            <button
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(mode === "scan" ? scanPages : cityPages, p + 1)
                                    )
                                }
                                disabled={page === (mode === "scan" ? scanPages : cityPages)}
                                className="disabled:opacity-40"
                            >
                                Next ➡
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
