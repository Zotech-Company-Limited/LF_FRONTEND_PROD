"use client";

import React from "react";
import { getDpiTier } from "@/lib/scoreMeta/dpiTiers";

export type Business = {
    place_id: string;
    name: string;
    address: string;
    city: string;
    dpi_score: number;
    dpi_badge: string;
    website_score: number;
    social_score: number;
    backlink_score: number;
    brand_score: number;
    website_max_score?: number;
    social_max_score?: number;
    backlink_max_score?: number;
    brand_max_score?: number;
    json_data: {
        nationalPhoneNumber?: string;
        internationalPhoneNumber?: string;
        googleMapsUri?: string;
    };
};

export default function BusinessCard({
    business,
    onClick,
}: {
    business: Business;
    onClick?: () => void;
}) {
    const {
        name,
        address,
        city,
        dpi_score,
        dpi_badge,
        website_score,
        social_score,
        backlink_score,
        brand_score,
        website_max_score = 25,
        social_max_score = 25,
        backlink_max_score = 25,
        brand_max_score = 25,
        json_data,
    } = business;

    const tier = getDpiTier(dpi_score);

    return (
        <div
            onClick={onClick}
            className="w-full border border-gray-200 rounded-lg bg-white px-4 py-4 shadow-sm hover:shadow-md transition cursor-pointer"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-base font-semibold text-black">{name}</h3>
                    <p className="text-sm text-gray-500">{address}, {city}</p>
                </div>
                <div className="text-sm font-medium text-gray-600">{tier.emoji} {tier.name}</div>
            </div>

            {/* DPI Score */}
            <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-gray-700">DPI:</span>
                <span className="font-bold text-black">{dpi_score}</span>
                <span className="text-xs text-gray-500">({dpi_badge})</span>
            </div>

            {/* Score Breakdown */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600">
                <div>
                    🌐 Website<br />
                    <span className="font-semibold text-black">{website_score} / {website_max_score}</span>
                </div>
                <div>
                    📱 Social<br />
                    <span className="font-semibold text-black">{social_score} / {social_max_score}</span>
                </div>
                <div>
                    🔗 Backlinks<br />
                    <span className="font-semibold text-black">{backlink_score} / {backlink_max_score}</span>
                </div>
                <div>
                    💡 Brand<br />
                    <span className="font-semibold text-black">{brand_score} / {brand_max_score}</span>
                </div>
            </div>

            {/* Optional contact info */}
            {json_data?.googleMapsUri && (
                <div className="mt-4 text-sm text-blue-600 underline">
                    <a href={json_data.googleMapsUri} target="_blank" rel="noopener noreferrer">
                        View on Google Maps
                    </a>
                </div>
            )}
        </div>
    );
}
