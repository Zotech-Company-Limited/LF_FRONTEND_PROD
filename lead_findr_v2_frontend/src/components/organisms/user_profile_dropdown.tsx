"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import "../../styles/prof_down.css";
import toast from "react-hot-toast";

interface Props {
    fullName: string;
    email: string;
    phone: string;
    username: string;
    updateUserProfile: (fields: {
        fullName: string;
        email: string;
        phone: string;
        username: string;
    }) => void;
}

export default function ProfileDropdown({
    fullName,
    email,
    phone,
    username,
    updateUserProfile,
}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        fullName: fullName ?? "",
        email: email ?? "",
        phone: phone ?? "",
        username: username ?? "",
    });

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUserProfile(form);
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (err) {
            console.error("❌ Failed to update profile:", err);
            toast.error("Update failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            fullName: fullName ?? "",
            email: email ?? "",
            phone: phone ?? "",
            username: username ?? "",
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                {!isEditing && (
                    <button
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={() => setIsEditing(true)}
                        title="Edit profile"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {[
                    { field: "fullName", label: "Full Name" },
                    { field: "email", label: "Email" },
                    { field: "phone", label: "Phone" },
                    { field: "username", label: "Username" },
                ].map(({ field, label }) => (
                    <div key={field} className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">{label}:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={form[field as keyof typeof form] ?? ""}
                                onChange={(e) => handleChange(field as keyof typeof form, e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <span className="text-gray-900">
                                {form[field as keyof typeof form] || "—"}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="mt-6 flex gap-3">
                    <button
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <span className="flex items-center gap-1 animate-pulse">
                                <Check size={16} /> Saving…
                            </span>
                        ) : (
                            <>
                                <Check size={16} /> Save
                            </>
                        )}
                    </button>
                    <button
                        className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        <X size={16} /> Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
