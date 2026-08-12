import React, { useState } from "react";
import { GameState, CHALLENGE_MAP } from "../types";
import { Home, Target, Sword, BookOpen, ShieldAlert, X, Flame, Shield, Activity, LogIn, LogOut, History, User as UserIcon } from "lucide-react";

interface NavigationBarProps {
  currentScreen: "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval";
  gameState: GameState;
  onNavigate: (screen: "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval") => void;
  onReset: () => void;
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenHistory: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  gameState,
  onNavigate,
  onReset,
  user,
  onSignIn,
  onSignOut,
  onOpenHistory,
}) => {
  const { topic, position, round, maxRounds, argumentHealth, activeChallenge } = gameState;
  const [showManual, setShowManual] = useState(false);
  const [showConfirmAbort, setShowConfirmAbort] = useState<string | null>(null);

  const handleNavClick = (target: "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval") => {
    if (currentScreen === "live_debate" && (target === "landing" || target === "topic_select")) {
      setShowConfirmAbort(target);
    } else {
      if (target === "match_start" || target === "live_debate" || target === "final_eval") {
        if (!topic) {
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
      {/* Responsive Navigation Pane: Side on PC (md:), Top on mobile and tablet */}
      <header className="w-full md:w-64 bg-[#13141C] md:min-h-screen md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-[#232530] text-[#F4F4F6] p-4 font-mono select-none flex flex-col justify-between z-45 shrink-0">
        
        {/* Top / Main section */}
        <div className="space-y-6">
          {/* Logo & Section Identity */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div 
              onClick={() => handleNavClick("landing")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-[#3B8EEA] border border-[#3B8EEA] group-hover:bg-[#F4F4F6] group-hover:border-[#F4F4F6] transition-colors flex items-center justify-center font-bold text-black text-xs shrink-0">
                DR
              </div>
              <div>
                <h1 className="text-sm tracking-widest text-[#F4F4F6] uppercase font-extrabold flex items-center gap-1.5">
                  DEBATE ROGUELIKE
                </h1>
                <p className="text-[10px] text-zinc-400 tracking-wider">
                  SYS_STATUS // {currentScreen.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Mobile Manual Toggle */}
            <button
              onClick={() => setShowManual(!showManual)}
              className={`md:hidden px-2 py-1 border text-[11px] font-bold uppercase transition-all flex items-center gap-1 ${
                showManual 
                  ? "bg-[#3B8EEA] text-black border-[#3B8EEA]" 
                  : "bg-[#0B0B0F] text-[#F4F4F6] border-[#232530]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>MANUAL</span>
            </button>
          </div>

          {/* Core HUD Navigation Links */}
          <nav className="flex md:flex-col items-stretch gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleNavClick("landing")}
              className={`px-3 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                currentScreen === "landing"
                  ? "text-[#3B8EEA] border border-[#3B8EEA] bg-[#3B8EEA]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6] border border-transparent"
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>01. HOME</span>
            </button>

            <button
              onClick={() => handleNavClick("topic_select")}
              className={`px-3 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                currentScreen === "topic_select"
                  ? "text-[#3B8EEA] border border-[#3B8EEA] bg-[#3B8EEA]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6] border border-transparent"
              }`}
            >
              <Target className="w-4 h-4 shrink-0" />
              <span>02. ARENA SELECT</span>
            </button>

            <button
              onClick={() => handleNavClick(topic ? "live_debate" : "topic_select")}
              className={`px-3 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                (currentScreen === "live_debate" || currentScreen === "match_start" || currentScreen === "final_eval")
                  ? "text-[#3B8EEA] border border-[#3B8EEA] bg-[#3B8EEA]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6] border border-transparent"
              }`}
            >
              <Sword className="w-4 h-4 shrink-0" />
              <span>03. BATTLE STAGE {topic ? "" : "[LOCKED]"}</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="px-3 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 text-zinc-400 hover:text-[#F4F4F6] border border-transparent"
            >
              <History className="w-4 h-4 shrink-0 text-[#3B8EEA]" />
              <span>04. HISTORY ARCHIVE</span>
            </button>

            <button
              onClick={() => setShowManual(!showManual)}
              className={`hidden md:flex px-3 py-2 text-xs font-bold uppercase transition-all items-center gap-2 cursor-pointer shrink-0 ${
                showManual
                  ? "text-[#FFC93C] border border-[#FFC93C] bg-[#FFC93C]/5"
                  : "text-zinc-400 hover:text-[#F4F4F6] border border-transparent"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-[#FFC93C]" />
              <span>05. TACTICS MANUAL</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Profile & Live HUD stats */}
        <div className="space-y-4 pt-4 border-t border-[#232530]">
          
          {/* Active Debate Status Mini Widget if active */}
          {(currentScreen === "live_debate" || currentScreen === "final_eval" || currentScreen === "match_start") && topic && (
            <div className="bg-[#0B0B0F] border border-[#232530] p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#3B8EEA] font-bold">R: {round}/{maxRounds}</span>
                <span className={healthColor}>{healthStatusText} ({argumentHealth}HP)</span>
              </div>
              <div className="w-full h-1.5 bg-[#13141C] border border-[#232530] overflow-hidden">
                <div className={`h-full ${healthBarColor} transition-all duration-300`} style={{ width: `${argumentHealth}%` }} />
              </div>
              {activeChallengeInfo && currentScreen === "live_debate" && (
                <div className="text-[9px] text-[#FFC93C] border border-[#FFC93C]/40 bg-[#FFC93C]/5 p-1 font-bold text-center uppercase">
                  {activeChallengeInfo.badge}
                </div>
              )}
            </div>
          )}

          {/* Google Sign-In / User Profile Widget */}
          <div className="bg-[#0B0B0F] border border-[#232530] p-3 flex flex-col gap-2.5">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-[#3B8EEA] shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#3B8EEA] text-black font-bold flex items-center justify-center text-xs shrink-0">
                      {user.displayName?.[0] || "U"}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#F4F4F6] truncate">{user.displayName || "Agent"}</p>
                    <p className="text-[9px] text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 text-zinc-400 hover:text-[#FF4B3E] hover:bg-[#13141C] border border-[#232530] transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="w-full py-2 px-3 bg-[#3B8EEA] hover:bg-[#F4F4F6] text-black font-bold text-xs uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            )}
          </div>

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
                className="flex-1 py-2.5 px-2 bg-[#FF4B3E] hover:bg-[#F4F4F6] text-black font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                [ CONFIRM: SELF-DESTRUCT ]
              </button>
              <button
                onClick={() => setShowConfirmAbort(null)}
                className="flex-1 py-2.5 px-2 bg-[#0B0B0F] hover:bg-zinc-800 text-zinc-300 font-bold uppercase text-[10px] sm:text-xs tracking-wider border border-[#232530] transition-colors cursor-pointer whitespace-nowrap"
              >
                [ CANCEL ABORT ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tactics Manual Modal Dialog */}
      {showManual && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="max-w-4xl w-full bg-[#13141C] border border-[#232530] p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#232530] pb-3">
              <div className="flex items-center gap-2 text-[#FFC93C] font-bold uppercase tracking-wider text-sm">
                <BookOpen className="w-5 h-5" />
                <span>DEBATE TACTICS MANUAL // FIELD INSTRUCTIONS</span>
              </div>
              <button
                onClick={() => setShowManual(false)}
                className="text-zinc-400 hover:text-[#F4F4F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Manual Column 1 */}
              <div className="space-y-3">
                <div className="text-[#FFC93C] font-extrabold uppercase text-xs tracking-widest border-b border-[#232530] pb-1">
                  SYSTEM MODIFIERS [CHALLENGES]
                </div>
                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2.5 bg-[#0B0B0F] border border-[#232530] space-y-1">
                    <div className="font-mono text-[10px] text-[#FFC93C] font-bold">NO ASSUMPTIONS</div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Opponent attacks your underlying logical framework. State explicit, self-evident premises.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#0B0B0F] border border-[#232530] space-y-1">
                    <div className="font-mono text-[10px] text-[#FFC93C] font-bold">EVIDENCE LOCK</div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Support your argument with concrete empirical facts, studies, or operational examples.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#0B0B0F] border border-[#232530] space-y-1">
                    <div className="font-mono text-[10px] text-[#FFC93C] font-bold">500-CHARACTER MAX</div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Strict character count limit per round to enforce precision and eliminate fluff.
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Column 2 */}
              <div className="space-y-3">
                <div className="text-[#FF4B3E] font-extrabold uppercase text-xs tracking-widest border-b border-[#232530] pb-1">
                  VICTORY CONDITIONS
                </div>
                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2.5 bg-[#0B0B0F] border border-[#232530] space-y-1">
                    <div className="font-mono text-[10px] text-[#FF4B3E] font-bold">MINIMUM 1 ROUND W/ EVIDENCE</div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      You must win at least 1 round with proper evidence (score ≥ 60 and evidence score ≥ 60) and keep your argument health above 0 to win the debate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Column 3 */}
              <div className="space-y-3">
                <div className="text-[#3B8EEA] font-extrabold uppercase text-xs tracking-widest border-b border-[#232530] pb-1">
                  TACTICAL FIELD DOCTRINE
                </div>
                <div className="space-y-2.5 text-xs font-sans text-zinc-300 leading-relaxed">
                  <p>
                    1. <strong className="text-[#3B8EEA] font-mono">EVIDENCE REQUIREMENT:</strong> Failing to win any round with proper empirical evidence results in defeat.
                  </p>
                  <p>
                    2. <strong className="text-[#3B8EEA] font-mono">CLOUD HISTORY:</strong> Sign in with Google to sync all your completed match scores and reports to Firestore.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
