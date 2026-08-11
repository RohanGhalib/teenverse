"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  ExternalLink,
  LogOut,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
  Download,
  Eye,
  X,
  Send
} from "lucide-react";

interface ApplicationRecord {
  id: string;
  application_ref: string;
  email: string;
  primary_domain: string;
  why_join: string;
  expectations: string;
  ideas_to_launch: string;
  skills_and_mastery: string;
  pledge_accepted: boolean;
  application_status: string;
  reviewer_notes?: string;
  submitted_at: string;
  teenverse_users?: {
    account_id: string;
    first_name: string;
    last_name: string;
    father_name: string;
    dob: string;
    gender: string;
    city: string;
    province: string;
    address: string;
    education_level: string;
    institute_name: string;
    student_proof_url?: string;
    phone: string;
  };
}

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data states
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal / Review state
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/login");
      const data = await res.json();
      setAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchApplications();
      }
    } catch (err) {
      setAuthenticated(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid password.");
      }

      setAuthenticated(true);
      fetchApplications();
    } catch (err: any) {
      setLoginError(err.message || "Failed to authenticate.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  };

  const fetchApplications = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const openReviewModal = (app: ApplicationRecord) => {
    setSelectedApp(app);
    setNewStatus(app.application_status);
    setReviewerNotes(app.reviewer_notes || "");
    setUpdateMessage(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdateLoading(true);
    setUpdateMessage(null);

    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          application_status: newStatus,
          reviewer_notes: reviewerNotes,
          sendEmailNotification: sendEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update application.");
      }

      setUpdateMessage(
        `Updated successfully! ${data.emailSent ? "(Notification Email Sent ✉️)" : ""}`
      );

      // Update local state
      setApplications((prev) =>
        prev.map((item) =>
          item.id === selectedApp.id
            ? { ...item, application_status: newStatus, reviewer_notes: reviewerNotes }
            : item
        )
      );

      setTimeout(() => {
        setSelectedApp(null);
      }, 1200);
    } catch (err: any) {
      setUpdateMessage(`Error: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const user = app.teenverse_users;
    const searchLower = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !searchQuery ||
      app.application_ref.toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower) ||
      app.primary_domain.toLowerCase().includes(searchLower) ||
      (user &&
        (`${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower) ||
          user.city.toLowerCase().includes(searchLower) ||
          user.account_id.toLowerCase().includes(searchLower) ||
          user.institute_name.toLowerCase().includes(searchLower)));

    const matchesDomain = domainFilter === "all" || app.primary_domain === domainFilter;
    const matchesStatus = statusFilter === "all" || app.application_status === statusFilter;

    return matchesSearch && matchesDomain && matchesStatus;
  });

  // Export to CSV helper
  const exportToCSV = () => {
    if (filteredApps.length === 0) return;

    const headers = [
      "Application Ref",
      "Account ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "City",
      "Institute",
      "Domain",
      "Status",
      "Submitted At",
    ];

    const rows = filteredApps.map((app) => [
      app.application_ref,
      app.teenverse_users?.account_id || "",
      app.teenverse_users?.first_name || "",
      app.teenverse_users?.last_name || "",
      app.email,
      app.teenverse_users?.phone || "",
      app.teenverse_users?.city || "",
      app.teenverse_users?.institute_name || "",
      app.primary_domain,
      app.application_status,
      new Date(app.submitted_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teenverse_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status counts
  const totalCount = applications.length;
  const submittedCount = applications.filter((a) => a.application_status === "submitted").length;
  const reviewCount = applications.filter((a) => a.application_status === "under_review").length;
  const acceptedCount = applications.filter((a) => a.application_status === "accepted").length;
  const orientationCount = applications.filter((a) => a.application_status === "orientation_scheduled").length;

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#082D19] flex items-center justify-center text-[#CCFF00] font-mono font-bold">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // 1. Password Protection Screen if unauthenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#082D19] text-[#F0FFF4] flex flex-col justify-between items-center p-4 font-sans relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

        <header className="py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-40 h-11">
              <Image src="/logo.png" alt="TEENVERSE Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </header>

        <main className="w-full max-w-md my-auto">
          <div className="bg-[#09341E] border-4 border-[#CCFF00] rounded-3xl p-6 sm:p-8 shadow-[10px_10px_0px_#03170D] space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-[#042113] rounded-2xl border-2 border-[#CCFF00] text-[#CCFF00] shadow-[3px_3px_0px_#000] mb-2">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading text-white tracking-wide">
                ADMIN PORTAL LOCK
              </h1>
              <p className="text-xs text-emerald-200">
                Password Protected Volunteer Management System
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  Admin Access Password
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCFF00]" />
                  <input
                    type="password"
                    required
                    placeholder="Enter management password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm font-mono text-white placeholder-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full sticker-btn py-3.5 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                    <span>Verifying Lock...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlock Admin Cockpit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        <footer className="py-4 text-center text-xs font-mono text-emerald-400/60">
          © 2026 TEENVERSE PAKISTAN • Restricted Admin Access
        </footer>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-[#082D19] text-[#F0FFF4] flex flex-col font-sans selection:bg-[#CCFF00] selection:text-[#042113]">
      {/* Top Navbar */}
      <header className="bg-[#042113] border-b-3 border-[#166B42] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-32 h-9">
                <Image src="/logo.png" alt="TEENVERSE Logo" fill className="object-contain" priority />
              </div>
            </Link>
            <span className="bg-[#CCFF00] text-[#042113] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#042113]">
              ADMIN DASHBOARD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              disabled={loadingData}
              className="bg-[#09341E] hover:bg-[#166B42] text-[#CCFF00] text-xs font-mono font-bold px-3 py-2 rounded-xl border border-[#166B42] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Refresh Applications"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-mono font-bold px-3 py-2 rounded-xl border border-red-700/60 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Counter Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#09341E] border-2 border-[#166B42] rounded-2xl p-4 text-center shadow-[4px_4px_0px_#03170D]">
            <span className="text-xs font-mono text-emerald-400 block uppercase">Total Applications</span>
            <span className="text-2xl sm:text-3xl font-heading text-white">{totalCount}</span>
          </div>

          <div className="bg-[#09341E] border-2 border-[#00F0FF]/60 rounded-2xl p-4 text-center shadow-[4px_4px_0px_#03170D]">
            <span className="text-xs font-mono text-[#00F0FF] block uppercase">Submitted</span>
            <span className="text-2xl sm:text-3xl font-heading text-white">{submittedCount}</span>
          </div>

          <div className="bg-[#09341E] border-2 border-yellow-500/60 rounded-2xl p-4 text-center shadow-[4px_4px_0px_#03170D]">
            <span className="text-xs font-mono text-yellow-300 block uppercase">Under Review</span>
            <span className="text-2xl sm:text-3xl font-heading text-white">{reviewCount}</span>
          </div>

          <div className="bg-[#09341E] border-2 border-[#CCFF00]/80 rounded-2xl p-4 text-center shadow-[4px_4px_0px_#03170D]">
            <span className="text-xs font-mono text-[#CCFF00] block uppercase">Accepted</span>
            <span className="text-2xl sm:text-3xl font-heading text-white">{acceptedCount}</span>
          </div>

          <div className="bg-[#09341E] border-2 border-emerald-400/60 rounded-2xl p-4 text-center col-span-2 sm:col-span-1 shadow-[4px_4px_0px_#03170D]">
            <span className="text-xs font-mono text-emerald-300 block uppercase">Orientation</span>
            <span className="text-2xl sm:text-3xl font-heading text-white">{orientationCount}</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-4 sm:p-6 shadow-[6px_6px_0px_#03170D] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="Search name, email, ref, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#042113] border border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-[#042113] border border-[#166B42] text-xs font-mono text-emerald-200 rounded-xl py-2.5 px-3 focus:outline-none cursor-pointer"
            >
              <option value="all">All Domains</option>
              <option value="Tech & Engineering 💻">Tech & Engineering</option>
              <option value="Figma UI/UX & Design 🎨">UI/UX & Design</option>
              <option value="Public Camps & Teaching 📢">Public Camps & Teaching</option>
              <option value="Leadership & Operations 🧠">Leadership & Operations</option>
              <option value="Media, Content & PR 📹">Media & PR</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#042113] border border-[#166B42] text-xs font-mono text-emerald-200 rounded-xl py-2.5 px-3 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="orientation_scheduled">Orientation Scheduled</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={exportToCSV}
              className="bg-[#042113] hover:bg-[#CCFF00] hover:text-[#042113] text-[#CCFF00] text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-[#CCFF00] flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Applications List Table */}
        <div className="bg-[#09341E] border-3 border-[#166B42] rounded-3xl overflow-hidden shadow-[8px_8px_0px_#03170D]">
          {loadingData ? (
            <div className="p-12 text-center text-[#CCFF00] font-mono font-bold space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="text-xs">Fetching applications from Supabase...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12 text-center text-emerald-300 font-mono space-y-2">
              <FileText className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-white">No matching applications found</p>
              <p className="text-xs text-emerald-400">Try adjusting your search or domain filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#042113] border-b-2 border-[#166B42] text-emerald-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Ref / Account</th>
                    <th className="p-4">Applicant Name</th>
                    <th className="p-4">City / School</th>
                    <th className="p-4">Domain</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#166B42]/50">
                  {filteredApps.map((app) => {
                    const u = app.teenverse_users;
                    return (
                      <tr key={app.id} className="hover:bg-[#042113]/60 transition-colors">
                        <td className="p-4 font-bold text-[#CCFF00]">
                          <div>{app.application_ref}</div>
                          <div className="text-[10px] text-emerald-400 font-normal">{u?.account_id || "No User ID"}</div>
                        </td>

                        <td className="p-4 font-bold text-white">
                          <div>
                            {u ? `${u.first_name} ${u.last_name}` : app.email}
                          </div>
                          <div className="text-[10px] text-emerald-300 font-normal">{app.email}</div>
                        </td>

                        <td className="p-4 text-emerald-200">
                          <div>{u?.city || "N/A"}</div>
                          <div className="text-[10px] text-emerald-400 truncate max-w-[150px]">
                            {u?.institute_name || "N/A"}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="bg-[#042113] border border-[#166B42] text-[#00F0FF] text-[11px] font-bold px-2.5 py-1 rounded-lg inline-block">
                            {app.primary_domain}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md inline-block ${
                              app.application_status === "accepted"
                                ? "bg-[#CCFF00] text-[#042113]"
                                : app.application_status === "under_review"
                                ? "bg-yellow-400 text-[#042113]"
                                : app.application_status === "orientation_scheduled"
                                ? "bg-[#00F0FF] text-[#042113]"
                                : app.application_status === "rejected"
                                ? "bg-red-900 text-red-200"
                                : "bg-[#042113] text-emerald-200 border border-[#166B42]"
                            }`}
                          >
                            {app.application_status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="p-4 text-emerald-400 text-[11px]">
                          {new Date(app.submitted_at).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => openReviewModal(app)}
                            className="bg-[#042113] hover:bg-[#CCFF00] hover:text-[#042113] text-[#CCFF00] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#CCFF00] transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detailed Application Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#09341E] border-4 border-[#CCFF00] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#042113] text-emerald-200 hover:text-white border border-[#166B42] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <span className="bg-[#CCFF00] text-[#042113] text-[10px] font-mono font-black px-2.5 py-0.5 rounded uppercase">
                REVIEW APPLICATION
              </span>
              <h2 className="text-2xl font-heading text-white">
                Ref: {selectedApp.application_ref}
              </h2>
              <p className="text-xs font-mono text-emerald-300">
                Submitted on {new Date(selectedApp.submitted_at).toLocaleString()}
              </p>
            </div>

            {/* Applicant Profile Card */}
            {selectedApp.teenverse_users && (
              <div className="bg-[#042113] border-2 border-[#166B42] rounded-2xl p-4 space-y-3 font-mono text-xs">
                <h3 className="text-sm font-bold text-[#CCFF00] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Applicant Personal Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-emerald-200">
                  <div>
                    <strong className="text-white">Name:</strong> {selectedApp.teenverse_users.first_name} {selectedApp.teenverse_users.last_name}
                  </div>
                  <div>
                    <strong className="text-white">Account ID:</strong> {selectedApp.teenverse_users.account_id}
                  </div>
                  <div>
                    <strong className="text-white">Email:</strong> {selectedApp.email}
                  </div>
                  <div>
                    <strong className="text-white">Phone:</strong> {selectedApp.teenverse_users.phone}
                  </div>
                  <div>
                    <strong className="text-white">City:</strong> {selectedApp.teenverse_users.city}, {selectedApp.teenverse_users.province}
                  </div>
                  <div>
                    <strong className="text-white">Institute:</strong> {selectedApp.teenverse_users.institute_name}
                  </div>
                  {selectedApp.teenverse_users.student_proof_url && (
                    <div className="col-span-2">
                      <strong className="text-[#00F0FF]">Student Proof URL:</strong>{" "}
                      <span className="underline">{selectedApp.teenverse_users.student_proof_url}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Q&A Answers Section */}
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-[#042113] p-4 rounded-xl border border-[#166B42] space-y-1">
                <span className="text-[#CCFF00] font-bold block uppercase text-[11px]">
                  1. Why do you want to join Teenverse Pakistan?
                </span>
                <p className="text-emerald-100 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.why_join}
                </p>
              </div>

              <div className="bg-[#042113] p-4 rounded-xl border border-[#166B42] space-y-1">
                <span className="text-[#CCFF00] font-bold block uppercase text-[11px]">
                  2. Skills &amp; Mastery
                </span>
                <p className="text-emerald-100 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.skills_and_mastery}
                </p>
              </div>

              <div className="bg-[#042113] p-4 rounded-xl border border-[#166B42] space-y-1">
                <span className="text-[#CCFF00] font-bold block uppercase text-[11px]">
                  3. Expectations from Teenverse
                </span>
                <p className="text-emerald-100 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.expectations}
                </p>
              </div>

              <div className="bg-[#042113] p-4 rounded-xl border border-[#166B42] space-y-1">
                <span className="text-[#CCFF00] font-bold block uppercase text-[11px]">
                  4. Ideas to Launch
                </span>
                <p className="text-emerald-100 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.ideas_to_launch}
                </p>
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="pt-4 border-t-2 border-[#166B42] space-y-4">
              <h3 className="text-sm font-heading text-white">UPDATE APPLICATION STATUS</h3>

              {updateMessage && (
                <div className="p-3 rounded-xl bg-[#042113] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono font-bold">
                  {updateMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1">
                    Select New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] text-white font-mono text-xs rounded-xl p-3 focus:outline-none cursor-pointer"
                  >
                    <option value="submitted">Submitted ⚪</option>
                    <option value="under_review">Under Review 🟡</option>
                    <option value="accepted">Accepted 🟢</option>
                    <option value="orientation_scheduled">Orientation Scheduled 🚀</option>
                    <option value="rejected">Rejected 🔴</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1">
                    Reviewer Notes / Email Message
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add notes or message for the orientation invite..."
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] text-white font-mono text-xs rounded-xl p-2.5 focus:outline-none placeholder-emerald-700"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 accent-[#CCFF00] cursor-pointer"
                />
                <label htmlFor="sendEmail" className="text-xs font-mono text-emerald-200 cursor-pointer">
                  Send official status email notification to applicant via Resend ✉️
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#042113] text-emerald-300 border border-[#166B42] text-xs font-mono font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="sticker-btn px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Save &amp; Update Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
