import React from "react";
import { Target, Cpu, Flame, ChevronRight } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-[calc(100vh-60px)] hud-grid flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-mono">
      
      {/* Decorative corner HUD reticles */}
      <div className="absolute top-8 left-8 border-t border-l border-[#232530] w-6 h-6 pointer-events-none hidden sm:block" />
      <div className="absolute top-8 right-8 border-t border-r border-[#232530] w-6 h-6 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-8 left-8 border-b border-l border-[#232530] w-6 h-6 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-8 right-8 border-b border-r border-[#232530] w-6 h-6 pointer-events-none hidden sm:block" />

      {/* Atmospheric radial glow behind the main content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#3B8EEA]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-10 relative z-10">
        
        {/* Softened entry point: inline, borderless status line */}
        <div className="inline-flex items-center gap-2 text-zinc-400 font-mono text-xs tracking-widest uppercase py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2ED573] animate-pulse" />
          SYSTEM OPERATIONAL // ADAPTIVE TACTICAL SIMULATOR
        </div>

        {/* Main Title Block */}
        <div className="space-y-4 py-4">
          <h1 className="font-mono text-5xl sm:text-7xl font-black tracking-tighter text-[#F4F4F6] uppercase">
            DEBATE <span className="text-[#3B8EEA]">ROGUELIKE</span>
          </h1>
          <p className="font-sans text-sm sm:text-lg text-zinc-300 max-w-xl mx-auto tracking-wide leading-relaxed pt-2">
            Every argument has a weakness. Find yours before they do.
          </p>
        </div>

        {/* Core Game Loop Mechanics Cards - NO border, asymmetrical staggered vertical rhythm */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full text-left font-mono my-4">
          
          <div className="flex flex-col gap-3 p-5 bg-[#13141C]/30 hover:bg-[#13141C]/50 transition-all duration-300 rounded-none sm:translate-y-0">
            <div className="flex items-center gap-2 text-[#FF4B3E] text-xs font-black uppercase tracking-widest">
              <Cpu className="w-4 h-4 text-[#FF4B3E]" />
              01. HIDDEN OPPONENT
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Face a stealth AI persona (Lawyer, Economist, Philosopher, etc.) targeting your argument with specialized rhetoric.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 bg-[#13141C]/30 hover:bg-[#13141C]/50 transition-all duration-300 rounded-none sm:translate-y-4">
            <div className="flex items-center gap-2 text-[#3B8EEA] text-xs font-black uppercase tracking-widest">
              <Target className="w-4 h-4 text-[#3B8EEA]" />
              02. WEAKNESS DETECTION
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Gemini analyzes your text for assumption leaks, logic gaps, or bad evidence every turn in structured JSON.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 bg-[#13141C]/30 hover:bg-[#13141C]/50 transition-all duration-300 rounded-none sm:translate-y-8">
            <div className="flex items-center gap-2 text-[#FFC93C] text-xs font-black uppercase tracking-widest">
              <Flame className="w-4 h-4 text-[#FFC93C]" />
              03. DYNAMIC MODIFIERS
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Game rules adapt in real-time — Evidence Lock, 3-Sentence Limits, and Counterexample locks test your composure.
            </p>
          </div>

        </div>

        {/* Single Main CTA - Reduced stacked-box feeling, clear focal point */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto mt-8">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 bg-[#3B8EEA] hover:bg-[#F4F4F6] hover:text-black text-black font-mono font-bold text-base uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-3 border border-[#3B8EEA] hover:border-[#F4F4F6] cursor-pointer shadow-[0_0_30px_rgba(59,142,234,0.15)]"
          >
            <span>INITIATE DEBATE [ENTER RUN]</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <span className="font-mono text-[11px] text-zinc-400 tracking-widest uppercase">
            ESTIMATED RUN TIME: 3 - 5 MINUTES // 4 ROUND MAX
          </span>
        </div>

      </div>
    </div>
  );
};

