"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowUpRight, Trophy } from "lucide-react";

export default function EventsSection() {
  const events = [
    {
      id: 1,
      title: "TEENVERSE HACKATHON '26",
      category: "Hackathon",
      status: "REGISTRATION OPEN 🔥",
      statusBg: "bg-[#CCFF00] text-[#042113]",
      date: "August 28-29, 2026",
      location: "Bahawalpur & Hybrid Online",
      description: "24 hours of non-stop building, pizza, swag, and PKR 150,000+ in project prizes for Pakistani teen builders!",
      tag: "Coding & Design"
    },
    {
      id: 2,
      title: "CIVIC BUILD SPRINTS #04",
      category: "Civic Action",
      status: "THIS WEEKEND 🏗️",
      statusBg: "bg-[#00F0FF] text-[#042113]",
      date: "Saturday, August 16",
      location: "Multan & Bahawalpur",
      description: "Building open-source mobile tools & neighborhood mapping dashboards for local municipal challenges.",
      tag: "Civic Tech"
    },
    {
      id: 3,
      title: "TEENVERSE MODEL UN (MUN)",
      category: "Debate & MUN",
      status: "UPCOMING 📢",
      statusBg: "bg-[#FF9900] text-[#042113]",
      date: "September 12-14, 2026",
      location: "Multan",
      description: "Youth diplomacy, technology ethics, climate crisis action, and high-energy committee debates.",
      tag: "Leadership & MUN"
    },

    {
      id: 4,
      title: "PUBLIC CODING WORKSHOP",
      category: "Public Training",
      status: "FREE FOR TEENS 🎓",
      statusBg: "bg-[#FF3366] text-white",
      date: "Every Sunday 4 PM",
      location: "Online (Discord Live)",
      description: "Learn Next.js, Figma, and Python from scratch. Open to all Pakistani teenagers regardless of prior experience.",
      tag: "Free Workshop"
    }
  ];

  return (
    <section id="events" className="py-14 md:py-20 bg-[#062916] relative border-b-4 border-[#042113]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#042113] border border-[#166B42] text-[#CCFF00] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>UPCOMING ACTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide">
              EVENTS &amp; <span className="text-[#CCFF00]">HACKATHONS</span>
            </h2>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-xl">
              Where cool nerds gather, compete, build projects, and have a blast.
            </p>
          </div>

          <Link
            href="/apply"
            className="sticker-btn text-xs sm:text-sm px-5 py-3 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer text-center"
          >
            <Trophy className="w-4 h-4" />
            <span>Register for Events</span>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#09341E] border-3 border-[#166B42] hover:border-[#CCFF00] rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-[5px_5px_0px_#03170D] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-extrabold text-[#CCFF00] bg-[#042113] px-2.5 py-0.5 rounded border border-[#166B42]">
                    {evt.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-[2px_2px_0px_#042113] ${evt.statusBg}`}>
                    {evt.status}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-heading text-white group-hover:text-[#CCFF00] transition-colors mb-2">
                  {evt.title}
                </h3>

                <p className="text-emerald-100 text-xs sm:text-sm mb-4 leading-relaxed">
                  {evt.description}
                </p>

                <div className="space-y-1.5 text-xs font-mono text-emerald-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#CCFF00]" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#CCFF00]" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#166B42] flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  #{evt.tag}
                </span>
                <Link
                  href="/apply"
                  className="text-xs text-[#CCFF00] font-extrabold flex items-center gap-1 group-hover:underline cursor-pointer uppercase"
                >
                  <span>Join Event</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
