"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CreditPlanView() {
    const [loading, setLoading] = useState(false);

    const handleBuy = async (creditPack: "credit_1000" | "credit_2000") => {
        const token = localStorage.getItem("token");

        if (!token) {
            // Save pack intent and redirect to signup
            localStorage.setItem("pending_pack", creditPack);
            window.location.href = `/signup?redirect=/pricing`;
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/credits/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pack: creditPack }),
            });

            if (!res.ok) throw new Error("Checkout failed");
            const data = await res.json();
            window.location.href = data.url;
        } catch (err) {
            console.error("❌ Credit purchase failed", err);
            toast.error("Could not start credit checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <CreditCard
                title="1000 Credits"
                subtitle="One-time scan pack"
                price="$24.99"
                features={[
                    "✔ 1,000 DPI-scored businesses",
                    "✔ No subscription required",
                    "✔ Full enrichment included",
                    "✔ No API keys needed",
                ]}
                loading={loading}
                onClick={() => handleBuy("credit_1000")}
            />
            <CreditCard
                title="2000 Credits"
                subtitle="Larger one-time pack"
                price="$44.99"
                features={[
                    "✔ 2,000 DPI-scored businesses",
                    "✔ Full enrichment & export",
                    "✔ No subscription required",
                    "✔ VIP credit support",
                ]}
                loading={loading}
                onClick={() => handleBuy("credit_2000")}
            />
        </div>
    );
}

function CreditCard({
    title,
    subtitle,
    price,
    features,
    loading,
    onClick,
}: {
    title: string;
    subtitle: string;
    price: string;
    features: string[];
    loading: boolean;
    onClick: () => void;
}) {
    return (
        <div className="flex flex-col justify-between border rounded-xl p-6 bg-white shadow-md">
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-gray-500">{subtitle}</p>
                <p className="text-3xl font-bold mt-4">{price}</p>
                <ul className="text-sm mt-4 space-y-1">
                    {features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                    ))}
                </ul>
            </div>
            <button
                onClick={onClick}
                disabled={loading}
                className="mt-6 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : `Buy Now`}
            </button>
        </div>
    );
}
