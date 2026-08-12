import React from "react";
import { Opponent } from "../types";
import { Skull, Cpu, RefreshCw, Play, AlertCircle } from "lucide-react";

interface MatchStartProps {
  topic: string;
  position: "FOR" | "AGAINST";
  opponent: Opponent | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onStartMatch: () => void;
}

export const MatchStart: React.FC<MatchStartProps> = ({
  topic,
  position,
  opponent,
  isLoading,
  error,
  onRetry,
  onStartMatch,
}) => {
  const difficultyStars = opponent
    ? Array.from({ length: 5 }, (_, i) => i < opponent.difficulty)
    : [true, true, true, false, false];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-mono flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      
      <div className="w-full hud-panel border border-[#232530] p-6 sm:p-8 space-y-6 text-center relative overflow-hidden bg-[#13141C]">
        
        {/* Top Header Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B0B0F] border border-[#232530] font-mono text-xs text-[#3B8EEA] tracking-widest uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#3B8EEA]" />
          MATCHMAKING SYSTEM // ADVERSARY ASSIGNMENT
        </div>

        {/* Selected Arena Summary */}
        <div className="border-y border-[#232530] py-4 space-y-2">
          <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest block">
            ACTIVE ARENA PARAMETERS
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#F4F4F6] font-sans max-w-xl mx-auto">
            "{topic}"
          </h2>
          <div className={`inline-block font-mono text-xs font-bold px-2.5 py-0.5 uppercase border ${
            position === "FOR" 
              ? "bg-[#2ED573]/10 text-[#2ED573] border-[#2ED573]" 
              : "bg-[#FF4B3E]/10 text-[#FF4B3E] border-[#FF4B3E]"
          }`}>
            STANCE: {position}
          </div>
        </div>

        {/* Loading State vs Assigned Opponent Card */}
        {isLoading ? (
          <div className="py-12 space-y-4 flex flex-col items-center justify-center">
            <RefreshCw className="w-10 h-10 text-[#3B8EEA] animate-spin" />
            <div className="space-y-1 font-mono">
              <p className="text-sm text-[#F4F4F6] uppercase tracking-wider font-bold">
                ANALYZING TOPIC & ASSIGNING ADVERSARY...
              </p>
              <p className="text-xs text-zinc-400 font-sans">
                Selecting specialized opponent persona from tactical vault
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="py-8 space-y-4 border border-[#FF4B3E] bg-[#FF4B3E]/10 p-4 text-center font-mono">
            <AlertCircle className="w-8 h-8 text-[#FF4B3E] mx-auto" />
            <p className="text-xs text-[#FF4B3E]">{error}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#0B0B0F] hover:bg-[#F4F4F6] hover:text-black text-[#F4F4F6] font-mono text-xs border border-[#232530] hover:border-[#F4F4F6] transition-colors cursor-pointer"
            >
              [ RETRY MATCHMAKING ]
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-6">
            
            {/* Hidden Silhouette Opponent Card */}
            <div className="hud-panel border border-[#232530] p-6 max-w-md mx-auto bg-[#0B0B0F] relative group">
              
              <div className="w-20 h-20 mx-auto bg-[#13141C] border border-[#232530] flex items-center justify-center text-zinc-500 mb-3 relative">
                <Skull className="w-10 h-10 text-[#FF4B3E]" />
                <span className="absolute -top-2 -right-2 bg-[#FF4B3E] text-black font-mono text-[9px] font-bold px-1.5 py-0.5">
                  LOCKED
                </span>
              </div>

              <div className="space-y-2 font-mono">
                <h3 className="font-mono text-lg font-extrabold text-[#F4F4F6] tracking-widest uppercase">
                  OPPONENT: [ UNKNOWN PERSONA ]
                </h3>

                {/* Difficulty Skull Rating */}
                <div className="flex items-center justify-center gap-1.5 py-1">
                  <span className="font-mono text-[11px] text-zinc-400 mr-1 font-semibold">
                    DIFFICULTY:
                  </span>
                  {difficultyStars.map((filled, idx) => (
                    <Skull
                      key={idx}
                      className={`w-4 h-4 ${
                        filled ? "text-[#FF4B3E] fill-[#FF4B3E]" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                <p className="font-sans text-xs text-zinc-400 pt-2 border-t border-[#232530]">
                  Adversary style and identity encrypted. Their specialized rhetorical attacks will reveal themselves during play.
                </p>
              </div>

            </div>

            {/* Launch CTA */}
            <div className="pt-2 font-mono">
              <button
                onClick={onStartMatch}
                className="w-full sm:w-80 mx-auto py-4 bg-[#3B8EEA] hover:bg-[#F4F4F6] text-black font-mono font-bold text-base uppercase tracking-wider transition-colors flex items-center justify-center gap-3 border border-[#3B8EEA] hover:border-[#F4F4F6] cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>BEGIN ROUND 1</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

