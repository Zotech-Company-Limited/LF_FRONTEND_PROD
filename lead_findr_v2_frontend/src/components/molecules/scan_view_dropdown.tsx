// app/components/molecules/scan_view_dropdown.tsx

"use client";

import React from "react";

export type ScanViewMode = "scan" | "city";

interface ScanViewModeDropdownProps {
    value: ScanViewMode;
    onChange: (value: ScanViewMode) => void;
}

const options: { label: string; value: ScanViewMode }[] = [
    { label: "Scan History", value: "scan" },
    { label: "Cities", value: "city" },
];

export default function ScanViewModeDropdown({
    value,
    onChange,
}: ScanViewModeDropdownProps) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as ScanViewMode)}
                className="select-modern "
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
