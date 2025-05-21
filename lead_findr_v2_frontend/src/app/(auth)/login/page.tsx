"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "@/lib/api/auth";
import AuthForm from "@/components/organisms/authform";
import { validateLogin, ValidationResult } from "@/lib/utils/validation_auth";
import { clearUserSession } from "@/lib/session/user_session";
import { useUser } from "@/lib/api/swr";


export default function LoginPage() {
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState<ValidationResult["fieldErrors"]>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isLoading } = useUser();

    const handleSubmit = async (form: Record<string, string>) => {
        const { fieldErrors, formErrors } = validateLogin(form.email, form.password);
        setFieldErrors(fieldErrors);
        setFormErrors(formErrors);

        if (Object.keys(fieldErrors).length || formErrors.length) return;

        setLoading(true);
        const res = await login({ email: form.email, password: form.password });

        if ("errors" in res) {
            setFormErrors(Array.isArray(res.errors) ? res.errors : [res.errors]);
            setLoading(false);
            return;
        }

        clearUserSession();
    };

    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user, isLoading, router]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <AuthForm
                mode="login"
                onSubmit={handleSubmit}
                fieldErrors={fieldErrors}
                formErrors={formErrors}
                loading={loading}
            />
        </div>
    );
}
