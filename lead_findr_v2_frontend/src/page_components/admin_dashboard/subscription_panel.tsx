"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardOverview } from "@/lib/api/admin_dashboard";
import "../../app/(protected)/admin-dashboard/admin_dashboard.css";

interface PlanBreakdown {
    [plan: string]: number;
}

interface SubscriptionStats {
    total_active: number;
    canceled_this_month: number;
    upcoming_renewals: number;
    revenue_this_month: number;
    by_plan: PlanBreakdown;
}

export default function SubscriptionOverviewPanel() {
    const [stats, setStats] = useState<SubscriptionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true); // accordion state

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminDashboardOverview();
                setStats(data.subscriptions); // 🔄 From `/user/admin/overview`
            } catch (err) {
                console.error("Failed to load subscription stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-gray-500">Loading subscription data...</div>;
    if (!stats) return <div className="text-red-500">Failed to load subscription data.</div>;

    return (
        <section className="admin-panel bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">💳 Subscription Overview</h2>
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
                            <span className="stat-value">{stats.total_active}</span>
                            <span className="stat-label">Active Subscriptions</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">${stats.revenue_this_month.toFixed(2)}</span>
                            <span className="stat-label">Revenue This Month</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{stats.canceled_this_month}</span>
                            <span className="stat-label">Canceled This Month</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{stats.upcoming_renewals}</span>
                            <span className="stat-label">Upcoming Renewals (7d)</span>
                        </div>
                    </div>

                    <h3 className="text-md font-semibold mb-2">📦 Plan Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {Object.entries(stats.by_plan).map(([plan, count]) => (
                            <div key={plan} className="stat-box">
                                <span className="stat-value">{count}</span>
                                <span className="stat-label capitalize">{plan}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
