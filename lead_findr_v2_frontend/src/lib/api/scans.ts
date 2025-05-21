import { authGet } from "./swr";
import axios from "@/lib/axios";

// Error class to include error details without using `any`
class ScanError extends Error {
    details?: unknown;

    constructor(message: string, details?: unknown) {
        super(message);
        this.name = "ScanError";
        this.details = details;
    }
}

// Type: Payload sent to the backend to initiate a scan
export interface ScanPayload {
    mode: "choice" | "random";
    region_type: "city" | "state" | "country";
    city?: string;
    state?: string;
    country?: string;
    keywords: string[];
    dpi_concurrency?: number;
    google_places_limit?: number;
    user_id: string;
    location_bias_lat?: number;
    location_bias_lng?: number;
    cache_scope?: "none" | "1d" | "7d" | "30d";
}

// Type: Returned for scan history queries
export interface ScanHistoryEntry {
    scan_id: string;
    region_type: string;
    region_slug: string;
    keywords: string[];
    city: string;
    state: string;
    country: string;
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
    timestamp: string;
    geojson_used: boolean;

}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Shared POST function for triggering a scan
async function postScan(endpoint: string, payload: ScanPayload) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Scan Error:", errorData);
        throw new ScanError("Scan failed", errorData?.detail);
    }

    return response.json();
}

// Public Functions: Initiate scans for a city, state, or country
export async function scanCity(payload: ScanPayload) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) throw new Error("User not authenticated");


    const response = await fetch(`${API_BASE_URL}/scan/city`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });


    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Scan Error:", errorData);
        throw new ScanError("Scan failed", errorData?.detail);
    }

    const data = await response.json();
    return data;
}

export async function scanState(payload: ScanPayload) {
    try {
        return await postScan("/scan/state", payload);
    } catch (err: unknown) {
        console.error("❌ Failed to start state scan:", err);
        if (err instanceof ScanError) {
            throw new ScanError("State scan failed", err.details);
        }
        throw new Error("State scan failed");
    }
}

export async function scanCountry(payload: ScanPayload) {
    try {
        return await postScan("/scan/country", payload);
    } catch (err: unknown) {
        console.error("❌ Failed to start country scan:", err);
        if (err instanceof ScanError) {
            throw new ScanError("Country scan failed", err.details);
        }
        throw new Error("Country scan failed");
    }
}

export async function getRecentScans(city?: string, limit: number = 5): Promise<ScanHistoryEntry[]> {
    const url = new URL(`${API_BASE_URL}/query/all-scans`);
    if (city) url.searchParams.append("city", city);
    url.searchParams.append("limit", String(limit));

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to load recent scans");

    const data = await response.json();
    return data.scans;
}

export async function getMyScans(): Promise<ScanHistoryEntry[] | null> {
    try {
        const data = await authGet("/user/scans");
        return Array.isArray(data) ? data : [];
    } catch (err: unknown) {
        console.error("❌ Error in getMyScans:", err);
        return null;
    }
}

export async function getScanById(scan_id: string): Promise<ScanHistoryEntry> {
    try {
        return await authGet(`/query/scan/${scan_id}`);
    } catch (err: unknown) {
        console.error("❌ Error in getScanById:", err);
        throw new Error("Failed to fetch scan metadata");
    }
}

export async function getUserScans() {
    const res = await axios.get("/user/scans");
    return res.data;
}

export async function getUserBusinesses() {
    const res = await axios.get("/user/businesses");
    return res.data;
}
