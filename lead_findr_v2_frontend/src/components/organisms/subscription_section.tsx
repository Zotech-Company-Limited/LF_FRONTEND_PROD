"use client";

import { useEffect, useState } from "react";
import {
    getUserScanAnalytics,
    getUserSettings,
} from "@/lib/api/user_client";
import {

    createCustomerPortal,
} from "@/lib/api/billing_client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserSettings {
    plan: string;
    scan_usage: number;
    scan_limit: number;
}

interface ScanAnalytics {
    total_scans: number;
    city_scans_run: number;
    state_scans_run: number;
    country_scans_run: number;
    cities_reached: number;
    states_reached: number;
    countries_reached: number;
}

export default function SubscriptionSection() {
    const [user, setUser] = useState<UserSettings | null>(null);
    const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserSettings();
                setUser(userData);

                const scanData = await getUserScanAnalytics();
                setAnalytics(scanData);
            } catch (err: unknown) {
                console.error("Failed to load subscription data", err);
                toast.error(
                    err instanceof Error
                        ? `Error: ${err.message}`
                        : "Could not load subscription info."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleManage = async () => {
        try {
            const portal = await createCustomerPortal();
            window.location.href = portal.url;
        } catch (err: unknown) {
            toast.error(
                err instanceof Error
                    ? `Could not open portal: ${err.message}`
                    : "Could not open subscription portal."
            );
        }
    };

    const viewPackages = () => router.push("/pricing");

    if (loading || !user) {
        return <p className="settings-loading">Loading subscription…</p>;
    }

    const usagePercent = user.scan_limit
        ? (user.scan_usage / user.scan_limit) * 100
        : 0;

    const planMessages: Record<string, string> = {
        free: "Your Free plan includes 100 businesses/month. Need more reach?",
        starter: "Your Starter plan includes up to 1,000 businesses/month.",
        pro: "Your Pro plan includes up to 3,000 businesses/month.",
        growth: "Your Growth plan includes up to 20,000 businesses/month.",
        premium: "Your Premium plan includes up to 50,000 businesses/month.",
    };

    return (
        <div className="settings-card">
            <h2 className="settings-section-title">📦 Subscription</h2>

            <div className="settings-detail">
                <strong>Plan:</strong> {user.plan}
            </div>

            <div className="settings-detail">
                <strong>Usage:</strong> {user.scan_usage} / {user.scan_limit}
            </div>

            <div className="usage-bar-wrapper mt-2 mb-4">
                <div
                    className="usage-bar-fill"
                    style={{ width: `${usagePercent}%` }}
                ></div>
            </div>

            <div className="mt-6">
                <p className="text-sm text-gray-500 mb-4">
                    {planMessages[user.plan] || "Unknown plan."}{" "}
                    {user.plan !== "free" ? (
                        <>
                            <span
                                onClick={handleManage}
                                className="text-blue-600 hover:underline cursor-pointer font-medium"
                            >
                                Manage subscription
                            </span>{" "}
                            or{" "}
                            <span
                                onClick={viewPackages}
                                className="text-green-600 hover:underline cursor-pointer font-medium"
                            >
                                view packages
                            </span>
                        </>
                    ) : (
                        <span
                            onClick={viewPackages}
                            className="text-blue-600 hover:underline cursor-pointer font-medium"
                        >
                            Upgrade anytime.
                        </span>
                    )}
                </p>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Scans Run</h3>
                        <div className="grid gap-y-1">
                            <div>Total Scans: <strong>{analytics?.total_scans}</strong></div>
                            <div>City Scans: <strong>{analytics?.city_scans_run}</strong></div>
                            <div>State Scans: <strong>{analytics?.state_scans_run}</strong></div>
                            <div>Country Scans: <strong>{analytics?.country_scans_run}</strong></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Regions Reached</h3>
                        <div className="grid gap-y-1">
                            <div>Cities Reached: <strong>{analytics?.cities_reached}</strong></div>
                            <div>States Reached: <strong>{analytics?.states_reached}</strong></div>
                            <div>Countries Reached: <strong>{analytics?.countries_reached}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
