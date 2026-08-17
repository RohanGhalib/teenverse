"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

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
              <a
                href="https://instagram.com/teenversepk"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white font-bold px-3 py-1 rounded border border-[#042113] hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@teenversepk</span>
              </a>
              <a
                href="https://discord.gg/V4bfGJJj7e"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5865F2] text-white font-bold px-3 py-1 rounded border border-[#042113] hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Discord</span>
              </a>
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
                <a href="#faq" className="hover:text-[#CCFF00] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Action & Community */}
          <div className="space-y-3">
            <h4 className="text-[#CCFF00] font-mono text-xs uppercase tracking-wider">
              JOIN THE MOVEMENT
            </h4>
            <p className="text-xs text-emerald-300">
              Ready to build civic solutions and hang out with the coolest teens in Pakistan?
            </p>

            <a
              href="https://instagram.com/teenversepk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#E1306C] to-[#F77737] hover:opacity-90 text-white text-xs py-2.5 px-4 rounded-xl uppercase font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer text-center border-2 border-[#042113]"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram @teenversepk</span>
            </a>

            <a
              href="https://discord.gg/V4bfGJJj7e"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs py-2.5 px-4 rounded-xl uppercase font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer text-center border-2 border-[#042113]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Join Discord Server</span>
            </a>

            <Link
              href="/apply"
              className="w-full sticker-btn text-xs py-2.5 px-4 rounded-xl uppercase font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer text-center"
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
