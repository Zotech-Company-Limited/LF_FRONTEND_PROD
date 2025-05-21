"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import { createContext, useContext, ReactNode } from "react";

const GoogleMapsContext = createContext<{ isLoaded: boolean }>({ isLoaded: false });

//  Add "marker" to enable AdvancedMarkerElement
const libraries: ("places" | "marker")[] = ["places", "marker"];

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        libraries,
    });

    return (
        <GoogleMapsContext.Provider value={{ isLoaded }}>
            {children}
        </GoogleMapsContext.Provider>
    );
}

export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}
