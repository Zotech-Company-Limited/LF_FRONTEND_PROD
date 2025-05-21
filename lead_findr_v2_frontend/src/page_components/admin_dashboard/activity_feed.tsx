"use client";

import { useEffect, useState } from "react";
import { getActivityFeed, ScanLogEntry } from "../../lib/api/admin_dashboard";
import "../../app/(protected)/admin-dashboard/admin_dashboard.css";

export default function ActivityFeed() {
    const [scans, setScans] = useState<ScanLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getActivityFeed();
                setScans(res.scans);
            } catch (err) {
                console.error("Failed to load activity feed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-gray-500">Loading activity...</div>;
    if (!scans.length) return <div className="text-red-500">No recent activity.</div>;

    return (
        <section className="admin-panel bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📜 Recent Activity</h2>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    {open ? "Hide" : "Show"}
                </button>
            </div>

            {open && (
                <ul className="divide-y text-sm">
                    {scans.map((entry, i) => (
                        <li key={i} className="py-2">
                            <div className="flex justify-between">
                                <span className="font-medium">{entry.user_email}</span>
                                <span className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-gray-700">
                                Ran a scan for <span className="font-semibold">{entry.city}</span>
                                {entry.status === "failed" && (
                                    <span className="text-red-500 ml-2">⚠️ Failed: {entry.error}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
