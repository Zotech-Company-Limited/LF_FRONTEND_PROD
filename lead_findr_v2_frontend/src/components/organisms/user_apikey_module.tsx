"use client";

import { useState, useEffect } from "react";
import { getUserSettings, updateUserAccount } from "@/lib/api/user_client";
import { Loader2, EyeOff, Pencil, Save, X } from "lucide-react";
import toast from "react-hot-toast";

interface APIKeyState {
    value: string;
    editing: boolean;
}

export default function UserAPIKeyModule() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [keys, setKeys] = useState<{
        google: APIKeyState;
        gemini: APIKeyState;
        google_search_api_key: APIKeyState;
        google_search_cx: APIKeyState;
    }>({
        google: { value: "", editing: false },
        gemini: { value: "", editing: false },
        google_search_api_key: { value: "", editing: false },
        google_search_cx: { value: "", editing: false },
    });

    /* ───────────────────────────────── Load once ───────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                const s = await getUserSettings();
                setKeys({
                    google: { value: s.google_api_key || "", editing: false },
                    gemini: { value: s.gemini_api_key || "", editing: false },
                    google_search_api_key: { value: s.google_search_api_key || "", editing: false },
                    google_search_cx: { value: s.google_search_cx || "", editing: false },
                });
            } catch (err) {
                toast.error(err instanceof Error
                    ? `Failed to load API keys: ${err.message}`
                    : "Failed to load API keys.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ────────────────────────────── Handlers ───────────────────────────────── */
    const handleChange = (key: keyof typeof keys, value: string) => {
        setKeys(prev => ({
            ...prev,
            [key]: { value, editing: true },            // ← keep input open
        }));
    };

    const handleEditToggle = (key: keyof typeof keys) => {
        setKeys(prev => ({
            ...prev,
            [key]: { ...prev[key], editing: true },
        }));
    };

    const handleCancel = (key: keyof typeof keys) => {
        setKeys(prev => ({
            ...prev,
            [key]: { ...prev[key], editing: false },
        }));
    };

    const handleSave = async (key: keyof typeof keys) => {
        const newVal = keys[key].value.trim();

        if (newVal === "") {
            if (!window.confirm("Are you sure you want to delete this API key?")) return;
        }

        setSaving(true);
        try {
            const map: Record<string, string> = {
                google: "google_api_key",
                gemini: "gemini_api_key",
                google_search_api_key: "google_search_api_key",
                google_search_cx: "google_search_cx",
            };
            await updateUserAccount({ [map[key]]: newVal || null });

            setKeys(prev => ({
                ...prev,
                [key]: { value: newVal, editing: false },
            }));
            toast.success(newVal ? "Key saved successfully!" : "Key deleted.");
        } catch (err) {
            toast.error(err instanceof Error
                ? `Failed to save API key: ${err.message}`
                : "Failed to save API key");
        } finally {
            setSaving(false);
        }
    };

    /* ─────────────────────────────── UI ───────────────────────────────────── */
    if (loading) {
        return (
            <div className="p-4 text-sm text-gray-600 flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Loading keys…
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-800 shadow-sm">
            <h2 className="text-lg font-semibold mb-1">🔑 API Keys</h2>
            <p className="text-gray-500 mb-1">
                Add your own Gemini, Google Places, and Custom Search keys to scan businesses
            </p>
            <p className="text-blue-600 text-xs mb-4">
                Need help?{" "}
                <a
                    href="/setup/api-keys"
                    className="hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View setup instructions
                </a>
            </p>

            {[
                { key: "google", label: "Google Places API Key" },
                { key: "google_search_api_key", label: "Google Custom Search API Key" },
                { key: "google_search_cx", label: "Google Search CX ID" },
                { key: "gemini", label: "Gemini AI API Key" },
            ].map(({ key, label }) => {
                const cur = keys[key as keyof typeof keys];
                return (
                    <div key={key} className="mb-4">
                        <label className="block font-medium mb-1">{label}</label>

                        {cur.editing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={cur.value}
                                    onChange={e => handleChange(key as keyof typeof keys, e.target.value)}
                                    placeholder={`Enter your ${label}`}
                                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                                />
                                <button
                                    onClick={() => handleSave(key as keyof typeof keys)}
                                    className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
                                    disabled={saving}
                                    title="Save"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                </button>
                                <button
                                    onClick={() => handleCancel(key as keyof typeof keys)}
                                    className="bg-gray-300 text-gray-800 px-3 rounded hover:bg-gray-400"
                                    title="Cancel"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : cur.value ? (
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-gray-700 tracking-tight">
                                    <EyeOff size={16} className="inline-block mr-1" />
                                    ••••••••••
                                </span>
                                <button
                                    className="text-blue-600 text-xs underline"
                                    onClick={() => handleEditToggle(key as keyof typeof keys)}
                                >
                                    <Pencil size={14} className="inline-block mr-1" />
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={cur.value}
                                    onChange={e => handleChange(key as keyof typeof keys, e.target.value)}
                                    placeholder={`Enter your ${label}`}
                                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                                />
                                <button
                                    onClick={() => handleSave(key as keyof typeof keys)}
                                    className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
                                    disabled={saving}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
