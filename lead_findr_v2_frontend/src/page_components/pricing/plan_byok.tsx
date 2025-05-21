"use client";

import { Loader2 } from "lucide-react";
import { Subscription } from "@/lib/api/billing_client";

interface PlanByokProps {
    loading: boolean;
    subscription: Subscription | null;
    onUpgrade: (plan: string) => void;
}

export default function PlanByok({
    loading,
    onUpgrade,
}: PlanByokProps) {
    const plans = [
        {
            title: "Free",
            description: "Try the basics for free",
            price: "$0",
            planKey: "free",
            features: [
                "✔ 100 businesses/month",
                "✔ Scoring & Enrichment",
                "✔ Website, Social, Backlink, and Brand analysis",
                "✔ Contact detection",
                "✔ Basic lead filtering",
                "✔ CSV/JSON Export",
            ],
            theme: "gray",
            action: () => window.location.href = "/signup",
        },
        {
            title: "Starter",
            description: "Best for solo builders",
            price: "$2.99",
            planKey: "starter",
            features: [
                "✔ Everything in Free",
                "✔ 1,000 businesses/month",
                "✔ Scan history",
                "✔ Full lead filtering tools",
                "✔ MapView for businesses",
                "✔ Map Scanner",
                "✔ Business Map View",
                "✔ Improved scan concurrency & stability",
                "✔ Email support",
            ],
            theme: "dark",
        },
        {
            title: "Pro",
            description: "For freelancers & consultants",
            price: "$4.99",
            planKey: "pro",
            features: [
                "✔ Everything in Starter",
                "✔ 3,000 businesses/month",
                "✔ Full DPI scoring breakdown",
                "✔ Export filtered results as CSV/JSON",
                "✔ Map View for scans",
                "✔ Priority email support",
            ],
            theme: "dark",
        },

        // {
        //     title: "Growth",
        //     description: "For agencies & sales teams",
        //     price: "$19.99",
        //     planKey: "growth",
        //     features: [
        //         "✔ 20,000 businesses/month",
        //         "✔ DPI scoring + export",
        //         "✔ Trends & scan insights",
        //         "✔ Priority Email support",
        //     ],
        //     theme: "indigo",
        // },
        // {
        //     title: "Premium",
        //     description: "Best for data-driven power users",
        //     price: "$29.99",
        //     planKey: "premium",
        //     features: [
        //         "✔ 50,000 businesses/month",
        //         "✔ Full scoring + growth tracking",
        //         "✔ CSV, JSON, scan history",
        //         "✔ VIP support access",
        //     ],
        //     theme: "indigo",
        // },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
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
                        onClick={() =>
                            plan.action
                                ? plan.action()
                                : onUpgrade(plan.planKey)
                        }
                        disabled={loading}
                        className={`mt-6 w-full py-2 rounded transition ${plan.theme === "gray"
                            ? "bg-gray-300 text-black hover:bg-gray-400"
                            : plan.theme === "dark"
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : `Upgrade to ${plan.title}`}
                    </button>
                </div>
            ))}
        </div>
    );
}
