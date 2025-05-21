// app/user/business_place/[place_id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBusinessByPlaceId } from "@/lib/api/businesses";
import BusinessDetailPageView from "@/page_components/business_page/business_detail_view";
import { Business } from "@/lib/api/businesses";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BusinessPlacePage() {
    const router = useRouter();
    const params = useParams();
    const placeId = params.place_id as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await getBusinessByPlaceId(placeId);
                setBusiness(data);
            } catch (err) {
                console.error("Failed to fetch business:", err);
                toast.error("Business not found or unavailable");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        if (placeId) fetchBusiness();
    }, [placeId, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Loading business details...
            </div>
        );
    }

    if (!business) {
        return <div className="p-8 text-red-500">Business not found.</div>;
    }

    return (
        <div className="w-full px-6 py-6 mt-8">
            <BusinessDetailPageView business={business} onBack={() => router.back()} />
        </div>
    );
}
