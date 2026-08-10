"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Code, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative craft-grid pt-10 pb-16 md:pt-16 md:pb-28 overflow-x-hidden border-b-4 border-[#042113]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Main Logo Sticker & Headline */}
          <div className="space-y-4">
            <div className="flex justify-center mb-4 sm:mb-6 pt-2">
              <div className="relative w-56 h-16 sm:w-80 sm:h-24 md:w-[400px] md:h-32 transform -rotate-2 hover:rotate-1 transition-transform duration-300 drop-shadow-[5px_6px_0px_#03170D]">
                <Image
                  src="/logo.png"
                  alt="TEENVERSE"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-heading tracking-wide text-white leading-[1.1] uppercase">
              WE ARE A COMMUNITY OF{" "}
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/apply"
              className="w-full sm:w-auto sticker-btn text-sm sm:text-base md:text-lg px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider font-black lime-glow text-center"
            >
              <span>Apply to be a Volunteer</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#domains"
              className="w-full sm:w-auto bg-[#0D482B] text-emerald-100 font-extrabold hover:text-[#CCFF00] text-sm sm:text-base md:text-lg px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl border-3 border-[#166B42] hover:border-[#CCFF00] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#03170D] transition-all text-center"
            >
              <Zap className="w-5 h-5 text-[#CCFF00]" />
              <span>Explore 5 Domains</span>
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
          <span>BUILD REAL SOLUTIONS</span>
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
