"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface GoogleAutoCompProps {
    onSelect: (result: {
        city: string;
        state: string;
        country: string;
        lat: number;
        lng: number;
    }) => void;
    placeholder?: string;
    className?: string;
}

export default function GoogleAutoComp({
    onSelect,
    placeholder = "Start typing city, state, or country...",
    className = "form-input",
}: GoogleAutoCompProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initAutocomplete = () => {
            if (!inputRef.current || !window.google?.maps?.places) return;

            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                types: ["(cities)"],
                fields: ["address_components", "geometry"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place || !place.address_components || !place.geometry) {
                    toast.error("⚠️ Please select a valid city from the dropdown.");
                    return;
                }

                const get = (type: string) =>
                    place.address_components?.find((c) => c.types.includes(type))?.long_name || "";

                const city = get("locality") || get("administrative_area_level_2");
                const state = get("administrative_area_level_1");
                const country = get("country");
                const location = place.geometry.location;

                if (!city || !state || !country || !location) {
                    toast.error("⚠️ Missing location data. Try again.");
                    return;
                }

                onSelect({
                    city,
                    state,
                    country,
                    lat: location.lat(),
                    lng: location.lng(),
                });
            });
        };

        if (window.google?.maps?.places) {
            initAutocomplete();
        } else {
            const interval = setInterval(() => {
                if (window.google?.maps?.places) {
                    clearInterval(interval);
                    initAutocomplete();
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [onSelect]);

    return <input ref={inputRef} type="text" placeholder={placeholder} className={className} />;
}
