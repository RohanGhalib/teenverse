"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { X, ArrowRight, CheckCircle2, User, Phone, Rocket } from "lucide-react";


interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    city: "Bahawalpur",

    whatsapp: "",
    primaryDomain: "Civic Volunteership",
    superpower: "Coding & Web",
    excitementText: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#CCFF00", "#FF3366", "#00F0FF", "#FF9900"],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    triggerConfetti();
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#09341E] border-t-4 sm:border-4 border-[#CCFF00] rounded-t-2xl sm:rounded-2xl w-full max-w-xl overflow-hidden shadow-[12px_12px_0px_#000] relative text-white max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="bg-[#042113] p-4 sm:p-5 border-b-2 border-[#166B42] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-heading text-white uppercase tracking-wide">
              VOLUNTEER APPLICATION <span className="text-[#CCFF00] font-mono text-xs">['26]</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0D482B] text-emerald-300 hover:text-[#CCFF00] border border-[#166B42] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Step Progress Bar */}
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-emerald-300 pb-2 border-b border-[#166B42]">
                <span className={step >= 1 ? "text-[#CCFF00]" : ""}>1. YOUR DETAILS</span>
                <span>&gt;&gt;</span>
                <span className={step >= 2 ? "text-[#CCFF00]" : ""}>2. DOMAIN</span>
                <span>&gt;&gt;</span>
                <span className={step >= 3 ? "text-[#CCFF00]" : ""}>3. SUPERPOWER</span>
              </div>

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg sm:text-xl font-heading text-[#CCFF00] uppercase">
                    Step 1: Tell Us Who You Are 🚀
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-emerald-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rohan Ghalib"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                        Age (13-19) *
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="20"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="e.g. 17"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-3 py-3 text-sm text-white focus:outline-none"
                      >
                        <option value="Bahawalpur">Bahawalpur</option>
                        <option value="Multan">Multan</option>
                        <option value="Other">Other / Online</option>
                      </select>
                    </div>

                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                      WhatsApp / Discord Handle *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+92 300 1234567 or handle#1234"
                        className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.fullName && formData.age && formData.whatsapp) {
                          setStep(2);
                        } else {
                          alert("Please fill in your name, age, and contact handle!");
                        }
                      }}
                      className="w-full sm:w-auto sticker-btn px-6 py-3.5 rounded-xl uppercase font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Next: Select Domain</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Choose Domain */}
              {step === 2 && (
                <div className="space-y-3">
                  <h4 className="text-lg sm:text-xl font-heading text-[#CCFF00] uppercase">
                    Step 2: Pick Primary Domain 🎯
                  </h4>

                  <div className="space-y-2">
                    {[
                      { id: "Civic Volunteership", label: "Civic Volunteership 🏗️", desc: "BUILD real solutions for city problems" },
                      { id: "Social Welfare & Aid", label: "Social Welfare & Aid 🤝", desc: "Direct local relief & community support" },
                      { id: "Character Building", label: "Character Building 🧠", desc: "Learn coding, Figma design & leadership" },

                      { id: "Public Training & Camps", label: "Public Camps 📢", desc: "Teach & host workshops for high schoolers" },
                      { id: "Events & Hackathons", label: "Events & Hackathons 🎉", desc: "24h hackathons, MUNs & meetups" },
                    ].map((dom) => (
                      <label
                        key={dom.id}
                        onClick={() => setFormData({ ...formData, primaryDomain: dom.id })}
                        className={`block p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.primaryDomain === dom.id
                            ? "bg-[#042113] border-[#CCFF00] shadow-[3px_3px_0px_#CCFF00]"
                            : "bg-[#062916] border-[#166B42] hover:border-emerald-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs sm:text-sm text-white">{dom.label}</span>
                          <input
                            type="radio"
                            name="domain"
                            checked={formData.primaryDomain === dom.id}
                            onChange={() => {}}
                            className="accent-[#CCFF00]"
                          />
                        </div>
                        <p className="text-[11px] text-emerald-300 mt-0.5">{dom.desc}</p>
                      </label>
                    ))}
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-emerald-300 font-extrabold underline cursor-pointer"
                    >
                      &lt; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="sticker-btn px-6 py-3 rounded-xl uppercase font-black text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Next: Superpower</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Superpower & Submit */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg sm:text-xl font-heading text-[#CCFF00] uppercase">
                    Step 3: What&apos;s Your Superpower? ⚡
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                      Primary Skill or Interest *
                    </label>
                    <select
                      value={formData.superpower}
                      onChange={(e) => setFormData({ ...formData, superpower: e.target.value })}
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="Coding & Web">Coding / Web Development (HTML/JS/Next.js/Python)</option>
                      <option value="UI/UX Design">UI/UX & Graphic Design (Figma)</option>
                      <option value="Video & Content">Video Editing & Social Content</option>
                      <option value="Event Organizing">Event Organizing & MUN Debating</option>
                      <option value="Civic Action">On-ground Volunteership & Action</option>
                      <option value="Eager Learner">Eager Beginner ready to learn!</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                      Why do you want to join Teenverse? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.excitementText}
                      onChange={(e) => setFormData({ ...formData, excitementText: e.target.value })}
                      placeholder="Tell us what excites you or a problem around you that you want to fix..."
                      className="w-full bg-[#042113] border-2 border-[#166B42] focus:border-[#CCFF00] rounded-xl p-3 text-sm text-white focus:outline-none placeholder-emerald-700"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-emerald-300 font-extrabold underline cursor-pointer"
                    >
                      &lt; Back
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto sticker-btn px-6 py-3.5 rounded-xl uppercase font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer lime-glow"
                    >
                      <Rocket className="w-4 h-4 fill-[#042113]" />
                      <span>SUBMIT APPLICATION 🚀</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* Success Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-[#CCFF00] text-[#042113] rounded-full flex items-center justify-center mx-auto border-4 border-[#042113] shadow-[3px_3px_0px_#042113]">
                <CheckCircle2 className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-heading text-white uppercase">
                  WELCOME TO THE <span className="text-[#CCFF00]">SQUAD!</span> 🎉
                </h4>
                <p className="text-emerald-200 text-xs sm:text-sm">
                  Awesome work, <span className="text-white font-bold">{formData.fullName}</span>! Your volunteer application for <span className="text-[#CCFF00] font-bold">{formData.primaryDomain}</span> has been received!
                </p>
              </div>

              <div className="bg-[#042113] border-2 border-[#166B42] p-3.5 rounded-xl text-xs font-mono text-emerald-300 text-left space-y-1">
                <p className="text-[#CCFF00] font-bold">NEXT STEPS:</p>
                <p>1. Our team will reach out to you via WhatsApp / Discord within 24 hours.</p>
                <p>2. Get ready for our upcoming build sprints &amp; workshops!</p>
              </div>

              <button
                onClick={handleReset}
                className="sticker-btn px-6 py-3 rounded-xl font-black text-xs uppercase cursor-pointer"
              >
                Done &amp; Back To Site
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
