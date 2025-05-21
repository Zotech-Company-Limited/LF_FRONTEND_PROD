"use client";

import { useEffect, useState } from "react";
import GoogleAutoComp from "./google_auto_complete";
import { useUser } from "@/lib/api/swr";

interface Location {
    city: string;
    state: string;
    country: string;
    lat?: number | null;
    lng?: number | null;
}

interface Props {
    onSelect: (location: Location) => void;
    error?: string;
}

export default function LocationInputSwitcher({ onSelect, error }: Props) {
    const { user, isLoading } = useUser();
    const [manualLocation, setManualLocation] = useState<Location>({
        city: "",
        state: "",
        country: "",
    });

    const plan = user?.plan ?? "free";
    const isPaid = ["starter", "pro", "growth", "premium"].includes(plan);

    // ✅ For free users: call onSelect when all 3 fields are filled
    useEffect(() => {
        const { city, state, country } = manualLocation;
        if (
            plan === "free" &&
            city.trim().length > 0 &&
            state.trim().length > 0 &&
            country.trim().length > 0
        ) {
            onSelect({ city, state, country });
        }
    }, [manualLocation, onSelect, plan]);

    if (isLoading) return <p className="text-sm text-gray-500">Loading user plan...</p>;

    if (isPaid) {
        return (
            <div>
                <GoogleAutoComp
                    placeholder="Start typing city, state, or country"
                    onSelect={(loc) => {
                        if (loc.city && loc.state && loc.country) {
                            onSelect(loc);
                        }
                    }}
                />
                {error && <p className="form-error">{error}</p>}
            </div>
        );
    }

    // 🆓 Free user: manual entry of city, state, country
    return (
        <div className="manual-location-grid">
            <input
                className="form-input pt-1"
                style={{ textTransform: "capitalize" }}
                type="text"
                placeholder="City"
                value={manualLocation.city}
                onChange={(e) => setManualLocation((prev) => ({ ...prev, city: e.target.value }))}
            />
            <input
                className="form-input mt-1"
                style={{ textTransform: "capitalize" }}
                type="text"
                placeholder="State"
                value={manualLocation.state}
                onChange={(e) => setManualLocation((prev) => ({ ...prev, state: e.target.value }))}
            />
            <input
                className="form-input mt-1"
                style={{ textTransform: "capitalize" }}
                type="text"
                placeholder="Country"
                value={manualLocation.country}
                onChange={(e) => setManualLocation((prev) => ({ ...prev, country: e.target.value }))}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}