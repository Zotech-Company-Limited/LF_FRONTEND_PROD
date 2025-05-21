"use client";

import React, { useEffect, useState } from "react";
import ScanScatterPlot from "@/page_components/graphs/scan_scatter_plot";
import InsightHighlightStrip from "@/page_components/user_dashboard/insights_highlight";
import { getUserScanScatter, getUserDashboardInsights } from "@/lib/api/user_client";

interface ScanPoint {
    scanId: string;
    city: string;
    timestamp: string;
    businessCount: number;
    avgDpi: number;
}

interface Insight {
    type: "most_scanned_city" | "peak_time" | "best_city";
    city?: string;
    count?: number;
    dpi?: number;
    time?: string;
}

export default function UserDashboard() {
    const [scanData, setScanData] = useState<ScanPoint[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [scatterPoints, dashboardInsights] = await Promise.all([
                    getUserScanScatter(),
                    getUserDashboardInsights(),
                ]);

                setScanData(scatterPoints);
                setInsights(dashboardInsights);
            } catch (err) {
                console.error("Failed to load user dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div className="p-6 text-sm text-gray-600">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8 mt-14">
            <h1 className="text-2xl font-bold text-gray-800 mb-4"> Overview</h1>

            <ScanScatterPlot data={scanData} />

            <InsightHighlightStrip insights={insights} />
        </div>
    );
}
