"use client";

import React from "react";
import { CitySummary } from "@/lib/api/businesses";
import { Landmark } from "lucide-react";

interface CityListProps {
    cities: CitySummary[];
    onCitySelect: (city: CitySummary) => void;
    selectedCity?: CitySummary | null;
}

export default function CityList({
    cities,
    onCitySelect,
    selectedCity,
}: CityListProps) {
    if (!cities.length) {
        return <p className="sidebar-empty">No scanned cities found.</p>;
    }

    const isSelected = (c: CitySummary) =>
        selectedCity?.city === c.city &&
        selectedCity?.state === c.state &&
        selectedCity?.country === c.country;


    return (
        <div className="sidebar-scroll">
            {cities.map((city) => (
                <button
                    key={`${city.city}-${city.state}-${city.country}`}
                    onClick={() => onCitySelect(city)}
                    className={`sidebar-item ${isSelected(city) ? "active" : ""} min-h-[72px] px-4 py-3 text-left flex flex-col justify-between gap-1`}
                >
                    <div className="flex items-center gap-2">
                        <Landmark size={16} className="text-blue-600 min-w-[20px]" />
                        <span className="truncate font-medium text-sm text-gray-800">
                            {city.city}, {city.state}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 w-full">
                        <span>{city.business_count} businesses</span>
                        <span>{new Date(city.last_scanned).toLocaleDateString()}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}