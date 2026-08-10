"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight, Code2 } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner Ribbon */}
      <div className="bg-[#CCFF00] text-[#042113] py-2 px-3 text-xs md:text-sm font-extrabold text-center border-b-2 border-[#042113] flex items-center justify-center gap-1.5 sm:gap-2 tracking-wide z-50 relative">
        <span className="bg-[#042113] text-[#CCFF00] text-[9px] sm:text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold shrink-0">
          OPEN NOW
        </span>
        <span className="truncate max-w-[220px] sm:max-w-none">🇵🇰 Volunteer Applications Season '26</span>
        <Link
          href="/apply"
          className="underline hover:opacity-80 flex items-center gap-0.5 ml-1 font-black cursor-pointer shrink-0"
        >
          Apply <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#062916]/95 backdrop-blur-md border-b-2 border-[#166B42] py-2.5 shadow-xl"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand Sticker */}
          <Link
            href="/"
            className="flex items-center gap-2 group relative transition-transform duration-200 hover:scale-105"
          >
            <div className="relative w-32 h-9 sm:w-40 sm:h-11 flex items-center">
              <Image
                src="/logo.png"
                alt="TEENVERSE Logo"
                fill
                className="object-contain drop-shadow-[2px_3px_0px_#042113]"
                priority
              />
            </div>
            <span className="hidden sm:inline-block bg-[#155A38] text-[#CCFF00] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#CCFF00]/40 -rotate-3">
              PAKISTAN
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 font-extrabold text-sm tracking-wide text-emerald-100">
            <a
              href="#domains"
              className="hover:text-[#CCFF00] transition-colors flex items-center gap-1"
            >
              <Code2 className="w-4 h-4 text-[#CCFF00]" /> Domains
            </a>
            <a
              href="#manifesto"
              className="hover:text-[#CCFF00] transition-colors"
            >
              Who We Are
            </a>
            <a
              href="#terminal"
              className="hover:text-[#CCFF00] transition-colors flex items-center gap-1 font-mono text-xs bg-[#042113] px-2 py-1 rounded border border-[#166B42]"
            >
              <span className="text-[#CCFF00] font-bold">&gt;_</span> CLI
            </a>
            <a
              href="#events"
              className="hover:text-[#CCFF00] transition-colors"
            >
              Events
            </a>
            <a href="#faq" className="hover:text-[#CCFF00] transition-colors">
              FAQ
            </a>
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/apply"
              className="sticker-btn text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-black"
            >
              <span>Join Squad</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#0D482B] text-[#CCFF00] border border-[#166B42]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#062916] border-b-4 border-[#CCFF00] px-6 py-6 space-y-4 text-center font-heading text-xl shadow-2xl">
            <a
              href="#domains"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-[#CCFF00] py-1"
            >
              OUR 5 PILLARS
            </a>
            <a
              href="#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-[#CCFF00] py-1"
            >
              WHO WE ARE
            </a>
            <a
              href="#terminal"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-[#CCFF00] py-1"
            >
              CLI TERMINAL
            </a>
            <a
              href="#events"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-[#CCFF00] py-1"
            >
              EVENTS &amp; HACKATHONS
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-[#CCFF00] py-1"
            >
              FAQ
            </a>
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full sticker-btn py-3.5 rounded-xl uppercase tracking-wider text-xs font-black flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Apply to Volunteer
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
