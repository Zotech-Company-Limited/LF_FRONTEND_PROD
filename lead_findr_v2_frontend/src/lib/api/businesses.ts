import { authGet } from "./swr";

// 🌐 API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BreakdownItem {
    label: string;
    score: number;
    max_score: number;
    tier: string;
    tip: string;
    summary: string;
}

export type Breakdown = Record<string, BreakdownItem>;

//  Unified Business Type
export interface Business {
    place_id: string;
    name: string;
    address: string;
    city: string;
    state?: string;
    country?: string;

    dpi_score: number;
    dpi_badge: string;

    website_score: number;
    social_score: number;
    backlink_score: number;
    brand_score: number;

    website_breakdown?: Breakdown;
    social_breakdown?: Breakdown;
    backlink_breakdown?: Breakdown;
    brand_breakdown?: Breakdown;

    scan_id?: string;
    is_cached_pull?: boolean;
    has_website?: boolean;
    is_secure?: boolean;

    lat?: number;
    lng?: number;
    website_url?: string;
    google_maps_url?: string;
    phone?: string;
    phone_international?: string;
    category?: string;
    keywords?: string[];
}

export type ScanHistoryEntry = {
    scan_id: string;
    region_type: string;
    region_slug: string;
    keywords: string[];
    city: string;
    state: string;
    country: string;
    timestamp: string;
    status: "success" | "partial" | "failed";
    has_businesses: boolean;
    business_count: number;
    dpi_avg: number | null;
    dpi_concurrency: number;
    google_places_limit: number;
    duration_seconds: number;
    error_message?: string;
    location_bias_lat?: number;
    location_bias_lng?: number;
    user_id?: number;
};

export type ScanPayload = {
    mode: "choice" | "random";
    region_type: "city" | "state" | "country";
    city?: string;
    state?: string;
    country?: string;
    keywords?: string[];
    dpi_concurrency?: number;
    google_places_limit?: number;
    user_id: string;
    location_bias_lat?: number;
    location_bias_lng?: number;
    cache_scope?: "none" | "1d" | "7d" | "30d";
};

export interface CitySummary {
    city: string;
    state: string;
    country: string;
    business_count: number;
    last_scanned: string;
}

export async function getMyCities(): Promise<CitySummary[]> {
    return authGet("/user/cities");
}

export async function getBusinessesByScanId(
    scan_id: string,
    filters: Record<string, unknown> = {}
): Promise<Business[]> {
    const url = new URL(`${API_BASE_URL}/user/scan/${scan_id}/businesses`);
    Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null) url.searchParams.append(key, String(val));
    });

    const response = await fetch(url.toString());
    const json = await response.json().catch(() => null);
    if (!json) throw new Error("Invalid JSON response");

    if (!response.ok) throw new Error(json.detail || "Failed to load businesses from scan");
    return json;
}

export async function getBusinessesByCity(
    city: string,
    state: string,
    country: string,
    filters: Record<string, unknown> = {}
): Promise<Business[]> {
    const url = new URL(`${API_BASE_URL}/user/city/businesses`);

    url.searchParams.set("city", city);
    url.searchParams.set("state", state);
    url.searchParams.set("country", country);

    Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
            url.searchParams.set(key, String(val));
        }
    });

    const res = await fetch(url.toString());
    const json = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(json.detail || "Failed to fetch businesses for city.");
    return json;
}

export async function getBusinessByPlaceId(place_id: string): Promise<Business> {
    const url = `${API_BASE_URL}/user/businesses/${place_id}`;
    const res = await fetch(url);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.detail || "Failed to fetch business by place ID");
    return json;
}


export function combineDuplicateCities(cities: CitySummary[]): CitySummary[] {
    const cityMap: Map<string, CitySummary> = new Map();

    for (const city of cities) {
        if (!city.city || !city.country) continue;

        const normalizedCity = city.city.trim().toLowerCase();
        const key = `${normalizedCity}-${city.country.toLowerCase()}`;

        if (cityMap.has(key)) {
            const existing = cityMap.get(key)!;
            cityMap.set(key, {
                ...existing,
                business_count: existing.business_count + city.business_count,
                last_scanned:
                    new Date(city.last_scanned) > new Date(existing.last_scanned)
                        ? city.last_scanned
                        : existing.last_scanned,
                state:
                    existing.state && existing.state.length >= city.state.length
                        ? existing.state
                        : city.state,
            });
        } else {
            cityMap.set(key, { ...city });
        }
    }

    return Array.from(cityMap.values());
}

export async function getMyBusinesses(
    filters: Partial<Record<keyof Business, string | number | boolean | string[]>> = {}
): Promise<{ total: number; results: Business[] }> {
    const url = new URL(`${API_BASE_URL}/user/businesses`);

    Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
            if (Array.isArray(val)) {
                val.forEach((v) => url.searchParams.append(key, String(v)));
            } else {
                url.searchParams.append(key, String(val));
            }
        }
    });

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(json.detail || "Failed to fetch businesses.");

    return {
        total: json.total || 0,
        results: json.results || [],
    };
}

export async function exportBusinesses(
    filters: Record<string, unknown>,
    format: "csv" | "json" | "xlsx" = "csv"
): Promise<Blob | object> {
    const res = await fetch(`${API_BASE_URL}/user/businesses/export?format=${format}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Export failed");
    }

    if (format === "json") {
        return await res.json(); // ⬅️ for programmatic access or saving .json file
    }

    return await res.blob(); // ⬅️ for CSV/XLSX
}


export async function getBusinessInsights(filters: Record<string, unknown>): Promise<{
    avg_dpi: number;
    badge_counts: Record<string, number>;
    top_badge: string;
    top_city?: string;
}> {
    const res = await fetch(`${API_BASE_URL}/user/businesses/insights`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.detail || "Failed to fetch insights");
    return json;
}

export async function fetchBusinessesUnified(
    mode: "user" | "scan" | "city",
    options: {
        filters?: Record<string, unknown>;
        scan_id?: string;
        city?: string;
        state?: string;
        country?: string;
    }
): Promise<{ results: Business[]; total?: number }> {
    switch (mode) {
        case "user": {
            const res = await getMyBusinesses(options.filters || {});
            return { results: res.results, total: res.total };
        }
        case "scan": {
            if (!options.scan_id) throw new Error("Missing scan_id for scan mode");
            const res = await getBusinessesByScanId(options.scan_id, options.filters || {});
            return { results: res };
        }
        case "city": {
            const { city, state, country } = options;
            if (!city || !state || !country) throw new Error("Missing city/state/country for city mode");
            const res = await getBusinessesByCity(city, state, country, options.filters || {});
            return { results: res };
        }
        default:
            throw new Error("Unsupported mode for fetchBusinessesUnified");
    }
}