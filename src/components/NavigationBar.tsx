import React, { useState } from "react";
import { GameState, CHALLENGE_MAP } from "../types";
import { Home, Target, Sword, BookOpen, ShieldAlert, X, Flame, Shield, Activity } from "lucide-react";

interface NavigationBarProps {
  currentScreen: "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval";
  gameState: GameState;
  onNavigate: (screen: "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval") => void;
  onReset: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  gameState,
  onNavigate,
  onReset,
}) => {
  const { topic, position, round, maxRounds, argumentHealth, activeChallenge } = gameState;
  const [showManual, setShowManual] = useState(false);
  const [showConfirmAbort, setShowConfirmAbort] = useState<string | null>(null);

  // Helper for abort dialog
  const handleNavClick = (target: "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval") => {
    if (currentScreen === "live_debate" && (target === "landing" || target === "topic_select")) {
      setShowConfirmAbort(target);
    } else {
      if (target === "match_start" || target === "live_debate" || target === "final_eval") {
        if (!topic) {
          // Can't go to active battle if no topic selected
          onNavigate("topic_select");
          return;
        }
      }
      onNavigate(target);
    }
  };

  const confirmAbortAction = () => {
    if (showConfirmAbort) {
      onReset();
      onNavigate(showConfirmAbort as any);
      setShowConfirmAbort(null);
    }
  };

  const activeChallengeInfo = activeChallenge ? CHALLENGE_MAP[activeChallenge] : null;

  // Health color states
  let healthColor = "text-[#2ED573]";
  let healthBarColor = "bg-[#2ED573]";
  let healthStatusText = "STABLE";

  if (argumentHealth <= 30) {
    healthColor = "text-[#FF4B3E]";
    healthBarColor = "bg-[#FF4B3E]";
    healthStatusText = "CRITICAL";
  } else if (argumentHealth <= 60) {
    healthColor = "text-[#FFC93C]";
    healthBarColor = "bg-[#FFC93C]";
    healthStatusText = "WARNING";
  }

  return (
    <>
      <header className="w-full bg-[#13141C] border-b border-[#232530] text-[#F4F4F6] px-4 py-3 sticky top-0 z-40 font-mono select-none">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Logo & Section Identity */}
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div 
              onClick={() => handleNavClick("landing")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-[#3B8EEA] border border-[#3B8EEA] group-hover:bg-[#F4F4F6] group-hover:border-[#F4F4F6] transition-colors flex items-center justify-center font-bold text-black text-xs">
                DR
              </div>
              <div>
                <h1 className="text-sm tracking-widest text-[#F4F4F6] uppercase font-extrabold flex items-center gap-1.5">
                  DEBATE ROGUELIKE
                  <span className="text-[10px] px-1 py-0.2 bg-[#0B0B0F] text-zinc-400 font-normal border border-[#232530]">
                    SYS v1.0
                  </span>
                </h1>
                <p className="text-[10px] text-zinc-400 tracking-wider">
                  SYS_STATUS // {currentScreen.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Mobile Tactics Manual Quick Toggle */}
            <button
              onClick={() => setShowManual(!showManual)}
              className={`lg:hidden px-2 py-1 border text-[11px] font-bold uppercase transition-all flex items-center gap-1 ${
                showManual 
                  ? "bg-[#3B8EEA] text-black border-[#3B8EEA]" 
                  : "bg-[#0B0B0F] text-[#F4F4F6] border-[#232530] hover:border-zinc-500"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>MANUAL</span>
            </button>
          </div>

          {/* Core HUD Navigation Links */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none border-t border-b border-[#232530] py-1.5 lg:border-none lg:py-0">
            <button
              onClick={() => handleNavClick("landing")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                currentScreen === "landing"
                  ? "text-[#3B8EEA] border border-[#3B8EEA] bg-[#3B8EEA]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6]"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>01. HOME</span>
            </button>

            <button
              onClick={() => handleNavClick("topic_select")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                currentScreen === "topic_select"
                  ? "text-[#3B8EEA] border border-[#3B8EEA] bg-[#3B8EEA]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6]"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>02. ARENA SELECT</span>
            </button>

            <button
              onClick={() => handleNavClick(topic ? "live_debate" : "topic_select")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                (currentScreen === "live_debate" || currentScreen === "match_start" || currentScreen === "final_eval")
                  ? "text-[#3B8EEA] border border-[#3B8EEA] bg-[#3B8EEA]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6] disabled:opacity-40"
              }`}
            >
              <Sword className="w-3.5 h-3.5" />
              <span>03. BATTLE STAGE {topic ? "" : "[LOCKED]"}</span>
            </button>

            <button
              onClick={() => setShowManual(!showManual)}
              className={`hidden lg:flex px-3 py-1.5 text-xs font-bold uppercase transition-all items-center gap-1.5 cursor-pointer shrink-0 ${
                showManual
                  ? "text-[#FFC93C] border border-[#FFC93C] bg-[#FFC93C]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>04. TACTICS MANUAL</span>
            </button>
          </nav>

          {/* Active Live Debate HUD Integration */}
          {(currentScreen === "live_debate" || currentScreen === "final_eval" || currentScreen === "match_start") && topic ? (
            <div className="flex items-center gap-3 justify-between lg:justify-end shrink-0 border-t lg:border-t-0 border-[#232530] pt-2 lg:pt-0">
              
              {/* Active Modifier badge */}
              {activeChallengeInfo && currentScreen === "live_debate" && (
                <div className="flex items-center gap-1 px-2 py-0.5 border border-[#FFC93C] text-[#FFC93C] bg-[#FFC93C]/10 text-[10px] uppercase font-bold tracking-wider">
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                  <span className="hidden sm:inline">{activeChallengeInfo.badge}</span>
                  <span className="sm:hidden">MODIFIER</span>
                </div>
              )}

              {/* Round indicator */}
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#0B0B0F] border border-[#232530] text-[10px] text-zinc-400">
                <Activity className="w-3 h-3 shrink-0" />
                <span>R: {round}/{maxRounds}</span>
              </div>

              {/* Minified Health Status */}
              <div className="flex items-center gap-2 bg-[#0B0B0F] border border-[#232530] px-2.5 py-1 min-w-[120px] sm:min-w-[150px]">
                <Flame className="w-3 h-3 text-zinc-500" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span className={healthColor}>{healthStatusText}</span>
                    <span className="text-[#F4F4F6]">{argumentHealth}/100</span>
                  </div>
                  <div className="w-full h-1 bg-[#13141C] border border-[#232530] mt-0.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${healthBarColor}`}
                      style={{ width: `${argumentHealth}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-500 bg-[#0B0B0F] border border-[#232530] px-3 py-1 uppercase shrink-0">
              <span className="w-1.5 h-1.5 bg-[#2ED573] animate-pulse rounded-full" />
              SYSTEM STANDBY // NO RUN ACTIVE
            </div>
          )}

        </div>
      </header>

      {/* Confirmation Overlays / Alerts */}
      {showConfirmAbort && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="max-w-md w-full bg-[#13141C] border-2 border-[#FF4B3E] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#FF4B3E] font-bold uppercase tracking-wider border-b border-[#232530] pb-2 text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>ALERT // ABORT ACTIVE DEBATE RUN?</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Navigating away from the Battle Stage will self-destruct your current argument, ending the active debate simulation. All round health and modifications will be lost.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={confirmAbortAction}
                className="flex-1 py-2.5 bg-[#FF4B3E] hover:bg-[#F4F4F6] text-black font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer"
              >
                [ CONFIRM: SELF-DESTRUCT ]
              </button>
              <button
                onClick={() => setShowConfirmAbort(null)}
                className="flex-1 py-2.5 bg-[#0B0B0F] hover:bg-zinc-800 text-zinc-300 font-bold uppercase text-xs tracking-wider border border-[#232530] transition-colors cursor-pointer"
              >
                [ CANCEL ABORT ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-down / Drop-down Tactics Manual Panel */}
      {showManual && (
        <div className="w-full bg-[#0B0B0F] border-b border-[#232530] text-[#F4F4F6] font-mono z-30 transition-all duration-300 select-none">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            <button
              onClick={() => setShowManual(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#F4F4F6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Manual Column 1: Core System Modifiers */}
            <div className="space-y-3">
              <div className="text-[#FFC93C] font-extrabold uppercase text-xs tracking-widest border-b border-[#232530] pb-1">
                SYSTEM MODIFIERS [CHALLENGES]
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="p-2.5 bg-[#13141C] border border-[#232530] space-y-1">
                  <div className="font-mono text-[10px] text-[#FFC93C] font-bold">NO ASSUMPTIONS [ASSUMPTION ATTACK]</div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Opponent attacks your underlying logical framework. You must state explicit, self-evident premises. Avoid unsupported logical leaps.
                  </p>
                </div>
                <div className="p-2.5 bg-[#13141C] border border-[#232530] space-y-1">
                  <div className="font-mono text-[10px] text-[#FFC93C] font-bold">EVIDENCE LOCK [EVIDENCE ATTACK]</div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Opponent targets your empirical assertions. You are required to support your argument with concrete empirical facts, studies, or operational examples.
                  </p>
                </div>
                <div className="p-2.5 bg-[#13141C] border border-[#232530] space-y-1">
                  <div className="font-mono text-[10px] text-[#FFC93C] font-bold">THREE-SENTENCE CAP [LOGIC ATTACK]</div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Opponent attempts to dilute your focus. Your response is restricted to exactly three sentences maximum to enforce ultimate syntactic precision.
                  </p>
                </div>
              </div>
            </div>

            {/* Manual Column 2: Threat Profiles */}
            <div className="space-y-3">
              <div className="text-[#FF4B3E] font-extrabold uppercase text-xs tracking-widest border-b border-[#232530] pb-1">
                ADVERSARY THREAT PROFILES
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="p-2.5 bg-[#13141C] border border-[#232530] space-y-1">
                  <div className="font-mono text-[10px] text-[#FF4B3E] font-bold">DEVIL'S ADVOCATE // CRITICAL DISSECTOR</div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Systematically isolates edge cases and logical vulnerabilities. Responds with relentless structural cross-examination.
                  </p>
                </div>
                <div className="p-2.5 bg-[#13141C] border border-[#232530] space-y-1">
                  <div className="font-mono text-[10px] text-[#FF4B3E] font-bold">SOPHIST // RHETORICAL FALLACIST</div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Weaponizes strawman constructs, false equivalences, and subtle deflections. Deploys high-velocity argumentative framing.
                  </p>
                </div>
                <div className="p-2.5 bg-[#13141C] border border-[#232530] space-y-1">
                  <div className="font-mono text-[10px] text-[#FF4B3E] font-bold">PEDANTIC ACADEMIC // NITPICK SPECIATOR</div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Targets micro-definitions and exact terminology thresholds. Punishes broad generalizations with immediate semantic strikes.
                  </p>
                </div>
              </div>
            </div>

            {/* Manual Column 3: Tactical Strategy */}
            <div className="space-y-3">
              <div className="text-[#3B8EEA] font-extrabold uppercase text-xs tracking-widest border-b border-[#232530] pb-1">
                TACTICAL FIELD DOCTRINE
              </div>
              <div className="space-y-2.5 text-xs font-sans text-zinc-300 leading-relaxed">
                <p>
                  1. <strong className="text-[#3B8EEA] font-mono">NEVER BYPASS MODIFIERS:</strong> The evaluation engine heavily penalizes any failure to abide by active challenge rules. Follow badge directions to avoid massive health damage.
                </p>
                <p>
                  2. <strong className="text-[#3B8EEA] font-mono">DENSITY OVER VOLUME:</strong> Write concise, high-impact claims. Packing multiple distinct arguments inside a long response increases your risk profile.
                </p>
                <p>
                  3. <strong className="text-[#3B8EEA] font-mono">EMPIRICAL SHIELD:</strong> Under **Evidence Lock**, ensure you cite hypothetical statistics, mock policy models, or historical precedents.
                </p>
                <div className="p-3 bg-[#3B8EEA]/5 border border-[#3B8EEA] font-mono text-[10px] text-[#3B8EEA] uppercase leading-snug">
                  WARNING: EACH COUNTER-ATTACK CHIP DETECTS AN ASPECT OF RHETORICAL SLOP. CORRECT LOGICAL DEVIATION IMMEDIATELY.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
