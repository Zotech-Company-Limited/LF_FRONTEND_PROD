"use client";

import { useEffect, useState } from "react";
import { getSystemHealth, SystemHealth } from "@/lib/api/admin_dashboard";
import "../../app/(protected)/admin-dashboard/admin_dashboard.css";

export default function SystemHealthPanel() {
    const [data, setData] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await getSystemHealth();
                setData(res);
            } catch (err) {
                console.error("Failed to fetch system health", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHealth();
    }, []);

    if (loading) return <div className="text-gray-500">Loading system health...</div>;
    if (!data) return <div className="text-red-500">System health data unavailable.</div>;

    return (
        <section className="admin-panel bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🧠 System Health</h2>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    {open ? "Hide" : "Show"}
                </button>
            </div>

            {open && (
                <div className="space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="stat-box">
                            <span className="stat-value">{data.google_api_usage}</span>
                            <span className="stat-label">Google API Usage</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{data.gemini_api_usage}</span>
                            <span className="stat-label">Gemini API Usage</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{data.error_count_last_24h}</span>
                            <span className="stat-label">Errors (24h)</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{new Date(data.last_enrichment).toLocaleString()}</span>
                            <span className="stat-label">Last Enrichment</span>
                        </div>
                    </div>

                    {data.warnings.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-md font-semibold text-yellow-600 mb-2">⚠️ Warnings</h3>
                            <ul className="list-disc ml-6 text-red-600">
                                {data.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
