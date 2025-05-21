"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/api/auth";
import { createCheckoutSession } from "@/lib/api/billing_client";
import AuthForm from "@/components/organisms/authform";
import { validateSignup, ValidationResult } from "@/lib/utils/validation_auth";
import toast from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState<ValidationResult["fieldErrors"]>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    const handleSubmit = async (form: Record<string, string>) => {
        const { fieldErrors, formErrors } = validateSignup(form.email, form.password, form.confirm);
        setFieldErrors(fieldErrors);
        setFormErrors(formErrors);

        if (Object.keys(fieldErrors).length || formErrors.length) return;

        const res = await register({
            name: form.name,
            email: form.email,
            password: form.password,
        });

        if (res.errors) {
            setFormErrors(Array.isArray(res.errors) ? res.errors : [res.errors]);
            return;
        }

        localStorage.setItem("token", res.access_token);

        const pendingPlan = localStorage.getItem("pending_checkout_plan");
        const pendingCycle = localStorage.getItem("pending_checkout_cycle");

        if (pendingPlan && pendingCycle) {
            setLoadingCheckout(true);
            localStorage.removeItem("pending_checkout_plan");
            localStorage.removeItem("pending_checkout_cycle");

            try {
                const checkout = await createCheckoutSession(
                    pendingPlan as "starter" | "pro" | "growth",
                    pendingCycle as "monthly" | "yearly"
                );
                window.location.href = checkout.url;
                return;
            } catch {
                toast.error("Redirect to checkout failed.");
                router.push("/");
            } finally {
                setLoadingCheckout(false);
            }
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <AuthForm
                mode="signup"
                onSubmit={handleSubmit}
                fieldErrors={fieldErrors}
                formErrors={formErrors}
                loading={loadingCheckout}
            />
        </div>
    );
}
