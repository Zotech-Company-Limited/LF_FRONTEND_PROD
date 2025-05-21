"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/organisms/authform";
import { validateForgotPassword, ValidationResult } from "@/lib/utils/validation_auth";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState<ValidationResult["fieldErrors"]>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const handleSubmit = async (form: Record<string, string>) => {
        const { fieldErrors, formErrors } = validateForgotPassword(form.email);
        setFieldErrors(fieldErrors);
        setFormErrors(formErrors);

        if (Object.keys(fieldErrors).length || formErrors.length) return;

        try {
            await forgotPassword(form.email);
            router.push("/login");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const response = (err as { response?: { data?: { detail?: string } } }).response;
                setFormErrors([response?.data?.detail || "Failed to send reset email."]);
            } else {
                setFormErrors(["Failed to send reset email."]);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <AuthForm mode="forgot" onSubmit={handleSubmit} fieldErrors={fieldErrors} formErrors={formErrors} />
        </div>
    );
}
