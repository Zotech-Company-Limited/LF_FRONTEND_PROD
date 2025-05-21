"use client";

import { useEffect, useState } from "react";
import { BusinessFilterProvider, useBusinessFilters } from "@/context/business_filter_context";
import BusinessNavbarControls from "@/page_components/business/business_nav_controls";
import BusinessList from "@/page_components/business/business_list";
import MapView from "@/components/molecules/map_view";
import { Business, fetchBusinessesUnified } from "@/lib/api/businesses";
import "./businesses.css";

function BusinessContent() {
    const { filters } = useBusinessFilters();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await fetchBusinessesUnified("user", {
                    filters: {
                        ...filters,
                        limit: pageSize,
                        offset: (page - 1) * pageSize,
                    },
                });
                setBusinesses(data.results);
                setTotal(data.total || 0);
            } catch (e) {
                console.error(e);
                setBusinesses([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [filters, page]);

    if (loading) return <div className="p-6 text-gray-500">Loading businesses...</div>;
    if (businesses.length === 0) return <div className="p-6 text-gray-500">No businesses found.</div>;

    return filters.view_mode === "map" ? (
        <MapView businesses={businesses} />
    ) : (
        <BusinessList
            businesses={businesses}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
        />
    );
}

export default function BusinessPage() {
    return (
        <BusinessFilterProvider>
            <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 ">
                {/* Sticky Filter Bar */}
                <div className="w-full px-6 py-4 bg-white shadow-sm sticky top-14 z-30 border-b space-y-2">
                    <BusinessNavbarControls />
                </div>

                {/* Scrollable Content Below Filter Bar */}
                <div className="overflow-y-auto flex-1 px-6 pb-8 mt-20">
                    <BusinessContent />
                </div>
            </div>
        </BusinessFilterProvider>
    );
}
