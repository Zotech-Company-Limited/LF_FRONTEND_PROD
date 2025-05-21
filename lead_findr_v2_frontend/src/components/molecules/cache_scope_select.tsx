import React from "react";

export type CacheScope = "none" | "1d" | "7d" | "30d";

interface Props {
    value: CacheScope;
    onChange: (value: CacheScope) => void;
}

const options: { value: CacheScope; label: string }[] = [
    { value: "none", label: "♻️ Fresh Only" },
    { value: "1d", label: "🕐 Reuse if <1 Day" },
    { value: "7d", label: "🗓️ Reuse if <7 Days" },
    { value: "30d", label: "📅 Reuse if <30 Days" },
];

export default function CacheScopeSelect({ value, onChange }: Props) {
    return (
        <div className="mt-4">
            <label className="form-label">Cache Scope</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as CacheScope)}
                className="form-input"
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
