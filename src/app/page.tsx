import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Domains from "@/components/Domains";
import StatsSection from "@/components/StatsSection";
import TerminalWidget from "@/components/TerminalWidget";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#082D19] text-[#F0FFF4] relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* 5 Domains Showcase */}
      <Domains />

      {/* Stats & Cool Nerds Manifesto */}
      <StatsSection />

      {/* Interactive Hacker CLI Terminal */}
      <TerminalWidget />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
