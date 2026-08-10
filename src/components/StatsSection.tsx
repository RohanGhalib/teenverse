"use client";

import React from "react";
import { Users, Wrench, GraduationCap, PartyPopper } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "TEEN BUILDERS",
      desc: "Teens across Pakistan",
      color: "text-[#CCFF00]"
    },
    {
      icon: Wrench,
      value: "18+",
      label: "CIVIC SOLUTIONS",
      desc: "Real problems solved with action",
      color: "text-[#FF3366]"
    },
    {
      icon: GraduationCap,
      value: "35+",
      label: "WORKSHOPS & CAMPS",
      desc: "Coding, design & leadership",
      color: "text-[#00F0FF]"
    },
    {
      icon: PartyPopper,
      value: "12+",
      label: "HACKATHONS & MUNS",
      desc: "Epic teen meetups & jams",
      color: "text-[#FF9900]"
    },
  ];

  return (
    <section id="manifesto" className="py-12 md:py-16 bg-[#042113] border-b-4 border-[#042113] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Manifesto Box */}
        <div className="bg-[#09341E] border-3 border-[#166B42] rounded-2xl p-5 sm:p-8 mb-10 shadow-[5px_5px_0px_#03170D] flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-wider">
              OUR CORE IDENTITY
            </span>
            <h3 className="text-xl sm:text-3xl font-heading uppercase text-white">
              &quot;SO BASICALLY WE ARE COOL NERDS WHO DO FUN THINGS.&quot;
            </h3>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-2xl">
              Teenverse brings together coders, designers, debaters, thinkers, and social changemakers under one roof. No bureaucracy, no age limits, just pure drive and execution.
            </p>
          </div>

          <div className="shrink-0 bg-[#CCFF00] text-[#042113] px-5 py-3 rounded-xl border-3 border-[#042113] font-black text-center shadow-[3px_3px_0px_#042113] transform rotate-1">
            <span className="block text-xl font-mono">100%</span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold">TEEN-RUN &amp; OWNED</span>
          </div>
        </div>

        {/* Stats Grid - 2 Column Mobile First */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#062916] border-2 border-[#166B42] hover:border-[#CCFF00] p-4 sm:p-6 rounded-xl text-center space-y-1.5 shadow-[3px_3px_0px_#03170D] transition-transform duration-200"
              >
                <div className="inline-flex p-2.5 bg-[#042113] rounded-lg mb-1 border border-[#166B42]">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                </div>
                <div className={`text-2xl sm:text-4xl font-black font-mono tracking-tight ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-white">
                  {item.label}
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-300">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
