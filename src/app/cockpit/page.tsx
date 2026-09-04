"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Award,
  Calendar,
  FileText,
  LogOut,
  QrCode,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  Building,
  GraduationCap,
  MapPin,
  Upload,
  AlertCircle,
  Gamepad2,
  Lock,
  Key,
  RefreshCw
} from "lucide-react";

interface UserProfile {
  id: string;
  account_id: string;
  email: string;
  first_name: string;
  last_name: string;
  father_name?: string;
  city: string;
  province?: string;
  education_level?: string;
  institute_name?: string;
  primary_domain: string;
  is_verified_student?: boolean;
  minecraft_username?: string;
  minecraft_linked_at?: string;
  roles?: string[];
  role?: string;
  created_at?: string;
}

interface ApplicationRecord {
  id: string;
  application_ref: string;
  primary_domain: string;
  application_status: string;
  reviewer_notes?: string;
  submitted_at: string;
  why_join?: string;
  skills_and_mastery?: string;
}

interface EventRegistrationRecord {
  id: string;
  registration_ref: string;
  team_name?: string;
  team_role?: string;
  events?: {
    name: string;
    slug: string;
    subdomain: string;
    start_date: string;
  };
}

export default function CockpitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [events, setEvents] = useState<EventRegistrationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"id" | "minecraft" | "applications" | "events" | "badges">("id");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedServerIp, setCopiedServerIp] = useState(false);
  const [reuploadLoading, setReuploadLoading] = useState(false);
  const [reuploadSuccess, setReuploadSuccess] = useState<string | null>(null);
  const [reuploadError, setReuploadError] = useState<string | null>(null);

  // Minecraft Management State
  const [mcIgnInput, setMcIgnInput] = useState("");
  const [mcPasswordInput, setMcPasswordInput] = useState("");
  const [mcActionLoading, setMcActionLoading] = useState(false);
  const [mcSuccessMsg, setMcSuccessMsg] = useState<string | null>(null);
  const [mcErrorMsg, setMcErrorMsg] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/cockpit");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
          setApplications(data.applications || []);
          setEvents(data.events || []);
        } else {
          router.push("/login?redirect=/cockpit");
        }
      })
      .catch((err) => {
        console.error("Failed to load cockpit data:", err);
        router.push("/login?redirect=/cockpit");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const copyAccountId = () => {
    if (user?.account_id) {
      navigator.clipboard.writeText(user.account_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleDocumentReupload = async (appId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setReuploadLoading(true);
    setReuploadSuccess(null);
    setReuploadError(null);

    try {
      // 1. Upload file to storage
      const uploadData = new FormData();
      uploadData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok || !uploadResult.url) {
        throw new Error(uploadResult.error || "Failed to upload document file.");
      }

      // 2. Call reupload endpoint to update application and user record
      const reuploadRes = await fetch("/api/applications/reupload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          studentProofUrl: uploadResult.url,
          studentProofName: file.name,
        }),
      });

      const reuploadResult = await reuploadRes.json();
      if (!reuploadRes.ok) {
        throw new Error(reuploadResult.error || "Failed to update application status.");
      }

      setReuploadSuccess(`Document "${file.name}" uploaded successfully! Your application is now back under active review 🟢`);

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, application_status: "under_review", reviewer_notes: "Document re-uploaded. Pending re-evaluation." }
            : app
        )
      );
    } catch (err: any) {
      setReuploadError(err.message || "Failed to re-upload document.");
    } finally {
      setReuploadLoading(false);
    }
  };

  const copyServerAddress = () => {
    navigator.clipboard.writeText("play.teenverse.org");
    setCopiedServerIp(true);
    setTimeout(() => setCopiedServerIp(false), 2000);
  };

  const handleLinkMinecraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcIgnInput || mcIgnInput.trim().length < 3) {
      setMcErrorMsg("Please enter a valid Minecraft username (3-16 characters).");
      return;
    }

    setMcActionLoading(true);
    setMcSuccessMsg(null);
    setMcErrorMsg(null);

    try {
      const res = await fetch("/api/minecraft/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minecraftUsername: mcIgnInput.trim(),
          inGamePassword: mcPasswordInput || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to link Minecraft account.");
      }

      setMcSuccessMsg(`Minecraft account ${data.minecraftUsername} linked successfully!`);
      setUser((prev) => (prev ? { ...prev, minecraft_username: data.minecraftUsername, minecraft_linked_at: new Date().toISOString() } : null));
      setMcIgnInput("");
      setMcPasswordInput("");
    } catch (err: any) {
      setMcErrorMsg(err.message || "Failed to connect Minecraft account.");
    } finally {
      setMcActionLoading(false);
    }
  };

  const handleUnlinkMinecraft = async () => {
    if (!confirm("Are you sure you want to disconnect your Minecraft username from your Teenverse profile?")) return;

    setMcActionLoading(true);
    setMcSuccessMsg(null);
    setMcErrorMsg(null);

    try {
      const res = await fetch("/api/minecraft/unlink", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to unlink account.");
      }

      setMcSuccessMsg("Minecraft account successfully disconnected.");
      setUser((prev) => (prev ? { ...prev, minecraft_username: undefined, minecraft_linked_at: undefined } : null));
    } catch (err: any) {
      setMcErrorMsg(err.message || "Failed to unlink Minecraft account.");
    } finally {
      setMcActionLoading(false);
    }
  };

  const handleUpdateMinecraftPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setMcErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setMcActionLoading(true);
    setMcSuccessMsg(null);
    setMcErrorMsg(null);

    try {
      const res = await fetch("/api/minecraft/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPasswordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setMcSuccessMsg("In-game server password updated! You can now use it with /login.");
      setShowPasswordModal(false);
      setNewPasswordInput("");
    } catch (err: any) {
      setMcErrorMsg(err.message || "Failed to update server password.");
    } finally {
      setMcActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#082D19] flex items-center justify-center text-[#CCFF00] space-y-4 flex-col font-sans">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-mono text-sm tracking-wider font-bold">LOADING TEENVERSE COCKPIT...</p>
      </div>
    );
  }

  if (!user) return null;

  const roles = user.roles || (user.role ? [user.role] : ["teen_member"]);

  return (
    <div className="min-h-screen bg-[#082D19] text-[#F0FFF4] flex flex-col font-sans selection:bg-[#CCFF00] selection:text-[#042113]">
      {/* Top Cockpit Header Navbar */}
      <header className="bg-[#042113] border-b-3 border-[#166B42] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-32 h-9">
                <Image
                  src="/logo.png"
                  alt="TEENVERSE Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <span className="hidden sm:inline-block bg-[#CCFF00] text-[#042113] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#042113]">
              COCKPIT v2.6
            </span>
          </div>

          {/* User ID & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#09341E] border border-[#166B42] px-3 py-1.5 rounded-xl font-mono text-xs text-[#CCFF00] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              <span>{user.account_id}</span>
              <button
                onClick={copyAccountId}
                className="hover:text-white transition-colors cursor-pointer ml-1"
                title="Copy Account ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-mono font-bold px-3 py-2 rounded-xl border border-red-700/60 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Cockpit Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* User Greeting & Status Banner */}
        <div className="bg-[#09341E] border-3 border-[#CCFF00] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#03170D] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#042113] text-[#00F0FF] text-[11px] font-mono font-black px-3 py-1 rounded-lg border border-[#00F0FF]/40 uppercase tracking-wider">
                ⚡ {user.primary_domain || "TEENVERSE MEMBER"}
              </span>
              {roles.map((r) => (
                <span
                  key={r}
                  className="bg-[#CCFF00] text-[#042113] text-[10px] font-mono font-black px-2.5 py-0.5 rounded uppercase tracking-wide"
                >
                  {r.replace("_", " ")}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-wide">
              Welcome back, {user.first_name}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium">
              Manage your Teenverse Account, applications, events, and connected apps from your central cockpit.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              href="/apply"
              className="sticker-btn px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
            >
              <Zap className="w-4 h-4 text-[#042113] fill-[#042113]" />
              <span>Apply to Domain</span>
            </Link>
          </div>
        </div>

        {/* Cockpit Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b-2 border-[#166B42] pb-3">
          <button
            onClick={() => setActiveTab("id")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "id"
                ? "bg-[#CCFF00] text-[#042113] font-black border-2 border-[#042113] shadow-[3px_3px_0px_#042113]"
                : "bg-[#042113] text-emerald-200 border border-[#166B42] hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Digital ID Card</span>
          </button>

          <button
            onClick={() => setActiveTab("minecraft")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "minecraft"
                ? "bg-[#CCFF00] text-[#042113] font-black border-2 border-[#042113] shadow-[3px_3px_0px_#042113]"
                : "bg-[#042113] text-emerald-200 border border-[#166B42] hover:text-white"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Minecraft Realm {user.minecraft_username ? "🟢" : ""}</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "applications"
                ? "bg-[#CCFF00] text-[#042113] font-black border-2 border-[#042113] shadow-[3px_3px_0px_#042113]"
                : "bg-[#042113] text-emerald-200 border border-[#166B42] hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-[#CCFF00] text-[#042113] font-black border-2 border-[#042113] shadow-[3px_3px_0px_#042113]"
                : "bg-[#042113] text-emerald-200 border border-[#166B42] hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events &amp; Hackathons</span>
          </button>

          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "badges"
                ? "bg-[#CCFF00] text-[#042113] font-black border-2 border-[#042113] shadow-[3px_3px_0px_#042113]"
                : "bg-[#042113] text-emerald-200 border border-[#166B42] hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Roles &amp; Badges</span>
          </button>
        </div>

        {/* Tab 1: Digital ID Card */}
        {activeTab === "id" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Digital ID Card Visual */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#09341E] via-[#042113] to-[#0D482B] border-4 border-[#CCFF00] rounded-3xl p-6 shadow-[10px_10px_0px_#03170D] space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#166B42] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#CCFF00] animate-pulse" />
                    <span className="font-mono text-xs font-black uppercase text-[#CCFF00]">TEENVERSE DIGITAL ID</span>
                  </div>
                  <span className="bg-[#00F0FF] text-[#042113] text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    OFFICIAL
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#042113] border-2 border-[#CCFF00] flex items-center justify-center text-2xl font-black text-[#CCFF00] shadow-[3px_3px_0px_#000]">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading text-white">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-xs font-mono text-emerald-300 font-bold">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-[#00F0FF] font-mono font-bold mt-1">
                        ID: {user.account_id}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#042113] border border-[#166B42] rounded-2xl p-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-emerald-400">Primary Domain:</span>
                      <span className="text-white font-bold">{user.primary_domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400">City:</span>
                      <span className="text-white font-bold">{user.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400">Student Proof:</span>
                      <span className="text-[#CCFF00] font-bold">
                        {user.is_verified_student ? "VERIFIED 🟢" : "PENDING REVIEW 🟡"}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="bg-white rounded-2xl p-4 text-center space-y-2 shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-center p-2">
                      <QrCode className="w-32 h-32 text-[#042113]" />
                    </div>
                    <p className="text-[10px] font-mono font-black text-[#042113] uppercase tracking-wider">
                      SCAN FOR ON-SITE HACKATHON &amp; EVENT CHECK-IN
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Overview Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_#03170D]">
                <h2 className="text-xl font-heading text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#CCFF00]" />
                  <span>Account &amp; Student Credentials</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42]">
                    <span className="text-emerald-400 block text-[10px] uppercase">Full Name</span>
                    <span className="text-white font-bold text-sm">{user.first_name} {user.last_name}</span>
                  </div>

                  <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42]">
                    <span className="text-emerald-400 block text-[10px] uppercase">Father / Guardian Name</span>
                    <span className="text-white font-bold text-sm">{user.father_name || "N/A"}</span>
                  </div>

                  <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42]">
                    <span className="text-emerald-400 block text-[10px] uppercase">Education Level</span>
                    <span className="text-white font-bold text-sm">{user.education_level || "High School / College"}</span>
                  </div>

                  <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42]">
                    <span className="text-emerald-400 block text-[10px] uppercase">School / Institute</span>
                    <span className="text-white font-bold text-sm">{user.institute_name || "N/A"}</span>
                  </div>

                  <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42]">
                    <span className="text-emerald-400 block text-[10px] uppercase">City &amp; Province</span>
                    <span className="text-white font-bold text-sm">{user.city}, {user.province || "Pakistan"}</span>
                  </div>

                  <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42]">
                    <span className="text-emerald-400 block text-[10px] uppercase">Account Created</span>
                    <span className="text-[#CCFF00] font-bold text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Active Member"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Minecraft Realm */}
        {activeTab === "minecraft" && (
          <div className="space-y-6">
            {/* Feedback Alerts */}
            {mcSuccessMsg && (
              <div className="p-4 bg-[#042113] border-2 border-[#CCFF00] rounded-2xl text-xs font-mono font-bold text-[#CCFF00] flex items-center justify-between gap-3 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0" />
                  <span>{mcSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setMcSuccessMsg(null)}
                  className="text-xs hover:text-white cursor-pointer px-2 py-0.5"
                >
                  ✕
                </button>
              </div>
            )}

            {mcErrorMsg && (
              <div className="p-4 bg-red-950/90 border-2 border-red-500 rounded-2xl text-xs font-mono font-bold text-red-200 flex items-center justify-between gap-3 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{mcErrorMsg}</span>
                </div>
                <button
                  onClick={() => setMcErrorMsg(null)}
                  className="text-xs hover:text-white cursor-pointer px-2 py-0.5"
                >
                  ✕
                </button>
              </div>
            )}

            {user.minecraft_username ? (
              /* ALREADY LINKED STATE */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: 3D Player Avatar & Credentials */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-[#09341E] via-[#042113] to-[#0D482B] border-4 border-[#CCFF00] rounded-3xl p-6 shadow-[10px_10px_0px_#03170D] space-y-6 relative text-center">
                    <div className="flex items-center justify-between border-b border-[#166B42] pb-3 text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#CCFF00] animate-pulse" />
                        <span className="font-mono text-xs font-black uppercase text-[#CCFF00]">
                          MINECRAFT ID
                        </span>
                      </div>
                      <span className="bg-[#CCFF00] text-[#042113] text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase">
                        LINKED 🟢
                      </span>
                    </div>

                    {/* 3D Skin Body Preview */}
                    <div className="py-2 flex flex-col items-center justify-center">
                      <div className="relative w-28 h-44 flex items-center justify-center">
                        <img
                          src={`https://mc-heads.net/body/${encodeURIComponent(user.minecraft_username)}/160`}
                          alt={user.minecraft_username}
                          className="h-44 object-contain pixelated drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                          onError={(e) => {
                            // Fallback to avatar head if full body fails
                            (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${encodeURIComponent(user.minecraft_username || "Steve")}/96`;
                          }}
                        />
                      </div>
                      <h3 className="text-2xl font-heading text-white mt-3">
                        {user.minecraft_username}
                      </h3>
                      <p className="text-[11px] font-mono text-[#00F0FF] mt-0.5">
                        Connected to {user.account_id}
                      </p>
                    </div>

                    {/* Link Info Box */}
                    <div className="bg-[#042113] border border-[#166B42] rounded-2xl p-3.5 space-y-2 text-xs font-mono text-left">
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Server Auth:</span>
                        <span className="text-[#CCFF00] font-bold">AuthMe PostgreSQL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Status:</span>
                        <span className="text-white font-bold">Active Player 🎮</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Linked Since:</span>
                        <span className="text-emerald-200">
                          {user.minecraft_linked_at ? new Date(user.minecraft_linked_at).toLocaleDateString() : "Active"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setShowPasswordModal(!showPasswordModal)}
                        className="w-full bg-[#042113] hover:bg-[#073620] text-[#CCFF00] border-2 border-[#CCFF00] py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Change Server Password</span>
                      </button>

                      <button
                        onClick={handleUnlinkMinecraft}
                        disabled={mcActionLoading}
                        className="w-full bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-700/60 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                      >
                        <span>Disconnect Minecraft IGN</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Server Details & Password Reset Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Server Connection Information */}
                  <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_#03170D]">
                    <div className="flex items-center justify-between border-b border-[#166B42] pb-3">
                      <h2 className="text-xl font-heading text-white flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-[#CCFF00]" />
                        <span>Server Connection Info</span>
                      </h2>
                      <span className="bg-[#042113] text-[#00F0FF] text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-[#00F0FF]/30 uppercase">
                        PAPER 1.12.2
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#042113] p-4 rounded-2xl border border-[#166B42] space-y-2">
                        <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold block">
                          SERVER IP / HOSTNAME
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-mono font-black text-sm">
                            play.teenverse.org
                          </span>
                          <button
                            onClick={copyServerAddress}
                            className="bg-[#09341E] hover:bg-[#166B42] text-[#CCFF00] p-1.5 rounded-lg border border-[#166B42] cursor-pointer transition-colors"
                            title="Copy Server IP"
                          >
                            {copiedServerIp ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#042113] p-4 rounded-2xl border border-[#166B42] space-y-2">
                        <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold block">
                          DEFAULT PORT &amp; VERSION
                        </span>
                        <div className="text-white font-mono font-black text-sm">
                          25565 <span className="text-emerald-400 text-xs font-normal">(Java Edition 1.12.2)</span>
                        </div>
                      </div>
                    </div>

                    {/* How to Play */}
                    <div className="bg-[#052715] border-l-4 border-[#CCFF00] rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-mono font-black uppercase text-[#CCFF00] tracking-wider">
                        🎮 HOW TO LOG IN IN-GAME:
                      </h4>
                      <ol className="text-xs font-mono text-emerald-100 space-y-1.5 list-decimal list-inside">
                        <li>Launch Minecraft Java Edition (Version 1.12.2).</li>
                        <li>Join the server at <strong className="text-[#CCFF00]">play.teenverse.org</strong>.</li>
                        <li>
                          Type <code className="bg-[#042113] px-1.5 py-0.5 rounded text-[#00F0FF] border border-[#166B42]">/login &lt;password&gt;</code> using the password you set in this Cockpit.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Change Password Form (Drawer) */}
                  {showPasswordModal && (
                    <div className="bg-[#09341E] border-3 border-[#CCFF00] rounded-3xl p-6 space-y-4 shadow-[8px_8px_0px_#03170D] animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#166B42] pb-3">
                        <h3 className="text-lg font-heading text-white flex items-center gap-2">
                          <Lock className="w-5 h-5 text-[#CCFF00]" />
                          <span>Update Minecraft Server Password</span>
                        </h3>
                        <button
                          onClick={() => setShowPasswordModal(false)}
                          className="text-xs text-emerald-400 hover:text-white font-mono"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleUpdateMinecraftPassword} className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                            New In-Game Server Password
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                            <input
                              type="password"
                              required
                              placeholder="Enter new 6+ char password"
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-mono text-white placeholder-emerald-700 transition-colors"
                            />
                          </div>
                          <p className="text-[10px] text-emerald-400 font-mono mt-1">
                            This updates your hash in AuthMe database immediately. You can log in with this new password right away!
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={mcActionLoading}
                          className="sticker-btn py-3 px-6 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000] disabled:opacity-50"
                        >
                          {mcActionLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                              <span>Updating Password...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 text-[#042113]" />
                              <span>Save New Password</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* UNLINKED STATE: Connect Form */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Card */}
                <div className="lg:col-span-2">
                  <div className="bg-[#09341E] border-3 border-[#CCFF00] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#03170D] space-y-6">
                    <div className="space-y-1">
                      <span className="bg-[#042113] text-[#00F0FF] text-[10px] font-mono font-black px-2.5 py-0.5 rounded border border-[#00F0FF]/30 uppercase tracking-wider">
                        GAMING REALM INTEGRATION
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-heading text-white">
                        Connect Your Minecraft Account 🎮
                      </h2>
                      <p className="text-xs sm:text-sm text-emerald-200">
                        Link your Minecraft Java username with your Teenverse ID to access our official multiplayer survival &amp; creative servers.
                      </p>
                    </div>

                    <form onSubmit={handleLinkMinecraft} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                          Minecraft Username (IGN)
                        </label>
                        <div className="relative">
                          <Gamepad2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. SteveBuilder99"
                            value={mcIgnInput}
                            onChange={(e) => setMcIgnInput(e.target.value)}
                            maxLength={16}
                            className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-mono font-bold text-white placeholder-emerald-700 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                          Create Server Login Password <span className="text-emerald-500 font-normal lowercase">(for in-game /login)</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                          <input
                            type="password"
                            placeholder="Create an in-game password (optional)"
                            value={mcPasswordInput}
                            onChange={(e) => setMcPasswordInput(e.target.value)}
                            className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-mono text-white placeholder-emerald-700 transition-colors"
                          />
                        </div>
                        <p className="text-[10px] text-emerald-400 font-mono mt-1">
                          You will use this password when you type <code className="text-[#CCFF00]">/login &lt;password&gt;</code> on the server.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={mcActionLoading}
                        className="w-full sticker-btn py-3.5 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] disabled:opacity-50"
                      >
                        {mcActionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                            <span>Connecting Account...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Connect Minecraft Username</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="lg:col-span-1">
                  <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-6 shadow-[6px_6px_0px_#03170D] space-y-4 text-center">
                    <h3 className="text-sm font-mono font-bold text-[#CCFF00] uppercase tracking-wider">
                      Live Skin Preview
                    </h3>

                    <div className="w-24 h-24 rounded-2xl bg-[#042113] border-2 border-[#CCFF00] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000] overflow-hidden">
                      {mcIgnInput && mcIgnInput.trim().length >= 3 ? (
                        <img
                          src={`https://mc-heads.net/avatar/${encodeURIComponent(mcIgnInput.trim())}/96`}
                          alt={mcIgnInput}
                          className="w-20 h-20 object-contain pixelated"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <Gamepad2 className="w-10 h-10 text-[#CCFF00]/40" />
                      )}
                    </div>

                    <div className="font-mono text-xs">
                      <span className="text-white font-black block text-sm">
                        {mcIgnInput || "Your IGN Here"}
                      </span>
                      <span className="text-emerald-400 text-[10px]">
                        {mcIgnInput ? "Ready to sync with AuthMe" : "Enter username to preview"}
                      </span>
                    </div>

                    <div className="bg-[#042113] p-3 rounded-xl border border-[#166B42] text-[11px] font-mono text-emerald-300 text-left space-y-1.5">
                      <div className="text-[#00F0FF] font-bold uppercase text-[10px]">✨ Features:</div>
                      <div>• Automated AuthMe sync</div>
                      <div>• Web password reset</div>
                      <div>• In-game rank badges</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Applications */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-8 text-center space-y-4 shadow-[6px_6px_0px_#03170D]">
                <FileText className="w-12 h-12 text-[#CCFF00] mx-auto" />
                <h3 className="text-xl font-heading text-white">No Volunteer Applications Found</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto">
                  You haven&apos;t submitted a volunteer application for Season &apos;26 yet. Apply now to join our squad!
                </p>
                <Link
                  href="/apply"
                  className="sticker-btn inline-flex px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider gap-2 cursor-pointer"
                >
                  <span>Apply Now &rarr;</span>
                </Link>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-[#09341E] border-3 border-[#166B42] hover:border-[#CCFF00] rounded-3xl p-6 shadow-[6px_6px_0px_#03170D] transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#166B42] pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase block">APPLICATION REF</span>
                      <span className="text-lg font-mono font-black text-[#CCFF00]">{app.application_ref}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#042113] text-[#00F0FF] text-xs font-mono font-bold px-3 py-1 rounded-lg border border-[#166B42]">
                        {app.primary_domain}
                      </span>
                      <span className="bg-[#CCFF00] text-[#042113] text-xs font-mono font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                        STATUS: {app.application_status.replace("_", " ")} 🟡
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-100 font-mono">
                    Submitted on: {new Date(app.submitted_at).toLocaleDateString()}
                  </p>

                  {/* Re-upload Document Required Alert & Uploader */}
                  {app.application_status === "document_reupload_requested" && (
                    <div className="bg-[#052715] border-2 border-[#FF9900] rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-[#FF9900] font-heading text-sm">
                        <AlertCircle className="w-5 h-5" />
                        <span>ACTION REQUIRED: Student Verification Document Re-upload</span>
                      </div>

                      {app.reviewer_notes && (
                        <div className="bg-[#042113] p-3.5 rounded-xl border border-[#166B42] text-xs font-mono">
                          <span className="text-[#00F0FF] font-bold block mb-1 uppercase tracking-wide">
                            💬 Message from Reviewer / Squad Lead:
                          </span>
                          <p className="text-white whitespace-pre-wrap">{app.reviewer_notes}</p>
                        </div>
                      )}

                      {reuploadSuccess && (
                        <div className="p-3 bg-[#042113] border border-[#CCFF00] rounded-xl text-xs font-mono font-bold text-[#CCFF00]">
                          {reuploadSuccess}
                        </div>
                      )}

                      {reuploadError && (
                        <div className="p-3 bg-red-950 border border-red-500 rounded-xl text-xs font-mono font-bold text-red-200">
                          Error: {reuploadError}
                        </div>
                      )}

                      <div className="pt-1">
                        <label className="relative inline-flex items-center gap-2 bg-[#CCFF00] hover:bg-[#b8e600] text-[#042113] font-mono text-xs font-black uppercase px-5 py-3 rounded-xl cursor-pointer shadow-[3px_3px_0px_#000] transition-transform hover:scale-105">
                          {reuploadLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                              <span>Uploading Document...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-[#042113]" />
                              <span>Select &amp; Re-Upload New Document 📄</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            disabled={reuploadLoading}
                            onChange={(e) => handleDocumentReupload(app.id, e)}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-emerald-400 font-mono mt-1.5">
                          Upload clear Student Card, Roll No Slip, or Bonafide Letter (JPG, PNG, PDF).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Events & Hackathons */}
        {activeTab === "events" && (
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-12 bg-[#09341E] border border-[#166B42] rounded-3xl space-y-3">
                <Calendar className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
                <p className="text-emerald-300 font-mono text-sm">No event registrations found.</p>
                <p className="text-xs text-emerald-400">Upcoming events and hackathon registrations will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-[#09341E] border-2 border-[#166B42] rounded-2xl p-5 shadow-[4px_4px_0px_#03170D] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#CCFF00]">
                        {ev.registration_ref}
                      </span>
                      <span className="bg-[#042113] text-[#00F0FF] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#00F0FF]/30">
                        REGISTERED 🟢
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-heading text-white">{ev.events?.name || "Event Registration"}</h4>
                      <p className="text-xs font-mono text-emerald-300">{ev.events?.start_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Roles & Badges */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#09341E] border-2 border-[#CCFF00] rounded-2xl p-5 shadow-[4px_4px_0px_#03170D] space-y-2">
              <div className="text-3xl">🏆</div>
              <h4 className="text-base font-heading text-white">Founding Teenverse Squad</h4>
              <p className="text-xs text-emerald-200">Registered member during Teenverse Pakistan Season &apos;26.</p>
            </div>

            <div className="bg-[#09341E] border-2 border-[#166B42] rounded-2xl p-5 shadow-[4px_4px_0px_#03170D] space-y-2 opacity-80">
              <div className="text-3xl">⚡</div>
              <h4 className="text-base font-heading text-white">Civic Builder &apos;26</h4>
              <p className="text-xs text-emerald-200">Active contributor to civic tech and neighborhood initiatives.</p>
            </div>

            <div className="bg-[#09341E] border-2 border-[#166B42] rounded-2xl p-5 shadow-[4px_4px_0px_#03170D] space-y-2 opacity-80">
              <div className="text-3xl">📢</div>
              <h4 className="text-base font-heading text-white">Public Camp Instructor</h4>
              <p className="text-xs text-emerald-200">Teach at free weekend bootcamps across Pakistan.</p>
            </div>
          </div>
        )}
      </main>

      {/* Cockpit Footer */}
      <footer className="bg-[#042113] border-t border-[#166B42] py-4 text-center text-xs font-mono text-emerald-400/70">
        © 2026 TEENVERSE PAKISTAN • Central Identity Provider &amp; Cockpit Portal
      </footer>
    </div>
  );
}
