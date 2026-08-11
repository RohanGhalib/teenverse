"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Mail, ArrowRight, CheckCircle2, ShieldCheck, Loader2, Sparkles, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/cockpit";

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push(redirectParam);
        }
      })
      .catch(() => {});
  }, [router, redirectParam]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP code.");
      }

      setMessage(data.message || `OTP verification code sent to ${email}`);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code.");
      }

      if (data.isNewUser) {
        // User verified email but needs to complete application/profile
        router.push(`/apply?email=${encodeURIComponent(email)}`);
        return;
      }

      setMessage("Authentication successful! Loading Cockpit...");
      setTimeout(() => {
        router.push(redirectParam);
      }, 800);
    } catch (err: any) {
      setError(err.message || "An error occurred verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#082D19] text-[#F0FFF4] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#CCFF00] selection:text-[#042113]">
      {/* Background Decor Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-36 h-10">
            <Image
              src="/logo.png"
              alt="TEENVERSE Logo"
              fill
              className="object-contain drop-shadow-[2px_3px_0px_#042113]"
              priority
            />
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs font-mono font-bold text-emerald-200 hover:text-[#CCFF00] flex items-center gap-1 bg-[#042113] px-3 py-1.5 rounded-xl border border-[#166B42] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back Home
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md bg-[#09341E] border-3 border-[#CCFF00] rounded-3xl p-6 sm:p-8 shadow-[10px_10px_0px_#03170D] space-y-6 relative">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-[#042113] rounded-2xl border-2 border-[#CCFF00] text-[#CCFF00] shadow-[3px_3px_0px_#000] mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading text-white tracking-wide">
              TEENVERSE ACCOUNT
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              Sign in using Passwordless 6-Digit Email OTP
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono font-bold flex items-start gap-2 animate-shake">
              <span className="shrink-0 text-red-400">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3.5 rounded-xl bg-[#042113] border border-[#CCFF00]/60 text-[#CCFF00] text-xs font-mono font-bold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  Teenverse Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sticker-btn py-3.5 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Code Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[10px] font-mono text-[#00F0FF] underline hover:opacity-80 cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                <div className="relative">
                  <ShieldCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCFF00]" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#042113] border-2 border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-center font-mono font-black text-xl tracking-[6px] text-[#CCFF00] placeholder-emerald-700 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sticker-btn py-3.5 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Access Teenverse Cockpit</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Info footer */}
          <div className="pt-4 border-t border-[#166B42] text-center space-y-2">
            <p className="text-xs text-emerald-300">
              Don&apos;t have a Teenverse Account yet?
            </p>
            <Link
              href="/apply"
              className="inline-block text-xs font-mono font-bold text-[#00F0FF] underline hover:text-[#CCFF00] transition-colors"
            >
              Apply to Join Teenverse Squad &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs font-mono text-emerald-400/60">
        © 2026 TEENVERSE PAKISTAN • Central Identity Provider (SSO)
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#082D19] flex items-center justify-center text-[#CCFF00]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
