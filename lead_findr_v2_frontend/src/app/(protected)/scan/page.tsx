"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/lib/api/swr";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { debounce, DebouncedFunc } from "lodash";
import { useGoogleMaps } from "@/components/molecules/google_maps_provider";
import Button from "@/components/atoms/Button";
import ScanMapView from "@/components/molecules/scan_map_view";
import { reverseGeocode } from "@/lib/utils/reverse_geocode";
import "./scan.css";

const ScanForm = dynamic(() => import("@/components/organisms/scanform"), { ssr: false });
const MapScanForm = dynamic(() => import("@/components/molecules/map_scan_form"), { ssr: false });

export default function ScanPage() {
    const { isLoaded } = useGoogleMaps();
    const { user, isLoading } = useUser();

    const [mode, setMode] = useState<"form" | "map">("form");
    const [locationData, setLocationData] = useState<{
        city: string;
        state: string;
        country: string;
        lat: number;
        lng: number;
    } | null>(null);

    const allowedPlans = ["pro", "key_care", "key_care_pro", "growth", "premium"];
    const userPlan = user?.plan ?? "free";
    const canUseMap = allowedPlans.includes(userPlan);

    const debouncedGeocodeRef = useRef<DebouncedFunc<(lat: number, lng: number) => void> | null>(null);

    useEffect(() => {
        debouncedGeocodeRef.current = debounce(async (lat: number, lng: number) => {
            try {
                const loc = await reverseGeocode(lat, lng);
                setLocationData({ ...loc, lat, lng });
            } catch {
                toast.error("❌ Could not determine city from map pin.");
                setLocationData(null);
            }
        }, 1200);

        return () => {
            debouncedGeocodeRef.current?.cancel();
        };
    }, []);

    const handleScanFromMap = (lat: number, lng: number) => {
        debouncedGeocodeRef.current?.(lat, lng);
    };

    const handleScanComplete = (scan: unknown) => {
        console.log("Scan complete:", scan);
    };

    if (!isLoaded || isLoading) {
        return <div className="p-8 text-gray-500">🗺️ Loading scan page...</div>;
    }

    return (
        <div className="scan-container pt-18">
            <div className="pt-6">
                <div className="scan-mode-toggle">
                    <div className="relative group">
                        <Button
                            className={`scan-toggle-btn ${mode === "map" ? "active" : "inactive"} ${!canUseMap ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => canUseMap && setMode("map")}
                            disabled={!canUseMap}
                        >
                            🗺️ Map Input
                        </Button>
                        {!canUseMap && (
                            <div className="absolute top-full w-30 mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-700 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                🔒 Available on Pro and above
                            </div>
                        )}
                    </div>

                    <Button
                        className={`scan-toggle-btn ${mode === "form" ? "active" : "inactive"}`}
                        onClick={() => setMode("form")}
                    >
                        📝 City Input
                    </Button>
                </div>

                <div className="scan-content mt-6">
                    {mode === "form" && <ScanForm onScanComplete={handleScanComplete} />}
                    {mode === "map" && canUseMap && (
                        <div className="map-mode-layout">
                            <div className="map-section">
                                <ScanMapView onScan={handleScanFromMap} />
                            </div>
                            <div className="form-section">
                                {locationData ? (
                                    <MapScanForm
                                        overrideLocation={locationData}
                                        onScanComplete={handleScanComplete}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500 mt-4">
                                        Select a point on the map to begin.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
