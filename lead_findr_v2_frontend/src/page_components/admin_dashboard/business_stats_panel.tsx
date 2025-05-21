"use client";

import { useEffect, useState } from "react";
import { getBusinessStats, BusinessSummary } from "@/lib/api/admin_dashboard";
import "../../app/(protected)/admin-dashboard/admin_dashboard.css";

export default function BusinessStatsPanel() {
    const [data, setData] = useState<BusinessSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true); // accordion toggle

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getBusinessStats();
                setData(result);
            } catch (err) {
                console.error("Failed to load business stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-gray-500">Loading business stats...</div>;
    if (!data) return <div className="text-red-500">Failed to load business stats.</div>;

    return (
        <section className="admin-panel bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🏢 Business Stats</h2>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    {open ? "Hide" : "Show"}
                </button>
            </div>

            {open && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="stat-box">
                            <span className="stat-value">{data.total}</span>
                            <span className="stat-label">Total Businesses</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{data.new_this_week}</span>
                            <span className="stat-label">New This Week</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{data.low_dpi_count}</span>
                            <span className="stat-label">Low DPI (&lt;30)</span>
                        </div>
                    </div>

                    <h3 className="text-md font-semibold mb-2">📦 Top Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {data.top_categories.map((cat) => (
                            <div key={cat.category} className="stat-box">
                                <span className="stat-value">{cat.count}</span>
                                <span className="stat-label capitalize">{cat.category}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
