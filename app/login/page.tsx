"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Enter your email and password to continue.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ email, password, remember }),
                }
            );
            if (!res.ok) {
                throw new Error("Incorrect email or password.");
            }
            // handle successful login (store token, redirect, etc.) here
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* ===== LEFT — BRAND PANEL ===== */}
            <div
                className="hidden lg:flex lg:w-[44%] relative flex-col justify-between p-12 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)",
                }}
            >
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, rgba(232,93,20,0.5) 1.5px, transparent 1.5px)",
                        backgroundSize: "28px 28px",
                    }}
                />

                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-[15px] tracking-wide">
                        UCJ
                    </span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-white font-extrabold text-[40px] leading-[1.15] mb-4 max-w-md">
                        Welcome back to <span className="text-[#e85d14]">University College</span> of Jaffna
                    </h1>
                    <p className="text-white/60 text-[14px] max-w-sm leading-relaxed">
                        Sign in to access your courses, results, and campus services in one place.
                    </p>
                </div>

                <p className="relative z-10 text-white/40 text-[12px]">
                    © {new Date().getFullYear()} University College of Jaffna. All rights reserved.
                </p>
            </div>

            {/* ===== RIGHT — FORM ===== */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f8f9fc]">
                <div className="w-full max-w-[400px]">
                    {/* Mobile-only logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-10">
                        <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center">
                            <GraduationCap size={18} className="text-white" />
                        </div>
                        <span className="text-[#0b1730] font-bold text-[15px] tracking-wide">
                            UCJ
                        </span>
                    </div>

                    <h2 className="text-[#0b1730] font-extrabold text-[26px] mb-1.5">
                        Sign in
                    </h2>
                    <p className="text-[#5a6380] text-[14px] mb-8">
                        Enter your details to access your account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-[13px] font-semibold text-[#0b1730] mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa3bd]"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@ucj.ac.lk"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-[#0b1730] placeholder:text-[#9aa3bd] outline-none focus:border-[#e85d14] focus:ring-2 focus:ring-[#e85d14]/15 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[13px] font-semibold text-[#0b1730]">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[12px] font-semibold text-[#e85d14] hover:text-[#c94e0f] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa3bd]"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-[#0b1730] placeholder:text-[#9aa3bd] outline-none focus:border-[#e85d14] focus:ring-2 focus:ring-[#e85d14]/15 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa3bd] hover:text-[#5a6380] transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#e85d14] focus:ring-[#e85d14]/30"
                            />
                            <span className="text-[13px] text-[#5a6380]">
                                Keep me signed in
                            </span>
                        </label>

                        {/* Error */}
                        {error && (
                            <p className="text-[13px] text-red-600 -mt-1">{error}</p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#e85d14] hover:bg-[#c94e0f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[14px] py-3 rounded-xl transition-colors"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <p className="text-center text-[13px] text-[#5a6380] mt-8">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[#e85d14] hover:text-[#c94e0f] transition-colors"
                        >
                            Contact administration
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}