"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Wrench, 
  HeartHandshake, 
  GraduationCap, 
  BookOpen, 
  PartyPopper, 
  ArrowUpRight 
} from "lucide-react";

export default function Domains() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const domains = [
    {
      id: "civic",
      category: "core",
      title: "Civic Volunteership",
      subtitle: "BUILD, NOT PROPOSE.",
      icon: Wrench,
      badge: "BUILDERS 🏗️",
      badgeBg: "bg-[#CCFF00] text-[#042113]",
      description: "We don't make slides or endless reports. We identify real civic problems in Pakistani cities and BUILD physical or tech solutions for them.",
      tags: ["#BuildNotPropose", "#CivicTech"]
    },
    {
      id: "welfare",
      category: "impact",
      title: "Social Welfare & Aid",
      subtitle: "DIRECT LOCAL IMPACT",
      icon: HeartHandshake,
      badge: "WELFARE 🤝",
      badgeBg: "bg-[#FF3366] text-white",
      description: "Rooted in local Pakistani community support. Direct heatwave aid, ration drives, book donations, and tech-enabled relief.",
      tags: ["#LocalRelief", "#CommunitySupport"]
    },
    {
      id: "character-building",
      category: "education",
      title: "Character Building",
      subtitle: "SKILLS + LEADERSHIP",
      icon: GraduationCap,
      badge: "DEVELOPMENT 🧠",
      badgeBg: "bg-[#00F0FF] text-[#042113]",
      description: "Hands-on bootcamps in coding (Next.js, Python), Figma UI/UX, leadership, public speaking, and personal character development.",
      tags: ["#Skillup", "#Leadership"]
    },
    {
      id: "public-training",
      category: "education",
      title: "Public Training & Camps",
      subtitle: "TEACHING OTHER TEENS",
      icon: BookOpen,
      badge: "PUBLIC CAMPS 📢",
      badgeBg: "bg-[#FF9900] text-[#042113]",
      description: "Whatever our team knows, we pass it on! Free weekend coding bootcamps and design workshops for high schoolers across Pakistan.",
      tags: ["#FreeWorkshops", "#TeenCoders"]
    },
    {
      id: "events",
      category: "fun",
      title: "Events, Hackathons & MUNs",
      subtitle: "WORK HARD, PARTY HARDER",
      icon: PartyPopper,
      badge: "HIGH ENERGY ⚡",
      badgeBg: "bg-[#D4FF00] text-[#042113]",
      description: "24-hour teen hackathons, MUN debates, build nights, gaming meetups, and community parties.",
      tags: ["#Hackathons", "#MUNs"]
    }
  ];

  const filteredDomains = activeTab === "all" 
    ? domains 
    : domains.filter(d => d.category === activeTab);

  return (
    <section id="domains" className="py-14 md:py-20 bg-[#062916] relative border-b-4 border-[#042113] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#042113] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <span>OUR 5 PILLARS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading uppercase tracking-wide text-white">
            WHAT WE <span className="text-[#CCFF00]">DO AT TEENVERSE</span>
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto font-medium">
            No fluff. No complicated setups. Pick a domain you love or contribute across all 5!
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              { id: "all", label: "All 5 Pillars ✨" },
              { id: "core", label: "Civic Action 🏗️" },
              { id: "impact", label: "Welfare 🤝" },
              { id: "education", label: "Character Building 🧠" },
              { id: "fun", label: "Events & Hackathons 🎉" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#CCFF00] text-[#042113] border-2 border-[#042113] shadow-[3px_3px_0px_#042113]"
                    : "bg-[#0A3822] text-emerald-200 border border-[#166B42] hover:bg-[#0D482B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                className="bg-[#09341E] border-3 border-[#166B42] hover:border-[#CCFF00] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[5px_5px_0px_#03170D] transition-all duration-200 group"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-2.5 bg-[#042113] rounded-xl border-2 border-[#166B42] group-hover:border-[#CCFF00] transition-colors">
                      <Icon className="w-6 h-6 text-[#CCFF00]" />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border border-[#042113] shadow-[2px_2px_0px_#042113] ${domain.badgeBg}`}>
                      {domain.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[11px] font-mono font-bold text-[#CCFF00] uppercase tracking-wider block">
                      {domain.subtitle}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading text-white group-hover:text-[#CCFF00] transition-colors">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-4">
                    {domain.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {domain.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#042113] text-[#CCFF00] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#166B42]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Single Simple CTA */}
                <Link
                  href="/apply"
                  className="w-full bg-[#042113] text-[#CCFF00] font-extrabold text-xs py-3 px-4 rounded-xl border border-[#166B42] group-hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-[#042113] transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-center"
                >
                  <span>Apply for {domain.title.split(' ')[0]}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-12 bg-[#042113] border-3 border-[#CCFF00] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-[6px_6px_0px_#03170D]">
          <h3 className="text-2xl sm:text-3xl font-heading text-white">
            CAN&apos;T DECIDE WHICH ONE TO JOIN? 🤓
          </h3>
          <p className="text-emerald-200 text-xs sm:text-sm max-w-xl mx-auto">
            You don&apos;t have to pick just one! You can participate across multiple domains or swap anytime.
          </p>
          <div className="pt-1">
            <Link
              href="/apply"
              className="sticker-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer text-center"
            >
              <span>Apply &amp; Join The Squad</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
