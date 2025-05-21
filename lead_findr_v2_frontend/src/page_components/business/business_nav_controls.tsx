"use client";

import { useEffect, useState } from "react";
import { useBusinessFilters } from "@/context/business_filter_context";
import ScanCitySelector from "./scan_selector";
import FilterDropdownPanel from "./filter_dropdown_panel";
import { getMyScans } from "@/lib/api/scans";
import { getMyCities } from "@/lib/api/businesses";
import BusinessFilterControls from "./business_filter_controls";
import ExportDropdown from "./export_dropdown";

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

export default function BusinessNavbarControls() {
    const { filters, updateFilter } = useBusinessFilters();
    const [showFilters, setShowFilters] = useState(false);
    const [availableScans, setAvailableScans] = useState<Scan[]>([]);
    const [availableCities, setAvailableCities] = useState<City[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const scans = await getMyScans();
            const cities = await getMyCities();
            setAvailableScans(scans || []);
            setAvailableCities(cities || []);
        };
        fetch();
    }, []);

    return (
        <div className="w-full px-6 py-4 bg-white shadow-sm sticky top-16 z-30 border-b space-y-2">
            <div className="flex flex-wrap items-center gap-3 relative">
                <BusinessFilterControls
                    onToggleFilters={() => setShowFilters((prev) => !prev)}
                    showFilters={showFilters}
                />

                <ScanCitySelector
                    scans={availableScans}
                    cities={availableCities}
                    mode={filters.selection_type || "scan"}
                    selectedScanId={filters.scan_id}
                    selectedCity={
                        filters.city_selection
                            ? availableCities.find(
                                (c) =>
                                    c.city === filters.city_selection?.city &&
                                    c.state === filters.city_selection?.state &&
                                    c.country === filters.city_selection?.country
                            )
                            : undefined
                    }
                    onModeChange={(mode) => updateFilter("selection_type", mode)}
                    onSelect={({ type, value }) => {
                        if (type === "scan") {
                            updateFilter("scan_id", value);
                            updateFilter("city_selection", undefined);
                        } else {
                            const selected = availableCities.find((c) => c.city === value);
                            if (selected) {
                                updateFilter("city_selection", selected);
                            } else {
                                updateFilter("city_selection", undefined);
                            }
                            updateFilter("scan_id", undefined);
                        }
                    }}
                />

                {/* ⬇ Modular Export Component */}
                <ExportDropdown />
            </div>

            {showFilters && <FilterDropdownPanel />}
        </div>
    );
}
