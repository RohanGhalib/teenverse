"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Code2, Globe, MessageSquare, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#03170D] border-t-4 border-[#CCFF00] text-white pt-14 pb-12 relative craft-grid-dense">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#166B42]">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative w-48 h-14">
              <Image
                src="/logo.png"
                alt="TEENVERSE Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-emerald-200 text-sm max-w-md leading-relaxed">
              Teenverse is a community of excited, energetic, playful, and talented Pakistani teens. We build civic tech, run bootcamps, host hackathons &amp; MUNs, and change our cities for good.
            </p>
            
            <div className="flex flex-wrap gap-2 text-xs font-mono pt-2">
              <span className="bg-[#0D482B] text-[#CCFF00] px-3 py-1 rounded border border-[#166B42]">
                🇵🇰 Built in Pakistan
              </span>
              <span className="bg-[#0D482B] text-[#CCFF00] px-3 py-1 rounded border border-[#166B42]">
                ⚡ 100% Teen Powered
              </span>
              <span className="bg-[#0D482B] text-[#CCFF00] px-3 py-1 rounded border border-[#166B42]">
                💚 100% Teen Energy
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 font-extrabold text-sm">
            <h4 className="text-[#CCFF00] font-mono text-xs uppercase tracking-wider">
              NAVIGATE
            </h4>
            <ul className="space-y-2 text-emerald-200">
              <li>
                <a href="#domains" className="hover:text-[#CCFF00] transition-colors">
                  5 Core Domains
                </a>
              </li>
              <li>
                <a href="#manifesto" className="hover:text-[#CCFF00] transition-colors">
                  Who We Are
                </a>
              </li>
              <li>
                <a href="#terminal" className="hover:text-[#CCFF00] transition-colors">
                  Hacker CLI Terminal
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#CCFF00] transition-colors">
                  Events &amp; Hackathons
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#CCFF00] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Action & Community */}
          <div className="space-y-4">
            <h4 className="text-[#CCFF00] font-mono text-xs uppercase tracking-wider">
              JOIN THE MOVEMENT
            </h4>
            <p className="text-xs text-emerald-300">
              Ready to build civic solutions and hang out with the coolest teens in Pakistan?
            </p>
            <Link
              href="/apply"
              className="w-full sticker-btn text-xs py-3 px-4 rounded-xl uppercase font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>Apply as a Volunteer</span>
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-emerald-400">
          <p>© {new Date().getFullYear()} TEENVERSE PAKISTAN. All rights reserved.</p>
          <p className="italic">
            &quot;Cool nerds doing fun things.&quot; 💚
          </p>
        </div>

      </div>
    </footer>
  );
}
