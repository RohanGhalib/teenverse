"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code, ShieldCheck, HeartHandshake, Zap, MessageSquare } from "lucide-react";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface HeroProps {
  onOpenApply?: () => void;
}

export default function Hero({ onOpenApply }: HeroProps) {
  return (
    <section className="relative pt-8 pb-14 md:pt-14 md:pb-20 border-b-4 border-[#042113] overflow-hidden craft-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-[#042113] border-2 border-[#CCFF00] px-4 py-1.5 rounded-full shadow-[4px_4px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-ping"></span>
            <span className="text-[#CCFF00] text-xs sm:text-sm font-mono font-extrabold tracking-wider uppercase">
              PAKISTAN&apos;S TEEN BUILDERS NETWORK 🇵🇰
            </span>
          </div>

          {/* Main Hero Headline with Running Sundays heading font */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading text-white tracking-wide uppercase leading-tight sm:leading-none">
              A COMMUNITY OF{" "}
              <span className="inline-block bg-[#CCFF00] text-[#042113] px-2.5 py-0.5 sm:px-3 sm:py-1 -rotate-1 rounded-xl border-3 sm:border-4 border-[#042113] shadow-[3px_3px_0px_#042113]">
                COOL NERDS
              </span>{" "}
              WHO DO FUN THINGS.
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-xl md:text-2xl text-emerald-100 font-medium max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
            Teenverse is a community of <span className="text-[#CCFF00] font-bold underline decoration-wavy">excited, energetic, playful &amp; talented</span> Pakistani teens. We don&apos;t just talk or propose ideas—we <span className="bg-[#155A38] text-white px-2 py-0.5 font-black rounded">BUILD</span> real civic tech, run public camps, host hackathons, and change our cities!
          </p>

          {/* Mobile-First Action CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/apply"
              className="w-full sm:w-auto sticker-btn text-sm sm:text-base md:text-lg px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider font-black lime-glow text-center"
            >
              <span>Apply to be a Volunteer</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="https://discord.gg/V4bfGJJj7e"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-sm sm:text-base md:text-lg px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border-3 border-[#042113] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#042113] transition-all text-center cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Discord</span>
            </a>

            <a
              href="https://instagram.com/teenversepk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-[#E1306C] to-[#F77737] hover:opacity-90 text-white font-extrabold text-sm sm:text-base md:text-lg px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border-3 border-[#042113] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#042113] transition-all text-center cursor-pointer"
            >
              <InstagramIcon className="w-5 h-5" />
              <span>Instagram</span>
            </a>

            <a
              href="#domains"
              className="w-full sm:w-auto bg-[#0D482B] text-emerald-100 font-extrabold hover:text-[#CCFF00] text-sm sm:text-base md:text-lg px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border-3 border-[#166B42] hover:border-[#CCFF00] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#03170D] transition-all text-center"
            >
              <Zap className="w-5 h-5 text-[#CCFF00]" />
              <span>5 Domains</span>
            </a>
          </div>

          {/* Responsive Floating Sticker Badges */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-3 select-none text-xs">
            <div className="bg-[#062916] text-[#CCFF00] border-2 border-[#166B42] px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 rotate-1 shadow-[2px_2px_0px_#042113]">
              <Code className="w-3.5 h-3.5" /> <span>BUILD Not Propose 🏗️</span>
            </div>
            <div className="bg-[#FF3366] text-white border-2 border-[#042113] px-3 py-1.5 rounded-lg font-black -rotate-2 shadow-[2px_2px_0px_#042113]">
              <span>NO BORING BOOMERS 🚫</span>
            </div>
            <a
              href="https://instagram.com/teenversepk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E1306C] text-white border-2 border-[#042113] px-3 py-1.5 rounded-lg font-black -rotate-1 shadow-[2px_2px_0px_#042113] hover:scale-105 transition-transform flex items-center gap-1"
            >
              <InstagramIcon className="w-3.5 h-3.5" /> @teenversepk
            </a>
            <a
              href="https://discord.gg/V4bfGJJj7e"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5865F2] text-white border-2 border-[#042113] px-3 py-1.5 rounded-lg font-black rotate-1 shadow-[2px_2px_0px_#042113] hover:scale-105 transition-transform"
            >
              💬 Discord Community 500+
            </a>
            <div className="bg-[#FF9900] text-[#042113] border-2 border-[#042113] px-3 py-1.5 rounded-lg font-black rotate-2 shadow-[2px_2px_0px_#042113]">
              <span>MUNs &amp; Hackathons 🚀</span>
            </div>
            <div className="bg-[#0D482B] text-[#CCFF00] border-2 border-[#CCFF00] px-3 py-1.5 rounded-lg font-extrabold -rotate-1 shadow-[2px_2px_0px_#042113]">
              <ShieldCheck className="w-3.5 h-3.5" /> <span>Character Building 🧠</span>
            </div>
            <div className="bg-[#00F0FF] text-[#042113] border-2 border-[#042113] px-3 py-1.5 rounded-lg font-black rotate-1 shadow-[2px_2px_0px_#042113]">
              <HeartHandshake className="w-3.5 h-3.5" /> <span>Social Welfare 🤝</span>
            </div>
          </div>

        </div>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="mt-12 bg-[#CCFF00] text-[#042113] py-2.5 border-y-4 border-[#042113] overflow-hidden font-black text-xs sm:text-sm uppercase tracking-widest font-mono">
        <div className="animate-marquee whitespace-nowrap flex gap-6 sm:gap-8">
          <span>⚡ CIVIC VOLUNTEERSHIP</span>
          <span>•</span>
          <span>INSTAGRAM: @TEENVERSEPK</span>
          <span>•</span>
          <span>BUILD REAL SOLUTIONS</span>
          <span>•</span>
          <span>DISCORD: DISCORD.GG/V4BFGJJJ7E</span>
          <span>•</span>
          <span>CHARACTER BUILDING</span>
          <span>•</span>
          <span>PUBLIC WORKSHOPS &amp; CAMPS</span>
          <span>•</span>
          <span>MUNS &amp; HACKATHONS</span>
          <span>•</span>
          <span>WELFARE IMPACT</span>
          <span>•</span>
          <span>COOL NERDS UNITE 🇵🇰</span>
          <span>•</span>
          <span>TEENVERSE PAKISTAN</span>
        </div>
      </div>
    </section>
  );
}
