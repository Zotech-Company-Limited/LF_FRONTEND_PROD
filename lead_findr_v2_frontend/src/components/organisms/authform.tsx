"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type Mode = "login" | "signup" | "forgot" | "reset";

interface AuthFormProps {
    mode: Mode;
    onSubmit: (form: Record<string, string>) => void;
    resetToken?: string;
    fieldErrors?: Partial<Record<"email" | "password" | "confirm" | "name", string[]>>;
    formErrors?: string[];
    loading?: boolean;
}

export default function AuthForm({
    mode,
    onSubmit,
    resetToken,
    fieldErrors = {},
    formErrors = [],
    loading = false,
}: AuthFormProps) {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
        token: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form };
        if (mode === "reset" && resetToken) {
            payload.token = resetToken;
        }
        onSubmit(payload);
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-semibold text-center mb-6">
                {{
                    login: "Login",
                    signup: "Create Account",
                    forgot: "Forgot Password",
                    reset: "Reset Password",
                }[mode]}
            </h2>

            {formErrors.length > 0 && (
                <div className="bg-red-100 border border-red-300 p-3 rounded mb-4">
                    {formErrors.map((msg, i) => (
                        <p key={i} className="text-sm text-red-700">{msg}</p>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            autoComplete="name"
                        />
                        {fieldErrors?.name?.map((msg, i) => (
                            <p key={i} className="text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>
                )}

                {(mode === "login" || mode === "signup" || mode === "forgot") && (
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            autoComplete="email"
                        />
                        {fieldErrors?.email?.map((msg, i) => (
                            <p key={i} className="text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>
                )}

                {mode !== "forgot" && (
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldErrors?.password?.map((msg, i) => (
                            <p key={i} className="text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>
                )}

                {(mode === "signup" || mode === "reset") && (
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirm"
                            placeholder="Confirm Password"
                            value={form.confirm}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-black"
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
                            <p key={i} className="text-xs text-red-600 mt-1">{msg}</p>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 text-white rounded font-medium bg-black hover:bg-gray-900 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? (
                        <Loader2 className="animate-spin mx-auto" />
                    ) : (
                        {
                            login: "Login",
                            signup: "Create Account",
                            forgot: "Send Reset Link",
                            reset: "Reset Password",
                        }[mode]
                    )}
                </button>
            </form>

            <div className="text-sm text-center mt-5 text-gray-600 space-y-1">
                {mode === "login" && (
                    <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
                        <button
                            type="button"
                            onClick={() => router.push("/forgot-password")}
                            className="underline"
                        >
                            Forgot password?
                        </button>
                        <span className="text-gray-400">|</span>
                        <div>
                            Don’t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/signup")}
                                className="underline text-black"
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                )}
                {mode === "signup" && (
                    <div>
                        Already have account?{" "}
                        <button type="button" onClick={() => router.push("/login")} className="underline text-black">
                            Login
                        </button>
                    </div>
                )}
                {(mode === "forgot" || mode === "reset") && (
                    <div>
                        <button type="button" onClick={() => router.push("/login")} className="underline text-black">
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
