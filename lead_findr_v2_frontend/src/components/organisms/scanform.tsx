"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scanCity, ScanPayload, ScanHistoryEntry } from "@/lib/api/scans";
import { toast } from "react-hot-toast";
import { getCurrentUserId } from "../../lib/api/auth";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import keywordSuggestions from "../molecules/keyword_dict.json";
import HintIcon from "../molecules/hint_icon";
import LocationInputSwitcher from "../molecules/location_input_switcher";
import { useUser } from "@/lib/api/swr";
import dynamic from "next/dynamic";
const ScanProgressModal = dynamic(() => import("@/components/organisms/scan_progress_modal"), { ssr: false });

import "./index.css";

export default function ScanForm({ onScanComplete }: { onScanComplete?: (scan: ScanHistoryEntry) => void }) {
    type KeywordOption = { label: string; value: string };

    const { user, isLoading } = useUser();
    const plan = user?.plan ?? "free";
    const scanUsage = user?.scan_usage ?? 0;
    const scanLimit = user?.scan_limit ?? 50;
    const scanRemaining = Math.max(0, scanLimit - scanUsage);
    const dpiMax = plan === "free" ? 50 : 250;
    const googleLimitMax = Math.min(scanRemaining, 250);

    const [showProgress, setShowProgress] = useState(false);
    const [activeScanId, setActiveScanId] = useState<string | null>(null);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [keywords, setKeywords] = useState<KeywordOption[]>([]);
    const [dpiConcurrency, setDpiConcurrency] = useState(Math.random() < 0.5 ? 10 : 20);
    const [googlePlacesLimit, setGooglePlacesLimit] = useState(25);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const animatedComponents = makeAnimated();
    const router = useRouter();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!city || !state || !country) newErrors.location = "📍 Location is required.";
        if (keywords.length === 0) newErrors.keywords = "🏷️ At least one keyword is required.";
        if (!dpiConcurrency || dpiConcurrency <= 0) newErrors.dpi = "⚙️ DPI concurrency must be positive.";
        if (!googlePlacesLimit || googlePlacesLimit <= 0) newErrors.limit = "⚙️ Places limit must be positive.";
        if (googlePlacesLimit > scanRemaining) {
            newErrors.limit = `❌ You can only scan ${scanRemaining} more businesses this month.`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getEstimatedTime = () => {
        if (!dpiConcurrency || !googlePlacesLimit) return null;
        const batches = Math.ceil(googlePlacesLimit / dpiConcurrency);
        const timePerBatch = 25;
        const minTime = 20;
        const totalSeconds = Math.max(minTime, batches * timePerBatch);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
        if (minutes > 0) parts.push(`${minutes} min`);
        if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);

        return `Estimated Scan Time: ~${parts.join(" ")}`;
    };

    const handleScan = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                toast.error("❌ You must be logged in to run a scan.");
                return;
            }

            setActiveScanId(null);
            setShowProgress(true);

            const payload: ScanPayload = {
                mode: "choice",
                region_type: "city",
                city,
                state,
                country,
                keywords: keywords.map((k) => k.value),
                dpi_concurrency: dpiConcurrency,
                google_places_limit: googlePlacesLimit,
                user_id: String(userId),
                location_bias_lat: lat ?? undefined,
                location_bias_lng: lng ?? undefined,
            };

            const result = await scanCity(payload);
            if (!result?.scan_id) throw new Error("Scan initiation failed.");

            setActiveScanId(result.scan_id);
            toast.success(" Scan started!");
            onScanComplete?.(result);
        } catch (err: unknown) {
            setShowProgress(false);
            let message = "❌ Scan failed.";
            if (err instanceof Error && err.message) {
                message += ` ${err.message}`;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCity("");
        setState("");
        setCountry("");
        setLat(null);
        setLng(null);
        setKeywords([]);
        setDpiConcurrency(Math.random() < 0.5 ? 10 : 20);
        setGooglePlacesLimit(25);
        setErrors({});
    };

    const keywordOptions = Object.entries(keywordSuggestions).map(([value, label]) => ({
        value,
        label,
    }));

    if (isLoading) return <div className="p-6 text-gray-500">Loading form...</div>;

    return (
        <div className="scan-form-container">
            <h2 className="form-title">📊 Scan Configuration</h2>

            <div className="form-step">
                {/* 📍 Location */}
                <div>
                    <label className="form-label flex items-center gap-2">
                        📍 Location
                        <HintIcon content="Select the city, state, and country to target for your scan." />
                    </label>
                    <LocationInputSwitcher
                        onSelect={({ city, state, country, lat, lng }) => {
                            setCity(city);
                            setState(state);
                            setCountry(country);
                            setLat(lat ?? null);
                            setLng(lng ?? null);
                        }}
                        error={errors.location}
                    />
                </div>

                {/* 🏷️ Keywords */}
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
                        options={keywordOptions}
                    />
                    {errors.keywords && <p className="form-error">{errors.keywords}</p>}
                </div>

                {/* ⚙️ DPI Concurrency */}
                <div>
                    <label className="form-label flex items-center gap-2">
                        ⚙️ DPI Concurrency
                        <HintIcon content="How many businesses to score at once. Higher = faster, riskier. Max: 250" />
                    </label>
                    <input
                        type="number"
                        className="form-input"
                        value={dpiConcurrency}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value <= dpiMax) setDpiConcurrency(value);
                        }}
                        min={1}
                        max={dpiMax}
                    />
                    <p className="form-note text-sm text-gray-500 mt-1">
                        {plan === "free"
                            ? "Free plan: Max 50 businesses scored at once."
                            : `You can set up to ${dpiMax} concurrent scoring jobs.`}
                    </p>
                    {errors.dpi && <p className="form-error">{errors.dpi}</p>}
                </div>

                {/* 📦 Google Places Limit */}
                <div>
                    <label className="form-label flex items-center gap-2">
                        📦 Google Places Limit
                        <HintIcon content="Number of businesses to pull from Google Places for this scan." />
                    </label>
                    <input
                        type="number"
                        className="form-input"
                        value={googlePlacesLimit}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value <= googleLimitMax) setGooglePlacesLimit(value);
                        }}
                        min={1}
                        max={googleLimitMax}
                    />
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${(scanUsage / scanLimit) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-600">
                        Usage: {scanUsage}/{scanLimit} — You can scan up to {scanRemaining} more.
                    </p>
                    {errors.limit && <p className="form-error">{errors.limit}</p>}

                    {scanRemaining <= 0 && (
                        <div className="text-sm text-red-600 mt-2">
                            🚫 You&apos;ve reached your monthly scan limit.
                            <a href="/pricing" className="text-blue-600 underline ml-1">Upgrade your plan</a> to get more scans.
                        </div>
                    )}
                </div>

                {/* ⏱ Estimated Time */}
                {getEstimatedTime() && (
                    <p className="estimated-time">
                        ⏱ {getEstimatedTime()}
                    </p>
                )}

                {/* Actions */}
                <div className="form-actions">
                    <button onClick={handleReset} className="btn-secondary">
                        ♻️ Reset
                    </button>
                    <button
                        onClick={handleScan}
                        className="btn-primary"
                        disabled={loading || scanRemaining <= 0}
                    >
                        {loading ? "Running..." : "🚀 Run"}
                    </button>

                    {activeScanId && (
                        <ScanProgressModal
                            scanId={activeScanId}
                            open={showProgress}
                            onClose={() => {
                                setShowProgress(false);
                                router.push("/businesses");
                                setTimeout(() => window.location.reload(), 300);
                            }}
                            initialStep={1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
