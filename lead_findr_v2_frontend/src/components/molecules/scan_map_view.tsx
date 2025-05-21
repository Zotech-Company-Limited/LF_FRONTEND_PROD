"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "@/components/molecules/google_maps_provider";

const containerStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "12px",
};

interface ScanMapViewProps {
    onScan: (lat: number, lng: number) => void;
}

export default function ScanMapView({ onScan }: ScanMapViewProps) {
    const [markerPos, setMarkerPos] = useState({ lat: 44.9727, lng: -93.2354 });
    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded } = useGoogleMaps();

    useEffect(() => {
        if (markerPos) {
            onScan(markerPos.lat, markerPos.lng);
        }
    }, [markerPos, onScan]);

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setMarkerPos({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            });
        }
    };

    if (!isLoaded) return <div className="p-4 text-gray-500">🗺️ Loading map...</div>;

    return (
        <div className="flex flex-col gap-4">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPos}
                zoom={10}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                onClick={onMapClick}
                mapTypeId="roadmap"
            >
                <Marker position={markerPos} />
            </GoogleMap>

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    Click anywhere on the map to select a location:{" "}
                    <strong>
                        {markerPos.lat.toFixed(4)}, {markerPos.lng.toFixed(4)}
                    </strong>
                </p>
            </div>
        </div>
    );
}
