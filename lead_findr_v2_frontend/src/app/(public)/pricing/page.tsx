"use client";

import React, { useState, useEffect, useCallback } from "react";
import PlanByok from "@/page_components/pricing/plan_byok";
import PlanManaged from "@/page_components/pricing/plan_managed";
import CreditPlanView from "@/page_components/pricing/credit_plan_view";
import { createCheckoutSession } from "@/lib/api/billing_client";
import toast from "react-hot-toast";

export default function PricingPage() {
    const [mode, setMode] = useState<"byok" | "managed">("byok");
    const [pricingMode] = useState<"subscription" | "credits">("subscription");
    const [loading, setLoading] = useState(false);

    const handleUpgrade = useCallback(async (planKey: string) => {
        const token = localStorage.getItem("token");

        if (!token) {
            localStorage.setItem("pending_plan", planKey);
            localStorage.setItem("pending_mode", mode);
            window.location.href = `/signup?redirect=/pricing`;
            return;
        }

        setLoading(true);
        try {
            const session = await createCheckoutSession(planKey as "starter" | "pro" | "growth" | "premium", "monthly", mode);
            window.location.href = session.url;
        } catch (err) {
            console.error("❌ Checkout error:", err);
            toast.error("Could not start checkout.");
        } finally {
            setLoading(false);
        }
    }, [mode]);

    useEffect(() => {
        const plan = localStorage.getItem("pending_plan");
        const savedMode = localStorage.getItem("pending_mode");
        const token = localStorage.getItem("token");

        if (plan && savedMode && token) {
            localStorage.removeItem("pending_plan");
            localStorage.removeItem("pending_mode");
            handleUpgrade(plan);
        }
    }, [handleUpgrade]);

    return (
        <main className="max-w-6xl mx-auto px-6 py-10 pt-16">
            <h1 className="text-3xl font-bold mb-2 text-center">Choose Your Plan</h1>
            <p className="text-gray-600 mb-6 text-center">
                Start free, or upgrade for more scan power and insights.
            </p>

            {/* Toggle between BYOK and Managed */}
            {pricingMode === "subscription" && (
                <div className="flex justify-center mb-6">
                    <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner">
                        <button
                            onClick={() => setMode("byok")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ease-in-out ${mode === "byok" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:text-black"
                                }`}
                        >
                            Bring Your Own Keys
                        </button>
                        <button
                            onClick={() => setMode("managed")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ease-in-out ${mode === "managed" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:text-black"
                                }`}
                        >
                            We Handle the Keys
                        </button>
                    </div>
                </div>
            )}

            {/* Pricing View */}
            {pricingMode === "subscription" ? (
                mode === "byok" ? (
                    <PlanByok loading={loading} subscription={null} onUpgrade={handleUpgrade} />
                ) : (
                    <PlanManaged loading={loading} subscription={null} onUpgrade={handleUpgrade} />
                )
            ) : (
                <CreditPlanView />
            )}

            <div className="mt-12 text-center text-sm text-gray-500">
                All plans come with full access to the enrichment and scoring engine.
            </div>
        </main>
    );
}
