"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardOverview, ScanOverviewData } from "@/lib/api/admin_dashboard";
import "../../app/(protected)/admin-dashboard/admin_dashboard.css";

export default function ScanStatsPanel() {
    const [data, setData] = useState<ScanOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true); // Accordion toggle

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const overview = await getAdminDashboardOverview();
                setData(overview.scans);
            } catch (err) {
                console.error("Failed to load scan stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScans();
    }, []);

    if (loading) return <div className="text-gray-500">Loading scan stats...</div>;
    if (!data) return <div className="text-red-500">Failed to load scan stats.</div>;

    return (
        <section className="admin-panel bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📊 Scan Stats</h2>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    {open ? "Hide" : "Show"}
                </button>
            </div>

            {open && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="stat-box">
                            <span className="stat-value">{data.total}</span>
                            <span className="stat-label">Total Scans</span>
                        </div>
                    </div>

                    <h3 className="mt-6 text-md font-semibold">📍 Most Scanned Cities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {data.top_cities?.length > 0 ? (
                            data.top_cities.map((entry) => (
                                <div key={entry.city} className="stat-box">
                                    <span className="stat-value">{entry.count}</span>
                                    <span className="stat-label">{entry.city}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No city scan data available.</p>
                        )}
                    </div>

                    {data.top_users && (
                        <>
                            <h3 className="mt-6 text-md font-semibold">🏅 Top Users by Scans</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                                {data.top_users.map((user) => (
                                    <div key={user.email} className="stat-box">
                                        <span className="stat-value">{user.count}</span>
                                        <span className="stat-label">{user.email}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {data.weekly_trend && (
                        <>
                            <h3 className="mt-6 text-md font-semibold">📈 Weekly Scan Trend</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                                {data.weekly_trend.map((week) => (
                                    <div key={week.week} className="stat-box">
                                        <span className="stat-value">{week.count}</span>
                                        <span className="stat-label">{week.week}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </section>
    );
}
