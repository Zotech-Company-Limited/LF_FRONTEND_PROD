"use client";

import { useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { useGoogleMaps } from "@/components/molecules/google_maps_provider";
import { Business } from "@/lib/api/businesses";

const containerStyle = {
    width: "100%",
    height: "min(400px, 60vh)",
    borderRadius: "12px",
};

interface MapViewProps {
    businesses: Business[];
}



export default function MapView({ businesses }: MapViewProps) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const { isLoaded } = useGoogleMaps();

    const validCoords = businesses.filter((b) => b.lat && b.lng);

    const defaultCenter =
        validCoords.length > 0
            ? { lat: validCoords[0].lat!, lng: validCoords[0].lng! }
            : { lat: 44.9727, lng: -93.2354 }; // fallback: Minneapolis

    const getColorByDpi = (dpi: number): string => {
        if (dpi >= 90) return "#2ecc71";  // green
        if (dpi >= 70) return "#f1c40f";  // yellow
        if (dpi >= 50) return "#e67e22";  // orange
        if (dpi >= 30) return "#e74c3c";  // red
        return "#7f8c8d";                // gray
    };

    const getLucideSvgDataUri = (color: string = "#ff0000") => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5">
                <path d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
        `;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        // Clear previous markers
        Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
        markersRef.current = {};

        validCoords.forEach((biz) => {
            const marker = new google.maps.Marker({
                map: mapRef.current!,
                position: { lat: biz.lat!, lng: biz.lng! },
                title: biz.name,
                icon: {
                    url: getLucideSvgDataUri(getColorByDpi(biz.dpi_score)),
                    scaledSize: new google.maps.Size(40, 40),
                },
            });

            marker.addListener("click", () => {
                if (!infoWindowRef.current) {
                    infoWindowRef.current = new google.maps.InfoWindow();
                }

                const html = generateInfoWindowHtml(biz);
                infoWindowRef.current.setContent(html);
                infoWindowRef.current.setPosition({ lat: biz.lat!, lng: biz.lng! });
                infoWindowRef.current.open(mapRef.current);
            });

            markersRef.current[biz.place_id] = marker;
        });
    }, [isLoaded, validCoords]);

    const generateInfoWindowHtml = (biz: Business) => {
        const percent = (score: number) => Math.round((score / 25) * 100);
        return `
            <div style="padding: 0.5rem; width: 260px; font-size: 0.875rem; color: #374151">
                <h2 style="font-weight: 600; font-size: 1rem; color: #111827">${biz.name}</h2>
                <p style="color: #6B7280">${biz.address}</p>
                <div style="margin-top: 0.5rem;">
                    <strong style="color: #2563eb;">${biz.dpi_score}%</strong> • ${biz.dpi_badge}
                </div>
                <div style="margin-top: 0.5rem;">
                    ${biz.website_url ? `<a href="${biz.website_url}" target="_blank" style="color: #2563eb; text-decoration: underline;">Visit Website</a>` : ''}
                    ${biz.google_maps_url ? ` • <a href="${biz.google_maps_url}" target="_blank" style="color: #2563eb; text-decoration: underline;">Google Maps</a>` : ''}
                </div>
                <div style="margin-top: 0.5rem;">
                    <div>Website: ${percent(biz.website_score)}%</div>
                    <div>Social: ${percent(biz.social_score)}%</div>
                    <div>Backlinks: ${percent(biz.backlink_score)}%</div>
                    <div>Brand: ${percent(biz.brand_score)}%</div>
                </div>
            </div>
        `;
    };

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        if (validCoords.length > 1) {
            const bounds = new google.maps.LatLngBounds();
            validCoords.forEach((biz) => {
                bounds.extend(new google.maps.LatLng(biz.lat!, biz.lng!));
            });
            map.fitBounds(bounds);
        }
    };

    if (!isLoaded) return <div>🗺️ Loading map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            mapTypeId="roadmap"
        />
    );
}
