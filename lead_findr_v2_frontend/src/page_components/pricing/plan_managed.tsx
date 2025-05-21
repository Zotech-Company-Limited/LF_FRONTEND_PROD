"use client";

import { Loader2 } from "lucide-react";
import { Subscription } from "@/lib/api/billing_client";

interface PlanManagedProps {
    loading: boolean;
    subscription: Subscription | null;
    onUpgrade: (plan: string) => void;
}

export default function PlanManaged({ loading, onUpgrade }: PlanManagedProps) {
    const plans = [
        {
            title: "KeyCare 1000",
            description: "We run the scans for you",
            price: "$24.99",
            planKey: "key_care",
            features: [
                "✔ 1,000 businesses/month",
                "✔ Full DPI scoring & insights",
                "✔ API keys included (we manage everything)",
                "✔ Google Maps & Autocomplete access",
                "✔ Map Scanner & Business Map View",
                "✔ Export filtered results (CSV/JSON)",
                "✔ Scan history & advanced filtering",
                "✔ Full access to Phase 2 exports",
                "✔ Email support",
            ],
        },
        {
            title: "KeyCare 2000",
            description: "More volume, same ease",
            price: "$44.99",
            planKey: "key_care_pro",
            features: [
                "✔ 2,000 businesses/month",
                "✔ Everything in KeyCare 1000",
                "✔ VIP support & onboarding help",
            ],
        },
    ];


    return (
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {plans.map((plan) => (
                <div
                    key={plan.planKey}
                    className="flex flex-col justify-between border rounded-xl p-6 bg-white shadow-md w-full"
                >
                    <div>
                        <h2 className="text-xl font-semibold">{plan.title}</h2>
                        <p className="text-gray-500">{plan.description}</p>
                        <p className="text-3xl font-bold mt-4">{plan.price}</p>
                        <ul className="text-sm mt-4 space-y-1">
                            {plan.features.map((feat, i) => (
                                <li key={i}>{feat}</li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => onUpgrade(plan.planKey)}
                        disabled={loading}
                        className="mt-6 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : `Upgrade to ${plan.title}`}
                    </button>
                </div>
            ))}
        </div>
    );
}
