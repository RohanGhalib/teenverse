"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Send,
  Bold,
  Italic,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading,
  List,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Users,
  Search,
  Eye,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Upload,
  Smartphone,
  Monitor,
  Check,
  Copy
} from "lucide-react";

interface ApplicationRecord {
  id: string;
  application_ref: string;
  email: string;
  primary_domain: string;
  application_status: string;
  teenverse_users?: {
    first_name: string;
    last_name: string;
    city: string;
  };
}

const TEMPLATE_PRESETS = [
  {
    id: "announcement",
    name: "🚀 General Announcement",
    badge: "COMMUNITY UPDATE",
    subject: "Exciting Updates from Teenverse Pakistan! 💚",
    headline: "Big Things Are Coming to Teenverse! 🚀",
    content: `<p>Hey Squad! 👋</p>
<p>We are super thrilled to share some exciting new developments across all <strong>Teenverse Pakistan</strong> domains.</p>
<hr style="border: 0; height: 1px; background: #166B42; margin: 24px 0;" />
<h3 style="color: #FFFFFF; font-size: 18px; font-weight: 800; margin: 20px 0 8px 0;">What's In The Pipeline?</h3>
<p>Our team has been hard at work setting up hands-on sprints, hackathons, and creative collaborations. Whether you are building AI projects, producing viral media, or architecting events, your contributions matter.</p>
<p>Make sure your <em>Cockpit ID</em> is updated and you have connected your Discord account.</p>`,
    ctaText: "OPEN TEENVERSE COCKPIT",
    ctaUrl: "https://teenverse.org/cockpit",
  },
  {
    id: "interview",
    name: "🎯 Onboarding / Orientation Notice",
    badge: "ORIENTATION SCHEDULED",
    subject: "Teenverse Season '26 Squad Orientation Details 🗓️",
    headline: "You're Invited to Squad Orientation! 🎯",
    content: `<p>Hi there! 👋</p>
<p>Congratulations on making it through the review round! We are hosting an official <strong>Onboarding & Orientation Session</strong> for the new cohort.</p>
<hr style="border: 0; height: 1px; background: #166B42; margin: 24px 0;" />
<h3 style="color: #FFFFFF; font-size: 18px; font-weight: 800; margin: 20px 0 8px 0;">Session Details</h3>
<p>📅 <strong>Date:</strong> Saturday, Coming Weekend<br />
⏰ <strong>Time:</strong> 8:00 PM PKT<br />
📍 <strong>Platform:</strong> Teenverse Discord Stage Voice Channel</p>
<p>Please arrive 5 minutes early with your Discord linked in your central Teenverse Cockpit.</p>`,
    ctaText: "JOIN DISCORD COMMUNITY",
    ctaUrl: "https://discord.gg/7798S8e4z3",
  },
  {
    id: "review",
    name: "📋 Application Review Update",
    badge: "APPLICATION UPDATE",
    subject: "Update Regarding Your Teenverse Application 📋",
    headline: "Status Update: Season '26 Cohort ⚡",
    content: `<p>Hello Applicant,</p>
<p>Thank you for your enthusiasm and dedication in applying to volunteer with <strong>Teenverse Pakistan</strong>.</p>
<p>Our domain squad leads have reviewed your profile and updated your application status in the central database.</p>
<hr style="border: 0; height: 1px; background: #166B42; margin: 24px 0;" />
<p>You can check your detailed status, verification feedback, and reviewer notes directly through your personal Cockpit.</p>`,
    ctaText: "CHECK APPLICATION STATUS",
    ctaUrl: "https://teenverse.org/cockpit",
  },
  {
    id: "blank",
    name: "✨ Blank Slate",
    badge: "TEENVERSE BROADCAST",
    subject: "Teenverse Pakistan Broadcast",
    headline: "Welcome to Teenverse Pakistan",
    content: `<p>Write your message here. Use the formatting toolbar above to add bold text, italics, dividers, and images.</p>`,
    ctaText: "",
    ctaUrl: "",
  },
];

const DOMAINS = [
  "Tech & AI",
  "Design & Creative",
  "Media & Production",
  "Operations & Event Logistics",
  "Community & Outreach",
];

const STATUSES = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "orientation_scheduled", label: "Orientation Scheduled" },
  { value: "rejected", label: "Rejected" },
  { value: "document_reupload_requested", label: "Re-upload Requested" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailSenderPage() {
  // Auth state
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Applications data
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Recipient targeting
  const [sendToApplicants, setSendToApplicants] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [selectedApplicantEmails, setSelectedApplicantEmails] = useState<string[]>([]);
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false);

  // Extra emails
  const [extraEmailsRaw, setExtraEmailsRaw] = useState("");

  // Email content fields
  const [badgeText, setBadgeText] = useState("COMMUNITY UPDATE");
  const [subject, setSubject] = useState(TEMPLATE_PRESETS[0].subject);
  const [headline, setHeadline] = useState(TEMPLATE_PRESETS[0].headline);
  const [htmlBody, setHtmlBody] = useState(TEMPLATE_PRESETS[0].content);
  const [ctaText, setCtaText] = useState(TEMPLATE_PRESETS[0].ctaText);
  const [ctaUrl, setCtaUrl] = useState(TEMPLATE_PRESETS[0].ctaUrl);

  // Editor helpers
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [viewTab, setViewTab] = useState<"editor" | "preview" | "both">("both");

  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkHref, setLinkHref] = useState("");

  // Sending states
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{
    success: boolean;
    sentCount: number;
    failedCount: number;
    errors?: string[];
    message: string;
  } | null>(null);

  // Check auth on mount
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
    } catch {
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
    setLoadingApps(true);
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications);
        // Default select all applicants that have emails
        const emails = data.applications
          .map((a: ApplicationRecord) => a.email?.trim().toLowerCase())
          .filter(Boolean);
        setSelectedApplicantEmails(Array.from(new Set(emails)) as string[]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Filtered applicants based on status, domain, search
  const filteredApplicants = applications.filter((app) => {
    if (!app.email) return false;
    const matchesStatus = statusFilter === "all" || app.application_status === statusFilter;
    const matchesDomain = domainFilter === "all" || app.primary_domain === domainFilter;

    const q = applicantSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.email.toLowerCase().includes(q) ||
      app.application_ref.toLowerCase().includes(q) ||
      (app.teenverse_users &&
        `${app.teenverse_users.first_name} ${app.teenverse_users.last_name}`
          .toLowerCase()
          .includes(q));

    return matchesStatus && matchesDomain && matchesSearch;
  });

  // Keep selectedApplicantEmails in sync when filter presets change
  const handleSelectAllFiltered = () => {
    const filteredEmails = filteredApplicants.map((a) => a.email.toLowerCase().trim());
    setSelectedApplicantEmails((prev) => Array.from(new Set([...prev, ...filteredEmails])));
  };

  const handleDeselectAllFiltered = () => {
    const filteredSet = new Set(filteredApplicants.map((a) => a.email.toLowerCase().trim()));
    setSelectedApplicantEmails((prev) => prev.filter((e) => !filteredSet.has(e)));
  };

  const toggleApplicantEmail = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    setSelectedApplicantEmails((prev) =>
      prev.includes(cleanEmail) ? prev.filter((e) => e !== cleanEmail) : [...prev, cleanEmail]
    );
  };

  // Parse extra emails
  const parsedExtraEmails = Array.from(
    new Set(
      extraEmailsRaw
        .split(/[\n,;\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => EMAIL_REGEX.test(e))
    )
  );

  // Total unique recipients
  const allTargetRecipients = Array.from(
    new Set([
      ...(sendToApplicants ? selectedApplicantEmails : []),
      ...parsedExtraEmails,
    ])
  );

  // Apply template preset
  const applyPreset = (presetId: string) => {
    const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setBadgeText(preset.badge);
    setSubject(preset.subject);
    setHeadline(preset.headline);
    setHtmlBody(preset.content);
    setCtaText(preset.ctaText);
    setCtaUrl(preset.ctaUrl);
  };

  // Formatting Toolbar Actions
  const insertTextAtCursor = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = htmlBody.substring(start, end) || defaultText;

    const newContent =
      htmlBody.substring(0, start) + before + selectedText + after + htmlBody.substring(end);

    setHtmlBody(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleBold = () => insertTextAtCursor("<strong>", "</strong>", "bold text");
  const handleItalic = () => insertTextAtCursor("<em>", "</em>", "italic text");
  const handleSeparator = () =>
    insertTextAtCursor('\n<hr style="border: 0; height: 1px; background: #166B42; margin: 24px 0;" />\n');
  const handleHeading = () =>
    insertTextAtCursor(
      '\n<h3 style="color: #FFFFFF; font-size: 18px; font-weight: 800; margin: 20px 0 8px 0;">',
      "</h3>\n",
      "Section Title"
    );
  const handleList = () =>
    insertTextAtCursor(
      '\n<ul style="margin: 0 0 16px 20px; padding: 0; color: #E6FFFA;">\n  <li>',
      "</li>\n  <li>Second bullet point</li>\n</ul>\n",
      "First bullet point"
    );

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    const imgHtml = `\n<img src="${imageUrl.trim()}" alt="${imageAlt.trim() || "Teenverse Email Image"}" style="max-width: 100%; height: auto; border-radius: 12px; margin: 16px 0; border: 2px solid #166B42; display: block;" />\n`;
    insertTextAtCursor(imgHtml);
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setImageUrl(data.url);
      if (!imageAlt) setImageAlt(file.name.replace(/\.[^/.]+$/, ""));
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInsertLink = () => {
    if (!linkHref.trim()) return;
    const text = linkText.trim() || linkHref.trim();
    const linkHtml = `<a href="${linkHref.trim()}" target="_blank" style="color: #00F0FF; text-decoration: underline;">${text}</a>`;
    insertTextAtCursor(linkHtml);
    setLinkText("");
    setLinkHref("");
    setShowLinkModal(false);
  };

  // Send Test Email
  const handleSendTest = async () => {
    if (!testEmailAddress.trim() || !EMAIL_REGEX.test(testEmailAddress.trim())) {
      setTestStatus({ success: false, message: "Please enter a valid test email address." });
      return;
    }

    setSendingTest(true);
    setTestStatus(null);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isTest: true,
          testEmail: testEmailAddress.trim(),
          subject,
          headline,
          badgeText,
          htmlBody,
          ctaButton: ctaText.trim() && ctaUrl.trim() ? { text: ctaText.trim(), url: ctaUrl.trim() } : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send test email.");
      }

      setTestStatus({
        success: true,
        message: `Test email sent to ${testEmailAddress}! Check your inbox.`,
      });
    } catch (err: any) {
      setTestStatus({ success: false, message: err.message || "Failed to send test email." });
    } finally {
      setSendingTest(false);
    }
  };

  // Broadcast to all recipients
  const handleBroadcast = async () => {
    if (allTargetRecipients.length === 0) {
      alert("No recipients selected.");
      return;
    }

    setBroadcasting(true);
    setBroadcastResult(null);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: allTargetRecipients,
          subject,
          headline,
          badgeText,
          htmlBody,
          ctaButton: ctaText.trim() && ctaUrl.trim() ? { text: ctaText.trim(), url: ctaUrl.trim() } : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to broadcast email.");
      }

      setBroadcastResult({
        success: data.success,
        sentCount: data.sentCount || 0,
        failedCount: data.failedCount || 0,
        errors: data.errors,
        message: data.message || "Dispatched successfully!",
      });
    } catch (err: any) {
      setBroadcastResult({
        success: false,
        sentCount: 0,
        failedCount: allTargetRecipients.length,
        errors: [err.message],
        message: err.message || "Failed to broadcast email.",
      });
    } finally {
      setBroadcasting(false);
    }
  };

  // Render Full HTML Preview Content for Live Frame
  const fullHtmlPreview = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px 12px;
            background-color: #041D10;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #E6FFFA;
            font-size: 14px;
            line-height: 1.7;
          }
          * { box-sizing: border-box; }
          a { color: #00F0FF; text-decoration: underline; }
          strong, b { color: #CCFF00; font-weight: 800; }
          em, i { color: #A7F3D0; font-style: italic; }
          img { max-width: 100%; height: auto; border-radius: 12px; border: 2px solid #166B42; margin: 14px 0; display: block; }
          hr { border: 0; height: 1px; background: #166B42; margin: 24px 0; }
          h1, h2, h3 { color: #FFFFFF; font-weight: 800; margin: 18px 0 8px 0; }
          p { margin: 0 0 16px 0; }
          ul, ol { margin: 0 0 16px 20px; padding: 0; color: #E6FFFA; }
          li { margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #082D19; border: 3px solid #CCFF00; border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.6); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #042113; padding: 24px 20px; border-bottom: 2px solid #166B42;">
                    <img src="https://raw.githubusercontent.com/RohanGhalib/teenverse/main/public/logo.png" alt="Teenverse Logo" width="135" style="display: block; margin: 0 auto 10px auto; max-width: 135px; height: auto; border: 0;" />
                    <div style="display: inline-block; background-color: #CCFF00; color: #042113; font-size: 11px; font-weight: 900; font-family: monospace; padding: 4px 12px; border-radius: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      ${badgeText || "OFFICIAL ANNOUNCEMENT"}
                    </div>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 28px 22px;">
                    ${
                      headline
                        ? `<h1 style="margin: 0 0 18px 0; color: #FFFFFF; font-size: 22px; font-weight: 900; line-height: 1.3;">
                            ${headline}
                          </h1>`
                        : ""
                    }

                    <div>
                      ${htmlBody || "<p style='opacity: 0.5; font-style: italic;'>Start typing in the editor to see your email come alive...</p>"}
                    </div>

                    ${
                      ctaText.trim() && ctaUrl.trim()
                        ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 26px 0 18px 0;">
                          <tr>
                            <td align="center">
                              <a href="${ctaUrl}" target="_blank" style="display: inline-block; background-color: #CCFF00; color: #042113; text-decoration: none; font-size: 13px; font-weight: 900; padding: 12px 28px; border-radius: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(204,255,0,0.3);">
                                ${ctaText} &rarr;
                              </a>
                            </td>
                          </tr>
                        </table>
                      `
                        : ""
                    }

                    <!-- Social Footer -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; border-top: 1px solid #166B42; padding-top: 20px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #CCFF00; font-family: monospace;">
                            CONNECT WITH TEENVERSE SQUAD
                          </p>
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 4px 6px;">
                                <a href="https://instagram.com/teenversepk" target="_blank" style="display: inline-block; background: linear-gradient(45deg, #E1306C, #F77737); color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 8px;">
                                  📸 Instagram
                                </a>
                              </td>
                              <td style="padding: 4px 6px;">
                                <a href="https://discord.gg/7798S8e4z3" target="_blank" style="display: inline-block; background-color: #5865F2; color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 8px;">
                                  🎮 Discord
                                </a>
                              </td>
                              <td style="padding: 4px 6px;">
                                <a href="https://teenverse.org/cockpit" target="_blank" style="display: inline-block; background-color: #CCFF00; color: #042113; text-decoration: none; font-size: 11px; font-weight: 900; padding: 6px 12px; border-radius: 8px; font-family: monospace;">
                                  ⚡ Cockpit
                                </a>
                              </td>
                            </tr>
                          </table>
                          <p style="margin: 16px 0 0 0; font-size: 11px; color: #6EE7B7; font-family: monospace;">
                            © 2026 TEENVERSE PAKISTAN • "Cool nerds doing fun things." 💚
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#082D19] flex items-center justify-center text-[#CCFF00] font-mono font-bold">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Password Login Screen
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
                EMAIL SENDER LOCK
              </h1>
              <p className="text-xs text-emerald-200">
                Authorized Admin Broadcast Portal
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
                    <span>Unlock Email Studio</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        <footer className="py-4 text-center text-xs font-mono text-emerald-400/60">
          © 2026 TEENVERSE PAKISTAN • Restricted Admin Broadcast
        </footer>
      </div>
    );
  }

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
              EMAIL SENDER ✉️
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/dashboard"
              className="bg-[#09341E] hover:bg-[#166B42] text-emerald-200 hover:text-white text-xs font-mono font-bold px-3 py-2 rounded-xl border border-[#166B42] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Applications Table</span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-mono font-bold px-3 py-2 rounded-xl border border-red-700/60 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Recipient Targeting Card */}
        <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#03170D] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#166B42] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#042113] rounded-xl border border-[#CCFF00] text-[#CCFF00]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-heading text-white">Target Recipients</h2>
                <p className="text-xs text-emerald-300">
                  Select Teenverse applicants, custom email addresses, or both.
                </p>
              </div>
            </div>

            {/* Recipient Counter Badge */}
            <div className="flex items-center gap-2 bg-[#042113] border-2 border-[#CCFF00] px-4 py-2 rounded-2xl shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase">Total:</span>
              <span className="text-lg font-mono font-black text-[#CCFF00]">
                {allTargetRecipients.length}
              </span>
              <span className="text-xs font-mono text-emerald-400">recipients</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Applicants Selection */}
            <div className="bg-[#042113] border border-[#166B42] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendToApplicants}
                    onChange={(e) => setSendToApplicants(e.target.checked)}
                    className="w-4 h-4 accent-[#CCFF00] rounded cursor-pointer"
                  />
                  <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Send to Applicants ({selectedApplicantEmails.length})
                  </span>
                </label>

                {sendToApplicants && (
                  <button
                    onClick={() => setIsApplicantListOpen(!isApplicantListOpen)}
                    className="text-xs font-mono text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isApplicantListOpen ? "Hide list" : "Manage individual list"}
                  </button>
                )}
              </div>

              {sendToApplicants && (
                <div className="space-y-3 pt-1">
                  {/* Status & Domain Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-emerald-400 mb-1">
                        Filter by Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-[#09341E] border border-[#166B42] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
                      >
                        <option value="all">All Statuses ({applications.length})</option>
                        {STATUSES.map((s) => {
                          const count = applications.filter((a) => a.application_status === s.value).length;
                          return (
                            <option key={s.value} value={s.value}>
                              {s.label} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-emerald-400 mb-1">
                        Filter by Domain
                      </label>
                      <select
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                        className="w-full bg-[#09341E] border border-[#166B42] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
                      >
                        <option value="all">All Domains</option>
                        {Array.from(
                          new Set([
                            "Tech & Engineering 💻",
                            "Figma UI/UX & Design 🎨",
                            "Public Camps & Teaching 📢",
                            "Leadership & Operations 🧠",
                            "Media, Content & PR 📹",
                            ...applications.map((a) => a.primary_domain).filter(Boolean),
                          ])
                        ).map((d) => {
                          const count = applications.filter((a) => a.primary_domain === d).length;
                          return (
                            <option key={d} value={d}>
                              {d} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Filter Action Buttons */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-emerald-400">
                      Matches current filters: <strong>{filteredApplicants.length}</strong>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAllFiltered}
                        className="text-[#CCFF00] hover:underline cursor-pointer"
                      >
                        + Select Filtered
                      </button>
                      <span className="text-emerald-700">|</span>
                      <button
                        onClick={handleDeselectAllFiltered}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        - Deselect Filtered
                      </button>
                    </div>
                  </div>

                  {/* Expandable Applicant Table / List */}
                  {isApplicantListOpen && (
                    <div className="border border-[#166B42] rounded-xl p-3 bg-[#082D19] space-y-2 mt-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="text"
                          placeholder="Search applicant name, email, or ref..."
                          value={applicantSearch}
                          onChange={(e) => setApplicantSearch(e.target.value)}
                          className="w-full bg-[#042113] border border-[#166B42] rounded-lg py-1.5 pl-8 pr-3 text-xs font-mono text-white placeholder-emerald-600 focus:outline-none focus:border-[#CCFF00]"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs font-mono">
                        {loadingApps ? (
                          <div className="py-4 text-center text-emerald-400 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading applicants...</span>
                          </div>
                        ) : filteredApplicants.length === 0 ? (
                          <div className="py-4 text-center text-emerald-500">
                            No applicants found matching filter.
                          </div>
                        ) : (
                          filteredApplicants.map((app) => {
                            const isSelected = selectedApplicantEmails.includes(app.email.toLowerCase().trim());
                            return (
                              <label
                                key={app.id}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${
                                  isSelected
                                    ? "bg-[#09341E] border-[#CCFF00]/60 text-white"
                                    : "bg-[#042113]/50 border-transparent text-emerald-400/80 hover:bg-[#09341E]"
                                }`}
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleApplicantEmail(app.email)}
                                    className="w-3.5 h-3.5 accent-[#CCFF00] rounded cursor-pointer"
                                  />
                                  <span className="truncate font-bold">
                                    {app.teenverse_users?.first_name
                                      ? `${app.teenverse_users.first_name} ${app.teenverse_users.last_name || ""}`
                                      : app.application_ref}
                                  </span>
                                  <span className="text-emerald-500 text-[11px] truncate">
                                    &lt;{app.email}&gt;
                                  </span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#042113] border border-[#166B42] text-emerald-300 shrink-0 ml-2">
                                  {app.primary_domain}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: Extra Emails Input */}
            <div className="bg-[#042113] border border-[#166B42] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Extra / Custom Emails ({parsedExtraEmails.length})
                </label>
                <span className="text-[11px] font-mono text-emerald-400">
                  Separated by comma or new lines
                </span>
              </div>

              <textarea
                rows={5}
                placeholder="mentor@example.com, squad-lead@teenverse.org, sponsor@domain.com&#10;test.user@gmail.com"
                value={extraEmailsRaw}
                onChange={(e) => setExtraEmailsRaw(e.target.value)}
                className="w-full bg-[#09341E] border border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl p-3 text-xs font-mono text-white placeholder-emerald-600 resize-none transition-colors"
              />

              {parsedExtraEmails.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-1">
                  {parsedExtraEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 bg-[#09341E] border border-[#166B42] text-[#00F0FF] text-[11px] font-mono px-2 py-0.5 rounded-md"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Composer & Preview Grid */}
        <div className="bg-[#09341E] border-2 border-[#166B42] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#03170D] space-y-5">
          
          {/* Top Bar: Template Presets + View Modes */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#166B42] pb-4">
            {/* Starter Presets */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-xs font-mono font-bold uppercase text-emerald-300">
                Preset Template:
              </span>
              <select
                onChange={(e) => applyPreset(e.target.value)}
                className="bg-[#042113] border border-[#166B42] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
                defaultValue="announcement"
              >
                {TEMPLATE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 bg-[#042113] p-1 rounded-xl border border-[#166B42]">
              <button
                onClick={() => setViewTab("editor")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                  viewTab === "editor" ? "bg-[#CCFF00] text-[#042113]" : "text-emerald-300 hover:text-white"
                }`}
              >
                Editor Only
              </button>
              <button
                onClick={() => setViewTab("both")}
                className={`hidden lg:block px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                  viewTab === "both" ? "bg-[#CCFF00] text-[#042113]" : "text-emerald-300 hover:text-white"
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewTab("preview")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                  viewTab === "preview" ? "bg-[#CCFF00] text-[#042113]" : "text-emerald-300 hover:text-white"
                }`}
              >
                Live Preview
              </button>
            </div>
          </div>

          {/* Editor & Preview Panes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: Composer Form & Toolbar */}
            {(viewTab === "editor" || viewTab === "both") && (
              <div className="space-y-4">
                
                {/* Subject & Badge Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Exciting Updates from Teenverse Pakistan!"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2.5 px-3.5 text-sm font-sans text-white placeholder-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1">
                      Header Badge
                    </label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="COMMUNITY UPDATE"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2.5 px-3.5 text-sm font-mono text-[#CCFF00] uppercase placeholder-emerald-600"
                    />
                  </div>
                </div>

                {/* Main Headline */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1">
                    Main Headline (Title inside email)
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Big Things Are Coming to Teenverse! 🚀"
                    className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2.5 px-3.5 text-sm font-heading text-white placeholder-emerald-600"
                  />
                </div>

                {/* Formatting Toolbar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                      Email Body Content *
                    </label>
                    <span className="text-[11px] font-mono text-emerald-500">
                      Supports HTML tags & styled blocks
                    </span>
                  </div>

                  <div className="bg-[#042113] border-2 border-[#166B42] rounded-t-2xl p-2 flex flex-wrap items-center gap-1.5">
                    {/* Bold Button */}
                    <button
                      type="button"
                      onClick={handleBold}
                      title="Bold (<strong>)"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-white hover:text-[#CCFF00] rounded-lg border border-[#166B42] transition-colors cursor-pointer"
                    >
                      <Bold className="w-4 h-4" />
                    </button>

                    {/* Italic Button */}
                    <button
                      type="button"
                      onClick={handleItalic}
                      title="Italic (<em>)"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-white hover:text-[#CCFF00] rounded-lg border border-[#166B42] transition-colors cursor-pointer"
                    >
                      <Italic className="w-4 h-4" />
                    </button>

                    {/* Pre-added Separator Button */}
                    <button
                      type="button"
                      onClick={handleSeparator}
                      title="Insert Teenverse Separator (<hr>)"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-[#CCFF00] rounded-lg border border-[#166B42] transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="hidden sm:inline">Separator</span>
                    </button>

                    {/* Add Image Option Button */}
                    <button
                      type="button"
                      onClick={() => setShowImageModal(true)}
                      title="Add Image (URL or Upload)"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-[#00F0FF] rounded-lg border border-[#166B42] transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Image</span>
                    </button>

                    {/* Heading Button */}
                    <button
                      type="button"
                      onClick={handleHeading}
                      title="Insert Heading (<h3>)"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-white rounded-lg border border-[#166B42] transition-colors cursor-pointer"
                    >
                      <Heading className="w-4 h-4" />
                    </button>

                    {/* Bullet List Button */}
                    <button
                      type="button"
                      onClick={handleList}
                      title="Bullet List"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-white rounded-lg border border-[#166B42] transition-colors cursor-pointer"
                    >
                      <List className="w-4 h-4" />
                    </button>

                    {/* Insert Link Button */}
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(true)}
                      title="Insert Link (<a>)"
                      className="p-2 bg-[#09341E] hover:bg-[#166B42] text-emerald-300 rounded-lg border border-[#166B42] transition-colors cursor-pointer"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Textarea */}
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    value={htmlBody}
                    onChange={(e) => setHtmlBody(e.target.value)}
                    placeholder="Enter email message body..."
                    className="w-full bg-[#042113] border-x-2 border-b-2 border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-b-2xl p-4 text-xs font-mono text-emerald-100 placeholder-emerald-700 resize-y leading-relaxed"
                  />
                </div>

                {/* Optional Call to Action Button */}
                <div className="bg-[#042113] border border-[#166B42] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Optional Call to Action (CTA) Button
                    </span>
                    <span className="text-[11px] font-mono text-[#CCFF00]">
                      Renders Teenverse Neon Button
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-emerald-400 mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="e.g. OPEN TEENVERSE COCKPIT"
                        className="w-full bg-[#09341E] border border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white placeholder-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-emerald-400 mb-1">
                        Button URL
                      </label>
                      <input
                        type="url"
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="https://teenverse.org/cockpit"
                        className="w-full bg-[#09341E] border border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white placeholder-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Email Row */}
                <div className="bg-[#042113] border border-[#166B42] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                      Send Test Email First
                    </span>
                    <span className="text-[11px] font-mono text-emerald-500">
                      Verify layout in your inbox
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="flex-1 bg-[#09341E] border border-[#166B42] focus:border-[#CCFF00] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white placeholder-emerald-600"
                    />
                    <button
                      type="button"
                      disabled={sendingTest}
                      onClick={handleSendTest}
                      className="bg-[#166B42] hover:bg-[#CCFF00] text-white hover:text-[#042113] px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {sendingTest ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Send Test</span>
                    </button>
                  </div>

                  {testStatus && (
                    <div
                      className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                        testStatus.success
                          ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-200"
                          : "bg-red-950/80 border border-red-500/60 text-red-200"
                      }`}
                    >
                      {testStatus.success ? (
                        <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{testStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* Action: Open Broadcast Confirmation */}
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={allTargetRecipients.length === 0}
                  className="w-full sticker-btn py-4 rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_0px_#000] disabled:opacity-40"
                >
                  <Send className="w-5 h-5" />
                  <span>Broadcast to {allTargetRecipients.length} Recipients</span>
                </button>
              </div>
            )}

            {/* RIGHT: Live Interactive Email Preview */}
            {(viewTab === "preview" || viewTab === "both") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                      Live Email Preview
                    </span>
                  </div>

                  {/* Viewport Width Toggle */}
                  <div className="flex items-center gap-1 bg-[#042113] p-1 rounded-xl border border-[#166B42]">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      title="Desktop View (600px)"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === "desktop"
                          ? "bg-[#CCFF00] text-[#042113]"
                          : "text-emerald-400 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      title="Mobile View (360px)"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === "mobile"
                          ? "bg-[#CCFF00] text-[#042113]"
                          : "text-emerald-400 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email Mockup Container */}
                <div className="bg-[#041D10] border-2 border-[#166B42] rounded-2xl p-3 sm:p-5 flex justify-center min-h-[600px] overflow-x-auto">
                  <div
                    className={`transition-all duration-300 w-full ${
                      previewDevice === "mobile" ? "max-w-[380px]" : "max-w-[600px]"
                    }`}
                  >
                    {/* Simulated Email Client Window */}
                    <div className="bg-[#09341E] border border-[#166B42] rounded-t-xl px-3 py-2 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
                      <span className="truncate">
                        <strong>Subject:</strong> {subject || "(No Subject)"}
                      </span>
                      <span className="text-emerald-500 shrink-0 ml-2">HTML Email</span>
                    </div>

                    {/* Rendered HTML inside iframe for isolation & accuracy */}
                    <iframe
                      title="Email Preview"
                      srcDoc={fullHtmlPreview}
                      className="w-full h-[650px] border-x border-b border-[#166B42] rounded-b-xl bg-[#041D10]"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* MODAL 1: Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09341E] border-4 border-[#00F0FF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[10px_10px_0px_#000]">
            <div className="flex items-center justify-between border-b border-[#166B42] pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="text-lg font-heading text-white">Insert Image</h3>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-emerald-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Option A: Upload image file */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1.5">
                Upload Image File
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#166B42] hover:border-[#00F0FF] rounded-xl p-4 bg-[#042113] cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-xs font-mono text-emerald-200">
                  {uploadingImage ? "Uploading..." : "Select PNG, JPG, or WebP"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="text-xs text-red-400 font-mono mt-1">⚠️ {uploadError}</p>
              )}
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#166B42]"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-emerald-500 uppercase">
                Or Paste Direct URL
              </span>
              <div className="flex-grow border-t border-[#166B42]"></div>
            </div>

            {/* Option B: Direct Image URL */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1">
                Image Web URL (HTTPS)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/banner.png"
                className="w-full bg-[#042113] border border-[#166B42] focus:border-[#00F0FF] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white placeholder-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1">
                Alt Text / Description (Optional)
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="e.g. Teenverse Squad Banner"
                className="w-full bg-[#042113] border border-[#166B42] focus:border-[#00F0FF] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white placeholder-emerald-600"
              />
            </div>

            {imageUrl && (
              <div className="p-2 border border-[#166B42] rounded-xl bg-[#042113] text-center">
                <span className="text-[10px] font-mono text-emerald-400 block mb-1">Preview</span>
                <img
                  src={imageUrl}
                  alt={imageAlt || "Preview"}
                  className="max-h-36 mx-auto rounded-lg object-contain"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#166B42] text-xs font-mono text-emerald-300 hover:bg-[#042113] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] text-[#042113] text-xs font-mono font-black uppercase hover:bg-cyan-300 cursor-pointer disabled:opacity-40"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Link Insert Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09341E] border-4 border-[#00F0FF] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-[10px_10px_0px_#000]">
            <div className="flex items-center justify-between border-b border-[#166B42] pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="text-lg font-heading text-white">Insert Link</h3>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-emerald-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1">
                Link Text
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Join the Discord Server"
                className="w-full bg-[#042113] border border-[#166B42] focus:border-[#00F0FF] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-emerald-300 mb-1">
                Destination URL
              </label>
              <input
                type="url"
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                placeholder="https://discord.gg/..."
                className="w-full bg-[#042113] border border-[#166B42] focus:border-[#00F0FF] focus:outline-none rounded-xl py-2 px-3 text-xs font-mono text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#166B42] text-xs font-mono text-emerald-300 hover:bg-[#042113] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkHref.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] text-[#042113] text-xs font-mono font-black uppercase hover:bg-cyan-300 cursor-pointer disabled:opacity-40"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Broadcast Confirmation & Execution Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09341E] border-4 border-[#CCFF00] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-[12px_12px_0px_#000]">
            <div className="flex items-center justify-between border-b border-[#166B42] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#042113] rounded-xl border border-[#CCFF00] text-[#CCFF00]">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-heading text-white">Confirm Broadcast</h3>
              </div>
              {!broadcasting && (
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-emerald-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {!broadcastResult ? (
              <>
                <div className="space-y-3 bg-[#042113] border border-[#166B42] rounded-2xl p-4 text-xs font-mono">
                  <div className="flex justify-between border-b border-[#166B42]/60 pb-2">
                    <span className="text-emerald-400">Total Recipients:</span>
                    <strong className="text-[#CCFF00] text-sm">
                      {allTargetRecipients.length} People
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-[#166B42]/60 pb-2">
                    <span className="text-emerald-400">Subject:</span>
                    <span className="text-white truncate max-w-[240px] font-sans">
                      {subject}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#166B42]/60 pb-2">
                    <span className="text-emerald-400">Sender Identity:</span>
                    <span className="text-emerald-200">Teenverse Pakistan &lt;welcome@mail.teenverse.org&gt;</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 block mb-1.5">Sample Recipients:</span>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {allTargetRecipients.slice(0, 8).map((email) => (
                        <span
                          key={email}
                          className="bg-[#09341E] px-2 py-0.5 rounded text-[10px] text-emerald-300"
                        >
                          {email}
                        </span>
                      ))}
                      {allTargetRecipients.length > 8 && (
                        <span className="text-[10px] text-emerald-500">
                          +{allTargetRecipients.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-emerald-300/80">
                  Each recipient will receive their own individual email. Email addresses will never be exposed to other recipients.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={broadcasting}
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 rounded-xl border border-[#166B42] text-xs font-mono font-bold text-emerald-300 hover:bg-[#042113] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={broadcasting}
                    onClick={handleBroadcast}
                    className="flex-1 sticker-btn py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] disabled:opacity-50"
                  >
                    {broadcasting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#042113]" />
                        <span>Sending Broadcast...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Send Now</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Broadcast Results */
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border text-center space-y-2 ${
                    broadcastResult.success
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                      : "bg-yellow-950/80 border-yellow-500 text-yellow-200"
                  }`}
                >
                  <div className="text-3xl">
                    {broadcastResult.success ? "🎉" : "⚠️"}
                  </div>
                  <h4 className="text-lg font-heading text-white">
                    {broadcastResult.message}
                  </h4>
                  <div className="flex justify-center gap-4 text-xs font-mono pt-2">
                    <span className="text-[#CCFF00]">
                      Sent: <strong>{broadcastResult.sentCount}</strong>
                    </span>
                    {broadcastResult.failedCount > 0 && (
                      <span className="text-red-400">
                        Failed: <strong>{broadcastResult.failedCount}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {broadcastResult.errors && broadcastResult.errors.length > 0 && (
                  <div className="p-3 bg-[#042113] border border-red-500/40 rounded-xl text-[11px] font-mono text-red-300 max-h-32 overflow-y-auto">
                    <span className="font-bold block mb-1">Errors logged:</span>
                    {broadcastResult.errors.map((e, idx) => (
                      <div key={idx}>• {e}</div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setBroadcastResult(null);
                  }}
                  className="w-full py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-[#042113] rounded-xl text-xs font-mono font-black uppercase cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-emerald-400/60 border-t border-[#166B42]/50 mt-8">
        © 2026 TEENVERSE PAKISTAN • Broadcast Studio
      </footer>
    </div>
  );
}
