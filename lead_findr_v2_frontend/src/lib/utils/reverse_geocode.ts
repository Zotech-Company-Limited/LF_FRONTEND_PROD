// lib/utils/reverse_geocode.ts
let geocoder: google.maps.Geocoder | null = null;
const geoCache = new Map<string, { city: string; state: string; country: string }>();

function getCacheKey(lat: number, lng: number) {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`; // Adjust precision if needed
}

export async function reverseGeocode(
    lat: number,
    lng: number
): Promise<{ city: string; state: string; country: string }> {
    if (typeof window === "undefined" || !window.google || !window.google.maps) {
        throw new Error("Google Maps API is not loaded.");
    }

    const key = getCacheKey(lat, lng);
    if (geoCache.has(key)) {
        return geoCache.get(key)!;
    }

    if (!geocoder) {
        geocoder = new window.google.maps.Geocoder();
    }

    return new Promise((resolve, reject) => {
        geocoder!.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results.length > 0) {
                const result = results[0];
                const get = (type: string) =>
                    result.address_components.find((c) => c.types.includes(type))?.long_name || "";

                const city = get("locality") || get("administrative_area_level_2");
                const state = get("administrative_area_level_1");
                const country = get("country");

                if (!city || !state || !country) {
                    reject(new Error("Incomplete location data from geocoder."));
                } else {
                    const data = { city, state, country };
                    geoCache.set(key, data);
                    resolve(data);
                }
            } else {
                reject(new Error(`Geocoding failed: ${status}`));
            }
        });
    });
}
