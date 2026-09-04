"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Gamepad2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Lock
} from "lucide-react";

function MinecraftLinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryIgn = searchParams.get("ign") || searchParams.get("username") || "";
  const queryEmail = searchParams.get("email") || "";

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [ign, setIgn] = useState(queryIgn);
  const [inGamePassword, setInGamePassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) return { authenticated: false };
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setUser(data.user);
          if (!ign && data.user.minecraft_username) {
            setIgn(data.user.minecraft_username);
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ign]);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!ign || ign.trim().length < 3) {
      setError("Please enter a valid Minecraft username (3-16 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/minecraft/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minecraftUsername: ign.trim(),
          inGamePassword: inGamePassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to link Minecraft account.");
      }

      setSuccessMsg(`Success! ${ign.trim()} is now connected to your Teenverse Cockpit.`);
      setTimeout(() => {
        router.push("/cockpit");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(`/minecraft/link?ign=${encodeURIComponent(ign || queryIgn)}`)}`;
  const signupRedirectUrl = `/apply?email=${encodeURIComponent(queryEmail)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#082D19] flex items-center justify-center text-[#CCFF00] flex-col space-y-3 font-mono">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-bold text-sm tracking-wider">PREPARING MINECRAFT IDENTITY SYNC...</p>
      </div>
    );
  }

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
          href="/cockpit"
          className="text-xs font-mono font-bold text-emerald-200 hover:text-[#CCFF00] flex items-center gap-1 bg-[#042113] px-3.5 py-2 rounded-xl border border-[#166B42] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cockpit Portal
        </Link>
      </header>

      {/* Main Linking Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-6">
        <div className="w-full max-w-xl bg-[#09341E] border-3 border-[#CCFF00] rounded-3xl p-6 sm:p-8 shadow-[10px_10px_0px_#03170D] space-y-6 relative">
          {/* Card Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-[#042113] rounded-2xl border-2 border-[#CCFF00] text-[#CCFF00] shadow-[3px_3px_0px_#000] mb-2">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading text-white tracking-wide">
              MINECRAFT REALM SYNC
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              Connect your Paper 1.12.2 in-game identity with your Teenverse Central ID
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-[#042113] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono font-bold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Authenticated State: Link Confirmation */}
          {user ? (
            <form onSubmit={handleLink} className="space-y-5">
              {/* Identity Pair Preview Card */}
              <div className="bg-[#042113] border-2 border-[#166B42] rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Minecraft Side */}
                <div className="flex items-center gap-3.5 border-b sm:border-b-0 sm:border-r border-[#166B42] pb-3 sm:pb-0 sm:pr-3">
                  <div className="relative w-14 h-14 rounded-xl bg-[#082D19] border-2 border-[#CCFF00] overflow-hidden flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    {ign && ign.trim().length >= 3 ? (
                      <img
                        src={`https://mc-heads.net/avatar/${encodeURIComponent(ign.trim())}/64`}
                        alt={ign}
                        className="w-12 h-12 object-contain pixelated"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Gamepad2 className="w-6 h-6 text-[#CCFF00]" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block font-bold">
                      MINECRAFT IGN
                    </span>
                    <span className="text-base font-mono font-black text-white">
                      {ign || "Enter Username"}
                    </span>
                  </div>
                </div>

                {/* Teenverse User Side */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#082D19] border-2 border-[#00F0FF] flex items-center justify-center text-lg font-black text-[#00F0FF] shrink-0">
                    {user.first_name ? user.first_name[0] : "T"}
                    {user.last_name ? user.last_name[0] : "V"}
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-wider block font-bold">
                      TEENVERSE ID
                    </span>
                    <span className="text-sm font-heading text-white truncate block">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300 truncate block">
                      {user.account_id || user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* In-Game Username Input */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  Minecraft In-Game Name (IGN)
                </label>
                <div className="relative">
                  <Gamepad2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SteveBuilder99"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    maxLength={16}
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-mono font-bold text-white placeholder-emerald-700 transition-colors"
                  />
                </div>
              </div>

              {/* In-Game Password Input (Optional initial registration) */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  Set Server Login Password <span className="text-emerald-500 font-normal lowercase">(for in-game /login)</span>
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="password"
                    placeholder="Create a strong in-game password"
                    value={inGamePassword}
                    onChange={(e) => setInGamePassword(e.target.value)}
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-mono text-white placeholder-emerald-700 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-emerald-400/80 font-mono mt-1">
                  You will type <code className="text-[#CCFF00]">/login &lt;password&gt;</code> when joining our Minecraft server.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sticker-btn py-3.5 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                    <span>Connecting Account...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Connect &amp; Sync Minecraft Username</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Unauthenticated State: Prompt to Sign In or Sign Up */
            <div className="space-y-4">
              <div className="bg-[#042113] border-2 border-[#166B42] rounded-2xl p-5 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#082D19] border-2 border-[#CCFF00] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
                  {queryIgn ? (
                    <img
                      src={`https://mc-heads.net/avatar/${encodeURIComponent(queryIgn)}/64`}
                      alt={queryIgn}
                      className="w-12 h-12 object-contain pixelated"
                    />
                  ) : (
                    <Gamepad2 className="w-8 h-8 text-[#CCFF00]" />
                  )}
                </div>
                <h3 className="text-lg font-heading text-white">
                  {queryIgn ? `Link "${queryIgn}" to Teenverse` : "Sign In to Link Minecraft"}
                </h3>
                <p className="text-xs text-emerald-200">
                  Please log in to your Teenverse account or create a free membership to link your in-game player profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href={loginRedirectUrl}
                  className="sticker-btn py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000] text-center"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Log In (OTP)</span>
                </Link>

                <Link
                  href={signupRedirectUrl}
                  className="bg-[#042113] hover:bg-[#073620] text-white border-2 border-[#00F0FF] py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#00F0FF]/40 text-center transition-all"
                >
                  <User className="w-4 h-4 text-[#00F0FF]" />
                  <span>Sign Up &rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs font-mono text-emerald-400/60">
        © 2026 TEENVERSE PAKISTAN • Minecraft Realm Integration
      </footer>
    </div>
  );
}

export default function MinecraftLinkPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#082D19] flex items-center justify-center text-[#CCFF00]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <MinecraftLinkContent />
    </Suspense>
  );
}
