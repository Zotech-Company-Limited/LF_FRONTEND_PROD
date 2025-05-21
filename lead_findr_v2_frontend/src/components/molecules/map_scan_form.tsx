"use client";

import HintIcon from "../molecules/hint_icon";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { scanCity, ScanPayload, ScanHistoryEntry } from "@/lib/api/scans";
import { toast } from "react-hot-toast";
import { getCurrentUserId } from "@/lib/api/auth";
import { reverseGeocode } from "@/lib/utils/reverse_geocode";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import keywordSuggestions from "../molecules/keyword_dict.json";
import ScanProgressModal from "@/components/organisms/scan_progress_modal";
import "../organisms/index.css";

const animatedComponents = makeAnimated();

interface MapScanFormProps {
    onScanComplete?: (scan: ScanHistoryEntry) => void;
    overrideLocation: {
        lat: number;
        lng: number;
    };
}

interface BackendError {
    error?: string;
    help?: string;
    missing_keys?: string[];
}

interface ScanError {
    details?: BackendError;
    message?: string;
}

type KeywordOption = { label: string; value: string };

export default function MapScanForm({ onScanComplete, overrideLocation }: MapScanFormProps) {
    const [keywords, setKeywords] = useState<KeywordOption[]>([]);
    const [dpiConcurrency, setDpiConcurrency] = useState(Math.random() < 0.5 ? 10 : 20);
    const [googlePlacesLimit, setGooglePlacesLimit] = useState(25);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    // const [backendError, setBackendError] = useState<BackendError | null>(null);
    const [regionText, setRegionText] = useState<string>("(Click Run to fetch location)");

    const [activeScanId, setActiveScanId] = useState<string | null>(null);
    const [showProgress, setShowProgress] = useState(false);

    const router = useRouter();

    // Memoized close handler to avoid effect retriggers
    const handleClose = useCallback(() => {
        setShowProgress(false);
        router.push("/businesses");
        setTimeout(() => window.location.reload(), 300);
    }, [router]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (keywords.length === 0) newErrors.keywords = "🏷️ At least one keyword is required.";
        if (!dpiConcurrency || dpiConcurrency <= 0) newErrors.dpi = "⚙️ DPI concurrency must be positive.";
        if (!googlePlacesLimit || googlePlacesLimit <= 0) newErrors.limit = "⚙️ Places limit must be positive.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getEstimatedTime = () => {
        const batches = Math.ceil(googlePlacesLimit / dpiConcurrency);
        const total = Math.max(20, batches * 25);
        const min = Math.floor(total / 60);
        const sec = total % 60;
        return min ? `${min} min ${sec}s` : `${sec}s`;
    };

    const handleScan = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setRegionText("🌐 Fetching location...");

        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                toast.error("❌ You must be logged in to run a scan.");
                return;
            }

            const geo = await reverseGeocode(overrideLocation.lat, overrideLocation.lng);
            if (!geo?.city || !geo?.state || !geo?.country) {
                throw new Error("Could not determine valid city/state/country.");
            }

            setRegionText(`${geo.city}, ${geo.state}, ${geo.country}`);
            setShowProgress(true);
            setActiveScanId(null);

            const payload: ScanPayload = {
                mode: "choice",
                region_type: "city",
                city: geo.city,
                state: geo.state,
                country: geo.country,
                keywords: keywords.map((k) => k.value),
                dpi_concurrency: dpiConcurrency,
                google_places_limit: googlePlacesLimit,
                user_id: String(userId),
                location_bias_lat: overrideLocation.lat,
                location_bias_lng: overrideLocation.lng,
            };

            const result = await scanCity(payload);
            if (!result?.scan_id) throw new Error("Scan initiation failed.");
            setActiveScanId(result.scan_id);
            toast.success(" Scan started!");
            onScanComplete?.(result);
        } catch (err: unknown) {
            setShowProgress(false);
            setRegionText("(Could not fetch location)");

            const parsed = (err as ScanError)?.details ?? {};
            const fallback = parsed.error || (err as ScanError)?.message || "❌ Scan failed.";


            // setBackendError(parsed);
            toast.error(fallback);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scan-form-container">
            <h2 className="form-title">📍 Map Scan Configuration</h2>

            <div className="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50 shadow-sm">
                <p className="text-sm font-semibold text-blue-700 mb-2">📌 Location</p>
                <p className="text-sm text-blue-900">
                    Lat: <strong>{overrideLocation.lat.toFixed(4)}</strong> | Lng:{" "}
                    <strong>{overrideLocation.lng.toFixed(4)}</strong>
                </p>
                <p className="text-sm mt-1 text-blue-700 italic">{regionText}</p>
            </div>

            <div className="form-step">
                {/* Keywords */}
                <div>
                    <label className="form-label flex items-center gap-2">
                        🏷️ Keywords
                        <HintIcon content="Select business categories you want to scan (e.g. Restaurants, Salons)." />
                    </label>
                    <CreatableSelect<KeywordOption, true>
                        components={animatedComponents}
                        isMulti
                        value={keywords}
                        onChange={(val) => setKeywords(val as KeywordOption[])}
                        placeholder="e.g., Restaurants, Salons"
                        className="react-select"
                        classNamePrefix="select"
                        options={Object.entries(keywordSuggestions).map(([value, label]) => ({ value, label }))}
                    />
                    {errors.keywords && <p className="form-error">{errors.keywords}</p>}
                </div>

                {/* DPI */}
                <div>
                    <label className="form-label flex items-center gap-2">
                        ⚙️ DPI Concurrency
                        <HintIcon content="How many businesses to score at once. Higher = faster, riskier. Max: 250" />
                    </label>
                    <input
                        type="number"
                        className="form-input"
                        value={dpiConcurrency}
                        onChange={(e) => setDpiConcurrency(Number(e.target.value))}
                        min={1}
                        max={250}
                    />
                    {errors.dpi && <p className="form-error">{errors.dpi}</p>}
                </div>

                {/* Google Places Limit */}
                <div>
                    <label className="form-label flex items-center gap-2">
                        📦 Google Places Limit
                        <HintIcon content="Number of businesses to pull from Google Places for this scan." />
                    </label>
                    <input
                        type="number"
                        className="form-input"
                        value={googlePlacesLimit}
                        onChange={(e) => setGooglePlacesLimit(Number(e.target.value))}
                        min={1}
                        max={250}
                    />
                    {errors.limit && <p className="form-error">{errors.limit}</p>}
                </div>

                {getEstimatedTime() && (
                    <p className="estimated-time">⏱ Estimated Scan Time: ~{getEstimatedTime()}</p>
                )}

                {/* Errors */}
                {/* {backendError && (
                    <div className="mt-3 bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-xl space-y-1">
                        {backendError.error && <p className="font-semibold">{backendError.error}</p>}
                        {backendError.help && <p>{backendError.help}</p>}
                        {backendError.missing_keys?.length > 0 && (
                            <ul className="list-disc list-inside ml-3">
                                {backendError.missing_keys.map((key) => (
                                    <li key={key} className="text-xs text-red-600">
                                        {key}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )} */}

                <div className="form-actions">
                    <button onClick={() => setKeywords([])} className="btn-secondary">
                        ♻️ Reset
                    </button>
                    <button onClick={handleScan} className="btn-primary" disabled={loading}>
                        {loading ? "Running..." : "🚀 Run"}
                    </button>
                </div>
            </div>

            {activeScanId && (
                <ScanProgressModal
                    scanId={activeScanId}
                    open={showProgress}
                    onClose={handleClose}
                    initialStep={1}
                />
            )}
        </div>
    );
}
