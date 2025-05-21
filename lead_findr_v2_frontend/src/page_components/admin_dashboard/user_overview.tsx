"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardOverview, UserOverviewData } from "@/lib/api/admin_dashboard";
import "@/app/(protected)/admin-dashboard/admin_dashboard.css";

interface UserOverviewProps {
    showRoleBreakdown: boolean;
}

export default function UserOverview({ showRoleBreakdown }: UserOverviewProps) {
    const [data, setData] = useState<UserOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true); // accordion state

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const overview = await getAdminDashboardOverview();
                setData(overview.users);
            } catch (err) {
                console.error("❌ Failed to load user stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-gray-500">Loading user stats...</div>;
    if (!data) return <div className="text-red-500">Failed to load stats.</div>;

    return (
        <section className="admin-panel bg-white rounded-xl shadow p-6">
            {/* Header with toggle */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>👤</span> User Overview
                </h2>
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
                            <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{data.active_last_30_days}</span>
                            <span className="stat-label">Active (30d)</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{data.new_last_7_days}</span>
                            <span className="stat-label">New This Week</span>
                        </div>
                        {Object.entries(data.by_plan).map(([plan, count]) => (
                            <div key={plan} className="stat-box">
                                <span className="stat-value">{count}</span>
                                <span className="stat-label capitalize">Plan: {plan}</span>
                            </div>
                        ))}
                    </div>

                    {showRoleBreakdown && data.by_role && (
                        <>
                            <h3 className="mt-6 text-md font-semibold">🔐 Users by Role</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                                {Object.entries(data.by_role).map(([role, count]) => (
                                    <div key={role} className="stat-box">
                                        <span className="stat-value">{count}</span>
                                        <span className="stat-label">{role}</span>
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
