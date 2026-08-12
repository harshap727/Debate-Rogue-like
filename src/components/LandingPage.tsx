import React from "react";
import { Target, Cpu, Flame, ChevronRight } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" style={{ backgroundColor: "#E8D5B7" }}>
      
      {/* Main Container Box */}
      <div className="max-w-4xl w-full mx-auto p-8 sm:p-12 bg-[#F0E4CC] border border-[#B89968] rounded-md shadow-none flex flex-col items-center text-center gap-8 relative z-10" style={{ color: "#3A2A1E" }}>
        
        {/* Status Line */}
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase py-1 font-serif" style={{ color: "#6B7A4F" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A4F] animate-pulse" />
          SYSTEM OPERATIONAL // CLASSIC COACH EDITION
        </div>

        {/* Main Title Block */}
        <div className="space-y-3 py-2 border-b border-[#B89968] w-full pb-6">
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight uppercase" style={{ color: "#3A2A1E" }}>
            DEBATE <span style={{ color: "#6B7A4F" }}>ROGUELIKE</span>
          </h1>
          <p className="font-serif text-base sm:text-xl max-w-xl mx-auto leading-relaxed pt-2" style={{ color: "#3A2A1E" }}>
            Every argument has a weakness. Find yours before they do.
          </p>
        </div>

        {/* Core Game Loop Mechanics Cards - Alternating checkerboard rhythm */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left my-2">
          
          <div className="flex flex-col gap-3 p-5 rounded-[4px] border border-[#B89968]" style={{ backgroundColor: "#8A7060", color: "#F0E4CC" }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-serif" style={{ color: "#F0E4CC" }}>
              <Cpu className="w-4 h-4" style={{ color: "#F0E4CC" }} />
              01. HIDDEN OPPONENT
            </div>
            <p className="text-xs font-serif leading-relaxed" style={{ color: "#F0E4CC" }}>
              Face a stealth AI persona (Lawyer, Economist, Philosopher, etc.) targeting your argument with specialized rhetoric.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 rounded-[4px] border border-[#B89968]" style={{ backgroundColor: "#D9C5A0", color: "#3A2A1E" }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-serif" style={{ color: "#3A2A1E" }}>
              <Target className="w-4 h-4" style={{ color: "#6B7A4F" }} />
              02. WEAKNESS DETECTION
            </div>
            <p className="text-xs font-serif leading-relaxed" style={{ color: "#3A2A1E" }}>
              Gemini analyzes your text for assumption leaks, logic gaps, or bad evidence every turn in structured JSON.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 rounded-[4px] border border-[#B89968]" style={{ backgroundColor: "#8A7060", color: "#F0E4CC" }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-serif" style={{ color: "#F0E4CC" }}>
              <Flame className="w-4 h-4" style={{ color: "#F0E4CC" }} />
              03. DYNAMIC MODIFIERS
            </div>
            <p className="text-xs font-serif leading-relaxed" style={{ color: "#F0E4CC" }}>
              Game rules adapt in real-time — Evidence Lock, 3-Sentence Limits, and Counterexample locks test your composure.
            </p>
          </div>

        </div>

        {/* Single Main CTA */}
        <div className="flex flex-col items-center gap-3 w-full sm:w-auto mt-4 border-t border-[#B89968] pt-6">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#6B7A4F] hover:bg-[#3A2A1E] text-[#F0E4CC] font-serif font-bold text-sm uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-3 border border-[#B89968] cursor-pointer rounded-[4px]"
          >
            <span>INITIATE DEBATE [ENTER RUN]</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          
          <span className="font-serif text-[11px] uppercase tracking-widest pt-1" style={{ color: "#3A2A1E", opacity: 0.8 }}>
            ESTIMATED RUN TIME: 3 - 5 MINUTES // 4 ROUND MAX
          </span>
        </div>

      </div>
    </div>
  );
};


