"use client";

import { useUser } from "@/lib/api/swr";
import UserOverview from "@/page_components/admin_dashboard/user_overview";
import ScanStatsPanel from "@/page_components/admin_dashboard/scan_stats_panel";
import BusinessStatsPanel from "@/page_components/admin_dashboard/business_stats_panel";
import ActivityFeed from "@/page_components/admin_dashboard/activity_feed";
import SubscriptionOverviewPanel from "@/page_components/admin_dashboard/subscription_panel";
import "./admin_dashboard.css";

export default function AdminDashboardPage() {
    const { user, isLoading } = useUser();

    if (isLoading || !user) {
        return <div className="p-8 text-gray-500">Loading dashboard data...</div>;
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 mt-10">
            <h1 className="text-3xl font-bold mb-2">📊 Admin Dashboard</h1>

            {/* Pass dynamic showRoleBreakdown to user panel only */}
            <UserOverview showRoleBreakdown={user.role === "superadmin"} />
            <ScanStatsPanel />
            <BusinessStatsPanel />
            {/* <SystemHealthPanel /> */}
            <SubscriptionOverviewPanel />
            <ActivityFeed />
        </main>
    );
}