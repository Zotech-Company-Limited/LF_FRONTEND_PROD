"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/organisms/authform";
import { validateResetPassword, ValidationResult } from "@/lib/utils/validation_auth";
import axios from "@/lib/axios";

interface AxiosErrorResponse {
    response?: {
        data?: {
            detail?: string;
        };
    };
}

export default function ResetPasswordClient() {
    const router = useRouter();
    // Access the token via dynamic route parameters
    const { token } = useParams() as { token: string };

    const [fieldErrors, setFieldErrors] = useState<ValidationResult["fieldErrors"]>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (form: Record<string, string>) => {
        const { fieldErrors, formErrors } = validateResetPassword(form.password, form.confirm);
        setFieldErrors(fieldErrors);
        setFormErrors(formErrors);

        if (Object.keys(fieldErrors).length || formErrors.length) return;

        setSubmitting(true);
        try {
            await axios.post("/auth/reset-password-token", {
                token,
                password: form.password,
                confirm: form.confirm,
            });

            router.push("/login");
        } catch (err) {
            const error = err as AxiosErrorResponse;
            const message = error.response?.data?.detail || "Failed to reset password";
            setFormErrors([message]);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <AuthForm
                mode="reset"
                resetToken={token}
                onSubmit={handleSubmit}
                fieldErrors={fieldErrors}
                formErrors={formErrors}
                loading={submitting}
            />
        </div>
    );
}
