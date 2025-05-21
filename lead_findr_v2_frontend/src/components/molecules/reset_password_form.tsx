"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axios from "@/lib/axios";
import { resetPassword } from "@/lib/api/auth";
import { validateChangePassword, ValidationResult } from "@/lib/utils/validation_auth";
import "../../app/(protected)/settings/settings.css";

export default function ResetPasswordForm() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<ValidationResult["fieldErrors"]>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const verifyCurrentPassword = async () => {
        try {
            setLoading(true);
            setFieldErrors({});
            setFormErrors([]);

            const res = await axios.post("/auth/verify-password", {
                password: form.currentPassword,
            });

            if (res.data?.errors) {
                setFormErrors(res.data.errors);
                return;
            }

            if (res.data?.success) {
                toast.success("🔐 Current password verified");
                setStep(2);
            }
        } catch (err: unknown) {
            if (typeof err === "object" && err !== null && "response" in err) {
                const res = (err as { response?: { data?: { errors?: string[]; detail?: string } } }).response;
                const apiError = res?.data?.errors;
                if (apiError) {
                    setFormErrors(apiError);
                } else {
                    toast.error(res?.data?.detail || "Failed to update password.");
                }
            } else {
                toast.error("Failed to update password.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { fieldErrors, formErrors } = validateChangePassword(
            form.currentPassword,
            form.newPassword,
            form.confirmPassword
        );
        setFieldErrors(fieldErrors);
        setFormErrors(formErrors);

        if (Object.keys(fieldErrors).length > 0 || formErrors.length > 0) return;

        try {
            setLoading(true);
            await resetPassword({
                current_password: form.currentPassword,
                new_password: form.newPassword,
            });

            toast.success(" Password updated.");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setStep(1);
            setFieldErrors({});
            setFormErrors([]);
        } catch (err: unknown) {
            if (typeof err === "object" && err !== null && "response" in err) {
                const res = (err as { response?: { data?: { errors?: string[] } } }).response;
                const apiError = res?.data?.errors;
                if (apiError) {
                    setFormErrors(apiError);
                } else {
                    toast.error("❌ Failed to verify password.");
                }
            } else {
                toast.error("❌ Failed to verify password.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="reset-form space-y-6" onSubmit={handleSubmit}>
            <h3 className="reset-title text-xl font-semibold text-gray-900">
                Change Password
            </h3>

            {formErrors.length > 0 && (
                <div className="auth-error-box bg-red-100 border border-red-300 p-3 rounded">
                    {formErrors.map((msg, i) => (
                        <p key={i} className="auth-error text-sm text-red-700">{msg}</p>
                    ))}
                </div>
            )}

            {step === 1 && (
                <>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            name="currentPassword"
                            placeholder="Current Password"
                            value={form.currentPassword}
                            onChange={(e) => handleChange("currentPassword", e.target.value)}
                            className="auth-input w-full px-4 py-2 border rounded pr-10"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldErrors?.password?.map((msg, i) => (
                            <p key={i} className="auth-error text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={verifyCurrentPassword}
                        disabled={loading}
                        className="auth-button w-full bg-black text-white py-2 rounded hover:bg-gray-900"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Verify Password"}
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            name="newPassword"
                            placeholder="New Password"
                            value={form.newPassword}
                            onChange={(e) => handleChange("newPassword", e.target.value)}
                            className="auth-input w-full px-4 py-2 border rounded pr-10"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldErrors?.password?.map((msg, i) => (
                            <p key={i} className="auth-error text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={form.confirmPassword}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            className="auth-input w-full px-4 py-2 border rounded pr-10"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldErrors?.confirm?.map((msg, i) => (
                            <p key={i} className="auth-error text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button w-full bg-black text-white py-2 rounded hover:bg-gray-900"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Update Password"}
                    </button>
                </>
            )}
        </form>
    );
}
