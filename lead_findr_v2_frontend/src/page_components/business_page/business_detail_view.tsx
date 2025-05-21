"use client";

import { Business } from "@/lib/api/businesses";
import { getDpiTier } from "@/lib/scoreMeta/dpiTiers";
import DpiRadarChart from "@/page_components/graphs/dpi_radar_chart";
import ScoreSection from "./score_section";
import { ExternalLink, Globe } from "lucide-react";


interface BusinessDetailPageViewProps {
    business: Business;
    onBack: () => void;
}

export default function BusinessDetailPageView({ business, onBack }: BusinessDetailPageViewProps) {
    const tier = getDpiTier(business.dpi_score);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="">
                <button
                    onClick={onBack}
                    className="text-blue-600 text-sm mb-4 transition-transform duration-150 hover:-translate-y-0.5"
                >
                    ← Back
                </button>

                {/* Header & Summary */}
                <div className="bg-white rounded-xl shadow p-6 mb-6 relative">
                    {/* Name + Icons */}
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        {/* Name + Icons */}
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
                                {business.name}
                            </h1>

                            {business.google_maps_url && (
                                <a
                                    href={business.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700"
                                    title="View on Google Maps"
                                >
                                    <Globe className="w-8 h-8 ml-10" />

                                </a>
                            )}

                            {business.website_url && (
                                <a
                                    href={business.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Visit Website"
                                >
                                    <ExternalLink className="w-8 h-8 " />
                                </a>
                            )}
                        </div>

                        {/* Tier Badge */}
                        {/* … */}
                    </div>


                    {/* Tier Badge */}
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tier.color} bg-opacity-10`}
                        >
                            {tier.emoji} {tier.name} — {business.dpi_score}%
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-base text-gray-600 mt-2 leading-relaxed">
                        {tier.description}
                    </p>

                    {/* Radar Chart */}
                    <div className="m-10 p-5">
                        <DpiRadarChart
                            website={business.website_score}
                            social={business.social_score}
                            backlink={business.backlink_score}
                            brand={business.brand_score}
                        />
                    </div>
                </div>

                {/* Score Sections */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <ScoreSection
                            icon="🌐"
                            title="Website"
                            breakdown={business.website_breakdown}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <ScoreSection
                            icon="📱"
                            title="Social Media"
                            breakdown={business.social_breakdown}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <ScoreSection
                            icon="🔗"
                            title="Backlinks"
                            breakdown={business.backlink_breakdown}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <ScoreSection
                            icon="🧠"
                            title="Brand"
                            breakdown={business.brand_breakdown}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
