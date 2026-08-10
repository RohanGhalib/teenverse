"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft, Copy, Check } from "lucide-react";

interface TerminalWidgetProps {
  onOpenApply?: () => void;
}


interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export default function TerminalWidget({ onOpenApply }: TerminalWidgetProps) {
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "teenverse info",
      output: (
        <div className="space-y-1 text-emerald-300">
          <p className="text-[#CCFF00] font-bold">🚀 TEENVERSE CLI v1.0.4 [Pakistan Build System]</p>
          <p>--------------------------------------------------</p>
          <p>Status: <span className="text-[#CCFF00]">ACTIVE &amp; HIRING VOLUNTEERS</span></p>
          <p>Location: Bahawalpur • Multan • Online 🇵🇰</p>

          <p>Motto: &quot;Cool nerds who do fun things &amp; build real civic tech.&quot;</p>
          <p>--------------------------------------------------</p>
          <p className="text-xs text-emerald-400">Type <span className="text-[#CCFF00] font-bold font-mono">help</span> to see available commands or click quick action buttons below.</p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode = null;

    switch (trimmed) {
      case "help":
        output = (
          <div className="space-y-1 text-xs text-emerald-300 font-mono">
            <p className="text-[#CCFF00] font-bold">Available Commands:</p>
            <p><span className="text-[#CCFF00] font-bold">domains</span>  - List all 5 Teenverse pillars</p>
            <p><span className="text-[#CCFF00] font-bold font-mono">apply</span>    - Open volunteer application form modal</p>
            <p><span className="text-[#CCFF00] font-bold font-mono">motto</span>    - Display official Teenverse manifesto motto</p>
            <p><span className="text-[#CCFF00] font-bold font-mono">whoami</span>   - Identity scan</p>
            <p><span className="text-[#CCFF00] font-bold font-mono">secret</span>   - Uncover hidden easter egg</p>
            <p><span className="text-[#CCFF00] font-bold font-mono">clear</span>    - Clear terminal history</p>
          </div>
        );
        break;

      case "domains":
        output = (
          <div className="space-y-1.5 text-xs text-emerald-200 font-mono">
            <p className="text-[#CCFF00] font-bold">🏛️ 5 TEENVERSE DOMAINS:</p>
            <p>1. <span className="text-[#CCFF00]">Civic Volunteership:</span> BUILD solutions for city problems.</p>
            <p>2. <span className="text-[#CCFF00]">Social Welfare:</span> Local relief drives &amp; community aid.</p>
            <p>3. <span className="text-[#CCFF00]">Character Building:</span> Code, UI/UX, Leadership &amp; Personal Development.</p>

            <p>4. <span className="text-[#CCFF00]">Public Training:</span> Free camps &amp; workshops for high schoolers.</p>
            <p>5. <span className="text-[#CCFF00]">Events &amp; Hackathons:</span> 24h hackathons, MUNs &amp; build nights.</p>
          </div>
        );
        break;

      case "apply":
      case "join":
        window.location.href = "/apply";
        output = (
          <p className="text-[#CCFF00] font-bold text-xs">
            🚀 Redirecting to Official Volunteer Application &amp; Pledge page (/apply)...
          </p>
        );
        break;


      case "motto":
      case "manifesto":
        output = (
          <div className="p-2 bg-[#042113] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono font-bold rounded">
            &quot;WE ARE A COMMUNITY OF EXCITED, ENERGETIC, PLAYFUL, AND TALENTED TEENS. WE WORK IN DIFFERENT DOMAINS, BUILD CIVIC SOLUTIONS, AND HAVE FUN!&quot;
          </div>
        );
        break;

      case "whoami":
        output = (
          <p className="text-emerald-300 text-xs font-mono">
            Scanning biometric data... <span className="text-[#CCFF00] font-bold">Match Found!</span> You are a passionate Pakistani teenager capable of building amazing things. Welcome home! 🇵🇰
          </p>
        );
        break;

      case "secret":
        output = (
          <div className="p-3 bg-[#FF3366] text-white text-xs font-mono font-black rounded space-y-1">
            <p>🎁 SECRET TEENVERSE LORE UNLOCKED!</p>
            <p>&quot;No boring boomers allowed. Teenverse is 100% powered by teen brainpower &amp; endless chai.&quot;</p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      default:
        output = (
          <p className="text-red-400 text-xs font-mono">
            Command not recognized: &quot;{trimmed}&quot;. Type <span className="text-[#CCFF00] font-bold">help</span> to view all commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmdStr, output }]);
    setInputVal("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://www.teenverse.org");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" className="py-14 md:py-20 bg-[#082D19] relative border-b-4 border-[#042113] craft-grid-dense overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#042113] border border-[#166B42] text-[#CCFF00] text-xs font-mono font-bold px-3 py-1 rounded-full">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>INTERACTIVE CLI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide">
            TEENVERSE <span className="text-[#CCFF00]">COMMAND CENTER</span>
          </h2>
          <p className="text-emerald-200 text-xs sm:text-sm max-w-xl mx-auto">
            Test drive our CLI terminal. Type commands or click the shortcut buttons below!
          </p>
        </div>

        {/* Terminal Window Box */}
        <div className="bg-[#03170D] border-3 sm:border-4 border-[#166B42] rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000] font-mono">
          
          {/* Terminal Window Header Bar */}
          <div className="bg-[#062916] px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-[#166B42] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="text-[11px] sm:text-xs text-emerald-300 font-bold ml-1 truncate max-w-[150px] sm:max-w-none">
                teenverse-cli@pakistan:~
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className="text-[10px] sm:text-xs text-emerald-300 hover:text-[#CCFF00] flex items-center gap-1 bg-[#042113] px-2 py-1 rounded border border-[#166B42] cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#CCFF00]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied!" : "Share CLI"}</span>
            </button>
          </div>

          {/* Terminal Body */}
          <div className="p-3 sm:p-6 min-h-[220px] max-h-[360px] overflow-y-auto space-y-3 text-xs sm:text-sm text-emerald-100">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="text-[#CCFF00]">&gt;</span>
                  <span>{item.command}</span>
                </div>
                <div className="pl-3 sm:pl-4">{item.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Interactive Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(inputVal);
            }}
            className="bg-[#042113] p-2.5 sm:p-3 border-t-2 border-[#166B42] flex items-center gap-2"
          >
            <span className="text-[#CCFF00] font-bold text-sm select-none">&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type 'help', 'domains', 'apply', 'motto'..."
              className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none placeholder-emerald-600 min-w-0"
            />
            <button
              type="submit"
              className="bg-[#CCFF00] text-[#042113] font-black text-xs px-3 py-1.5 rounded hover:bg-[#D4FF00] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>RUN</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Quick Command Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-mono">
          <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">Quick Shortcuts:</span>
          {[
            { cmd: "help", label: "help" },
            { cmd: "domains", label: "domains" },
            { cmd: "apply", label: "apply" },
            { cmd: "motto", label: "motto" },
            { cmd: "whoami", label: "whoami" },
            { cmd: "secret", label: "secret 🎁" },
          ].map((btn) => (
            <button
              key={btn.cmd}
              onClick={() => handleCommand(btn.cmd)}
              className="bg-[#0D482B] hover:bg-[#CCFF00] hover:text-[#042113] text-[#CCFF00] px-2.5 py-1 rounded text-[11px] sm:text-xs border border-[#166B42] transition-colors cursor-pointer"
            >
              ${btn.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
