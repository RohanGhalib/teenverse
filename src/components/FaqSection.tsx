"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What exactly is Teenverse?",
      a: "Teenverse is a community of excited, energetic, playful, and talented Pakistani teenagers. We work in 5 core domains: Civic Volunteership, Social Welfare, Character Building, Public Camps, and Events (Hackathons, MUNs & Parties)."
    },
    {
      q: "Do I need prior coding or technical experience to join?",
      a: "Not at all! Whether you are a writer, designer, debater, social enthusiast, or just curious to learn, there is a place for you. We provide internal training to teach members skills like coding, UI design, character development, and leadership."
    },
    {
      q: "What is Civic Volunteership: 'BUILD not propose'?",
      a: "Instead of sitting in meetings making PowerPoint presentations or writing complaints, civic volunteers at Teenverse BUILD tangible solutions. This includes building custom apps for local issues, setting up public recycling kits, or organizing neighborhood tech drives."
    },
    {
      q: "What age group can apply to be a volunteer?",
      a: "Teenverse is built by teens for teens! Typically high schoolers, O/A Level students, and teenagers between 13 to 19 years old."
    },
    {
      q: "How can I get involved right now?",
      a: "Click the 'Apply to be a Volunteer' button on this page! Fill out the quick multi-step application form, select your domain of interest, and our squad leads will onboard you to our community!"
    }
  ];

  return (
    <section id="faq" className="py-14 md:py-20 bg-[#042113] relative border-b-4 border-[#042113] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#09341E] border border-[#166B42] text-[#CCFF00] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading uppercase text-white tracking-wide">
            GOT <span className="text-[#CCFF00]">QUESTIONS?</span> WE&apos;VE GOT ANSWERS!
          </h2>
          <p className="text-emerald-200 text-xs sm:text-sm">
            Everything you need to know about joining the coolest teen community in Pakistan.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#062916] border-2 border-[#166B42] hover:border-[#CCFF00] rounded-xl overflow-hidden transition-all shadow-[3px_3px_0px_#03170D]"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-sm sm:text-base flex items-center justify-between gap-3 text-emerald-100 hover:text-[#CCFF00] cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[#CCFF00] font-mono text-xs sm:text-sm">0{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#CCFF00] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 text-emerald-200 text-xs sm:text-sm leading-relaxed border-t border-[#166B42] pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Discord Banner in FAQ */}
        <div className="mt-8 bg-[#09341E] border-2 border-[#5865F2] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-[4px_4px_0px_#000]">
          <div className="space-y-1">
            <h4 className="text-white font-heading text-lg uppercase flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="w-5 h-5 text-[#5865F2]" />
              <span>HAVE MORE QUESTIONS?</span>
            </h4>
            <p className="text-emerald-200 text-xs font-medium">
              Join our official Discord server to ask questions directly to our squad leaders!
            </p>
          </div>
          <a
            href="https://discord.gg/V4bfGJJj7e"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
          >
            Join Discord Server
          </a>
        </div>

      </div>
    </section>
  );
}
