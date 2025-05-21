"use client";

import { useRef, useState, useEffect } from "react";
import { exportBusinesses } from "@/lib/api/businesses";
import { useBusinessFilters } from "@/context/business_filter_context";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { ArrowDownToLine } from "lucide-react";

export default function ExportDropdown() {
    const { filters } = useBusinessFilters();
    const [open, setOpen] = useState(false);
    const [filename, setFilename] = useState("filtered_businesses");
    const [format, setFormat] = useState<"csv" | "json" | "xlsx">("csv");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const handleDownload = async () => {
        try {
            const data = await exportBusinesses(filters as Record<string, unknown>, format);
            const safeName = filename.trim() || "filtered_businesses";
            if (format === "json") {
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                });
                saveAs(blob, `${safeName}.json`);
            } else {
                saveAs(data as Blob, `${safeName}.${format}`);
            }
            toast.success(` Downloaded as ${format.toUpperCase()}`);
            setOpen(false);
        } catch (err) {
            console.error("Export failed:", err);
            toast.error("❌ Export failed");
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <ArrowDownToLine
                onClick={() => setOpen((prev) => !prev)}
                className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800 transition"
            />

            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded z-50 p-4 space-y-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-600">Filename</label>
                        <input
                            ref={inputRef}
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="filtered_businesses"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-600">Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value as "csv" | "json" | "xlsx")}
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="csv">📄 CSV</option>
                            <option value="xlsx">📊 Excel</option>
                            <option value="json">🧾 JSON</option>
                        </select>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="w-full py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        ⬇ Download
                    </button>
                </div>
            )}
        </div>
    );
}
