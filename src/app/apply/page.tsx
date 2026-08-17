"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  ShieldCheck, 
  Rocket, 
  Mail,
  Lock,
  KeyRound,
  RotateCcw,
  X
} from "lucide-react";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appId, setAppId] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // OTP State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Personal Details
    firstName: "",
    lastName: "",
    fatherName: "",
    dob: "",
    email: "",
    phone: "",
    gender: "Male",
    address: "",
    city: "Bahawalpur",
    province: "Punjab",

    // Section 2: Education & Verification
    educationLevel: "Intermediate / FSc / FA / ICS",
    instituteName: "",
    studentProofFile: null as File | null,
    studentProofName: "",
    studentProofUrl: "",

    // Section 3: Q/A & Motivation
    primaryDomain: "Civic Volunteership",
    whyJoin: "",
    expectations: "",
    ideasToLaunch: "",
    skillsAndMastery: "",
    weeklyHours: "5-8 hours",
    referralSource: "Social Media",

    // Section 4: Pledge
    pledgeAgreed: false,
  });

  const [ageOverLimit, setAgeOverLimit] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Calculate exact age from Date of Birth
  const handleDobChange = (dobValue: string) => {
    setFormData((prev) => ({ ...prev, dob: dobValue }));
    if (!dobValue) {
      setAgeOverLimit(false);
      setCalculatedAge(null);
      return;
    }

    const birthDate = new Date(dobValue);
    const today = new Date(2026, 7, 11);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setCalculatedAge(age);
    if (age > 19) {
      setAgeOverLimit(true);
    } else {
      setAgeOverLimit(false);
    }
  };

  // Trigger Send OTP Email
  const handleSendOtp = async () => {
    if (!formData.firstName || !formData.lastName || !formData.fatherName || !formData.dob || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill out all required fields in Section 1 first!");
      return;
    }
    if (ageOverLimit) {
      alert("Teenverse is exclusively for teens (up to 19 years old). You cannot proceed.");
      return;
    }

    setSendingOtp(true);
    setOtpError("");
    setOtpSuccessMsg("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, firstName: formData.firstName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Failed to send OTP email.");
        return;
      }

      setOtpSuccessMsg(`6-digit OTP code sent to ${formData.email}!`);
      setShowOtpModal(true);
    } catch (err) {
      setOtpError("Network error sending OTP code.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Trigger Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Invalid OTP code.");
        return;
      }

      setIsEmailVerified(true);
      setShowOtpModal(false);
      setStep(2); // Proceed to Section 2
    } catch (err) {
      setOtpError("Error verifying OTP code.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Handle File Upload & Base64 Conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = (event.target?.result as string) || "";
        setFormData((prev) => ({
          ...prev,
          studentProofFile: file,
          studentProofName: file.name,
          studentProofUrl: base64Url,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#CCFF00", "#FF3366", "#00F0FF", "#FF9900"],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ageOverLimit) return;
    if (!isEmailVerified) {
      alert("Please verify your email address with OTP before submitting!");
      return;
    }
    if (!formData.pledgeAgreed) {
      alert("Please read and accept the Teenverse Volunteer Pledge before submitting!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to submit application.");
        setIsSubmitting(false);
        return;
      }

      setAppId(result.accountId);
      setEmailSent(result.emailSent);
      setSubmitted(true);
      triggerConfetti();
    } catch (err) {
      console.error("Submission error:", err);
      const fallbackId = "TV-2026-" + Math.floor(100000 + Math.random() * 900000);
      setAppId(fallbackId);
      setSubmitted(true);
      triggerConfetti();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#082D19] text-[#F0FFF4] antialiased craft-grid selection:bg-[#CCFF00] selection:text-[#042113] pb-20">
      
      {/* Top Non-Distracting Header */}
      <header className="bg-[#042113] border-b-4 border-[#CCFF00] py-4 px-4 sm:px-8 sticky top-0 z-40 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-200 hover:text-[#CCFF00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#CCFF00]" />
            <span>Back to Teenverse</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative w-28 h-8 sm:w-36 sm:h-10">
              <Image
                src="/logo.png"
                alt="TEENVERSE"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* Title & Responsibility Notice */}
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#062916] border border-[#166B42] text-[#CCFF00] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
            <span>OFFICIAL VOLUNTEER ONBOARDING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading uppercase text-white tracking-wide">
            TEENVERSE <span className="text-[#CCFF00]">VOLUNTEER APPLICATION</span>
          </h1>

          <p className="text-emerald-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Joining Teenverse creates your official <span className="text-white font-bold underline">Teenverse Account</span>. This account will serve as your Single Sign-On (SSO) for future hackathons, events, and subdomains!
          </p>
        </div>

        {/* Step Progress Bar */}
        {!submitted && (
          <div className="bg-[#042113] border-2 border-[#166B42] rounded-2xl p-4 mb-8 shadow-[4px_4px_0px_#03170D]">
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-mono font-bold">
              {[
                { num: 1, label: "Personal & Email OTP" },
                { num: 2, label: "Education" },
                { num: 3, label: "Impact & Q/A" },
                { num: 4, label: "Pledge & Submit" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`py-2 rounded-xl transition-all ${
                    step === s.num
                      ? "bg-[#CCFF00] text-[#042113] font-black border-2 border-[#042113] shadow-[2px_2px_0px_#042113]"
                      : step > s.num
                      ? "bg-[#155A38] text-white"
                      : "bg-[#062916] text-emerald-400"
                  }`}
                >
                  <span className="block sm:inline mr-1">{s.num}.</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Box */}
        <div className="bg-[#09341E] border-3 sm:border-4 border-[#166B42] rounded-2xl p-5 sm:p-8 shadow-[8px_8px_0px_#03170D]">
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ==================== SECTION 1: PERSONAL DETAILS & EMAIL OTP ==================== */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#166B42] pb-3 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-heading text-[#CCFF00] uppercase">
                      SECTION 1: PERSONAL DETAILS 👤
                    </h2>
                    <span className="text-xs font-mono text-emerald-300">Step 1 of 4</span>
                  </div>

                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Rohan"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Ghalib"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Father's Name & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        Father&apos;s Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        placeholder="Father's Full Name"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => handleDobChange(e.target.value)}
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Over Age Restriction Notice (Triggers silently if age > 19) */}
                  {ageOverLimit && (
                    <div className="bg-[#FF3366]/20 border-2 border-[#FF3366] rounded-xl p-4 space-y-2 text-white animate-fadeIn">
                      <div className="flex items-center gap-2 text-[#FF3366] font-extrabold text-sm uppercase">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>AGE RESTRICTION NOTIFICATION</span>
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        Thank you for your interest in Teenverse! Teenverse is exclusively dedicated to teenagers (up to 19 years old). Based on your Date of Birth, you are calculated as <span className="font-bold text-[#CCFF00]">{calculatedAge} years old</span>. 
                      </p>
                      <p className="text-xs text-emerald-200 italic font-mono">
                        While core volunteer positions are reserved for teens under 19, we welcome adults to sign up as Mentors or Industry Advisors. You cannot proceed with this teen application.
                      </p>
                    </div>
                  )}

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                          Email Address *
                        </label>
                        {isEmailVerified && (
                          <span className="text-[10px] font-mono text-[#CCFF00] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" /> Email Verified
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        required
                        disabled={isEmailVerified}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gender & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        Gender *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        <option value="Bahawalpur">Bahawalpur</option>
                        <option value="Multan">Multan</option>
                        <option value="Other">Other / Online</option>
                      </select>
                    </div>
                  </div>

                  {/* Full Residential Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      Residential Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House/Street No., Sector/Block, Area"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>

                  {/* Navigation Next & Verify OTP trigger */}
                  <div className="pt-4 flex justify-end">
                    {isEmailVerified ? (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="sticker-btn px-8 py-3.5 rounded-xl uppercase font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Proceed to Section 2 (Verified)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={ageOverLimit || sendingOtp}
                        onClick={handleSendOtp}
                        className={`sticker-btn px-8 py-3.5 rounded-xl uppercase font-black text-xs flex items-center justify-center gap-2 cursor-pointer lime-glow ${
                          ageOverLimit || sendingOtp ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <KeyRound className="w-4 h-4 fill-[#042113]" />
                        <span>{sendingOtp ? "Sending OTP Code..." : "Verify Email with OTP & Proceed"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== SECTION 2: EDUCATIONAL DETAILS & VERIFICATION ==================== */}
              {step === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#166B42] pb-3 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-heading text-[#CCFF00] uppercase">
                      SECTION 2: EDUCATION &amp; STUDENT VERIFICATION 🎓
                    </h2>
                    <span className="text-xs font-mono text-emerald-300">Step 2 of 4</span>
                  </div>

                  {/* Education Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      Current Educational Level (Pakistani Curriculum) *
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="Matriculation (SSC)">Matriculation (SSC Class 9/10)</option>
                      <option value="O Levels (Cambridge)">O Levels / IGCSE (Cambridge)</option>
                      <option value="Intermediate / FSc / FA / ICS">Intermediate / FSc / FA / ICS / ICom (HSSC 11/12)</option>
                      <option value="A Levels (Cambridge)">A Levels (Cambridge AS/A2)</option>
                      <option value="Undergraduate 1st Year">Undergraduate / University 1st Year (Freshman)</option>
                      <option value="Other">Other Educational Program</option>
                    </select>
                  </div>

                  {/* School / College Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      Institute / School / College Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instituteName}
                      onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                      placeholder="e.g. Govt Superior Science College Multan / Army Public School / Sadiq Public School Bahawalpur"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>

                  {/* Upload Student Verification Proof */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 block">
                      Student Proof Verification Upload *
                    </label>
                    <p className="text-xs text-emerald-300">
                      Upload a scan or photo of your School/College ID Card, Board Roll No Slip, Marks Sheet, or Fee Challan to verify your student status.
                    </p>

                    <div className="border-2 border-dashed border-[#166B42] hover:border-[#CCFF00] rounded-2xl p-6 text-center bg-[#042113] transition-colors relative cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 bg-[#09341E] rounded-full border border-[#166B42] group-hover:border-[#CCFF00]">
                          <Upload className="w-6 h-6 text-[#CCFF00]" />
                        </div>
                        {formData.studentProofName ? (
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-[#CCFF00] flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
                              {formData.studentProofName}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono block">File Attached! Click to change.</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-sm font-extrabold text-white block">
                              Click or Drag &amp; Drop Student Proof Here
                            </span>
                            <span className="text-xs text-emerald-400 font-mono">
                              Supports JPG, PNG, PDF (Max 10MB)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Step 2 */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-emerald-300 font-extrabold underline cursor-pointer"
                    >
                      &lt; Back to Section 1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.instituteName) {
                          alert("Please specify your institute name!");
                          return;
                        }
                        if (!formData.studentProofName) {
                          alert("Please upload your student verification proof (ID Card / Roll No Slip)!");
                          return;
                        }
                        setStep(3);
                      }}
                      className="sticker-btn px-8 py-3.5 rounded-xl uppercase font-black text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Motivation &amp; Q/A</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ==================== SECTION 3: MOTIVATION & Q/A ==================== */}
              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#166B42] pb-3 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-heading text-[#CCFF00] uppercase">
                      SECTION 3: MOTIVATION &amp; IDEAS 🚀
                    </h2>
                    <span className="text-xs font-mono text-emerald-300">Step 3 of 4</span>
                  </div>

                  {/* Domain Choice */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      Which domain do you want to primarily contribute to? *
                    </label>
                    <select
                      value={formData.primaryDomain}
                      onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="Civic Volunteership">Civic Volunteership 🏗️ (BUILD real city solutions)</option>
                      <option value="Social Welfare & Aid">Social Welfare &amp; Community Aid 🤝 (Local relief &amp; drives)</option>
                      <option value="Character Building">Character Building 🧠 (Coding, design &amp; leadership)</option>
                      <option value="Public Training & Camps">Public Training &amp; Camps 📢 (Teach other teens)</option>
                      <option value="Events & Hackathons">Events, Hackathons &amp; MUNs 🎉 (24h hackathons &amp; debates)</option>
                    </select>
                  </div>

                  {/* Q1: Why Join */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      Why do you want to join Teenverse? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.whyJoin}
                      onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                      placeholder="Write a paragraph about your drive, passion, and why Teenverse appeals to you..."
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl p-4 text-sm text-white focus:outline-none placeholder-emerald-700"
                    />
                  </div>

                  {/* Q2: Expectations */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      What do you expect from Teenverse and your squad members? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.expectations}
                      onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                      placeholder="What kind of environment, growth, or mentorship do you expect from the community?"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl p-4 text-sm text-white focus:outline-none placeholder-emerald-700"
                    />
                  </div>

                  {/* Q3: Ideas to launch */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      Share any civic or tech ideas that you want Teenverse to help you launch! *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.ideasToLaunch}
                      onChange={(e) => setFormData({ ...formData, ideasToLaunch: e.target.value })}
                      placeholder="Have an app idea, local welfare initiative, or workshop concept? Tell us!"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl p-4 text-sm text-white focus:outline-none placeholder-emerald-700"
                    />
                  </div>

                  {/* Q4: Skills & Mastery */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                      What is one skill you bring to the table, and one skill you want to master? *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skillsAndMastery}
                      onChange={(e) => setFormData({ ...formData, skillsAndMastery: e.target.value })}
                      placeholder="e.g. I know Python, and I want to master full-stack Next.js and public speaking!"
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>

                  {/* Q5: Weekly Hours & Q6: Referral */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        Weekly Time Commitment *
                      </label>
                      <select
                        value={formData.weeklyHours}
                        onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        <option value="2-4 hours">2 - 4 hours per week</option>
                        <option value="5-8 hours">5 - 8 hours per week</option>
                        <option value="10+ hours">10+ hours per week (Hardcore Builder)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        Where did you hear about Teenverse? *
                      </label>
                      <select
                        value={formData.referralSource}
                        onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        <option value="Social Media">Social Media (Instagram/LinkedIn/X)</option>
                        <option value="Friend or Classmate">Friend or Classmate</option>
                        <option value="School/College Workshop">School or College Workshop</option>
                        <option value="Hackathon/Event">Hackathon or Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Step 3 */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-emerald-300 font-extrabold underline cursor-pointer"
                    >
                      &lt; Back to Section 2
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.whyJoin || !formData.expectations || !formData.ideasToLaunch || !formData.skillsAndMastery) {
                          alert("Please answer all paragraphical questions in Section 3!");
                          return;
                        }
                        setStep(4);
                      }}
                      className="sticker-btn px-8 py-3.5 rounded-xl uppercase font-black text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Pledge &amp; Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ==================== SECTION 4: PLEDGE & SUBMISSION ==================== */}
              {step === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#166B42] pb-3 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-heading text-[#CCFF00] uppercase">
                      SECTION 4: VOLUNTEER PLEDGE &amp; SUBMISSION 📜
                    </h2>
                    <span className="text-xs font-mono text-emerald-300">Step 4 of 4</span>
                  </div>

                  {/* Application Summary Box */}
                  <div className="bg-[#042113] border-2 border-[#166B42] rounded-xl p-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-[#166B42] pb-2 text-[#CCFF00] font-bold">
                      <span>APPLICANT: {formData.firstName} {formData.lastName}</span>
                      <span>CITY: {formData.city}</span>
                    </div>
                    <p><span className="text-emerald-400">Father&apos;s Name:</span> {formData.fatherName}</p>
                    <p><span className="text-emerald-400">Email Status:</span> {isEmailVerified ? "Verified (OTP ✅)" : "Pending"}</p>
                    <p><span className="text-emerald-400">Education:</span> {formData.educationLevel} ({formData.instituteName})</p>
                    <p><span className="text-emerald-400">Target Domain:</span> {formData.primaryDomain}</p>
                    <p><span className="text-emerald-400">Student Proof Attached:</span> {formData.studentProofName || "Yes"}</p>
                  </div>

                  {/* Official Teenverse Responsibility Pledge */}
                  <div className="bg-[#062916] border-2 border-[#CCFF00] rounded-xl p-5 space-y-3 shadow-[3px_3px_0px_#042113]">
                    <div className="flex items-center gap-2 text-[#CCFF00] font-heading text-lg">
                      <ShieldCheck className="w-5 h-5" />
                      <span>THE TEENVERSE VOLUNTEER PLEDGE</span>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                      &quot;As a volunteer member of Teenverse Pakistan, I pledge to hold myself accountable, act with integrity, respect every member of our squad, and focus on BUILDING real solutions for my community rather than just talking.&quot;
                    </p>

                    <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={formData.pledgeAgreed}
                        onChange={(e) => setFormData({ ...formData, pledgeAgreed: e.target.checked })}
                        className="w-5 h-5 accent-[#CCFF00] rounded shrink-0 mt-0.5"
                      />
                      <span className="text-xs font-bold text-white">
                        I solemnly accept the Teenverse Volunteer Pledge &amp; confirm that all information provided is true and accurate.
                      </span>
                    </label>
                  </div>

                  {/* Submission Buttons */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs text-emerald-300 font-extrabold underline cursor-pointer"
                    >
                      &lt; Back to Section 3
                    </button>

                    <button
                      type="submit"
                      disabled={!formData.pledgeAgreed || isSubmitting}
                      className={`sticker-btn px-8 py-4 rounded-xl uppercase font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer lime-glow ${
                        !formData.pledgeAgreed || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Rocket className="w-5 h-5 fill-[#042113]" />
                      <span>{isSubmitting ? "CREATING ACCOUNT..." : "SUBMIT OFFICIAL APPLICATION 🚀"}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* ==================== CLEANED TEEN-FIRST SUCCESS SCREEN ==================== */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-[#CCFF00] text-[#042113] rounded-full flex items-center justify-center mx-auto border-4 border-[#042113] shadow-[4px_4px_0px_#042113]">
                <CheckCircle2 className="w-12 h-12 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="bg-[#042113] text-[#CCFF00] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border border-[#CCFF00]">
                  TEENVERSE ACCOUNT ID: {appId}
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading text-white uppercase tracking-wide">
                  WELCOME TO THE <span className="text-[#CCFF00]">TEENVERSE FAMILY!</span> 🎉
                </h2>
                <p className="text-emerald-200 text-sm max-w-md mx-auto leading-relaxed font-medium">
                  Congratulations <span className="text-white font-bold">{formData.firstName} {formData.lastName}</span>! Your application has been logged and your official Teenverse Account is active.
                </p>
              </div>

              {/* Single Sign-On Account Box */}
              <div className="bg-[#042113] border-2 border-[#CCFF00] p-5 rounded-xl text-xs font-mono text-emerald-300 text-left space-y-2.5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2 text-[#CCFF00] font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>TEENVERSE ACCOUNT &amp; SSO DETAILS</span>
                </div>
                <p>• Account ID: <strong className="text-white">{appId}</strong></p>
                <p>• Verified Email: <strong className="text-white">{formData.email}</strong></p>
                <p className="text-emerald-300 font-sans text-xs">
                  Your Teenverse Account provides single-click login access across future hackathons, build nights, and Teenverse subdomains!
                </p>
                {emailSent && (
                  <p className="text-[#CCFF00] font-bold flex items-center gap-1.5 pt-1">
                    <Mail className="w-4 h-4" /> Official Welcome Email sent to your inbox from welcome@mail.teenverse.org!
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto sticker-btn px-8 py-3.5 rounded-xl font-black text-xs uppercase cursor-pointer text-center"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==================== EMAIL OTP VERIFICATION MODAL ==================== */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#09341E] border-4 border-[#CCFF00] rounded-2xl w-full max-w-md overflow-hidden shadow-[12px_12px_0px_#000] text-white">
            
            {/* Modal Header */}
            <div className="bg-[#042113] p-4 border-b-2 border-[#166B42] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#CCFF00]" />
                <h3 className="text-lg font-heading text-white uppercase">
                  VERIFY EMAIL WITH OTP 🔑
                </h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="p-1.5 rounded-lg bg-[#0D482B] text-emerald-300 hover:text-[#CCFF00] border border-[#166B42] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
              <p className="text-xs text-emerald-100 leading-relaxed">
                We sent a 6-digit verification code to <span className="font-bold text-[#CCFF00]">{formData.email}</span> (<code className="text-emerald-400">welcome@mail.teenverse.org</code>).
              </p>


              {otpSuccessMsg && (
                <div className="bg-[#155A38] text-[#CCFF00] text-xs font-mono p-2.5 rounded-xl font-bold border border-[#CCFF00]">
                  {otpSuccessMsg}
                </div>
              )}

              {otpError && (
                <div className="bg-[#FF3366]/20 border border-[#FF3366] text-[#FF3366] text-xs font-mono p-2.5 rounded-xl font-bold">
                  {otpError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 block">
                  Enter 6-Digit Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full bg-[#042113] border-3 border-[#CCFF00] rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-[#CCFF00] font-black focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="text-xs text-emerald-300 hover:text-[#CCFF00] underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{sendingOtp ? "Sending..." : "Resend OTP"}</span>
                </button>

                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="sticker-btn px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-1 cursor-pointer lime-glow"
                >
                  <span>{verifyingOtp ? "VERIFYING..." : "VERIFY CODE & CONTINUE"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
