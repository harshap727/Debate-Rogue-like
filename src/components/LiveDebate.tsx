import React, { useState, useEffect, useRef } from "react";
import { GameState, CHALLENGE_MAP, ChallengeKey } from "../types";
import {
  Send,
  Mic,
  MicOff,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Cpu,
  User,
  Zap,
  CornerDownRight,
  Info,
} from "lucide-react";

interface LiveDebateProps {
  gameState: GameState;
  onSubmitArgument: (text: string) => Promise<void>;
  isLoading: boolean;
  loadingStepText: string;
  error: string | null;
  onRetry: () => void;
}

export const LiveDebate: React.FC<LiveDebateProps> = ({
  gameState,
  onSubmitArgument,
  isLoading,
  loadingStepText,
  error,
  onRetry,
}) => {
  const { round, maxRounds, argumentHealth, history, activeChallenge } = gameState;

  const [inputArgument, setInputArgument] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-US";

      recog.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputArgument((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recog.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  // Auto scroll transcript to bottom on history change or loading
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history.length, isLoading, loadingStepText]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
      }
    }
  };

  const activeChallengeInfo = activeChallenge ? CHALLENGE_MAP[activeChallenge] : null;

  // Sentence count helper for 3 sentences challenge feedback
  const countSentences = (text: string): number => {
    const clean = text.trim();
    if (!clean) return 0;
    const matches = clean.match(/[^.!?]+[.!?]+/g);
    if (!matches) return 1;
    return matches.length;
  };

  const charCount = inputArgument.length;
  const isCharLimitExceeded = charCount > 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputArgument.trim() || isLoading || charCount > 500) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    const arg = inputArgument.trim();
    setInputArgument("");
    await onSubmitArgument(arg);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans flex flex-col gap-6 min-h-[calc(100vh-120px)]">
      
      {/* Active Challenge Alert Banner */}
      {activeChallengeInfo && (
        <div className="bg-[#FFC93C]/10 border border-[#FFC93C] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#FFC93C] font-mono">
          <div className="flex items-center gap-2.5 text-xs">
            <ShieldAlert className="w-5 h-5 text-[#FFC93C] shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider mr-2">
                ACTIVE CHALLENGE MODIFIER: {activeChallengeInfo.title}
              </span>
              <p className="text-zinc-300 text-xs font-sans mt-0.5">
                {activeChallengeInfo.rule}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-[#FFC93C] text-black font-bold px-2 py-0.5 uppercase shrink-0">
            MANDATORY RULE
          </span>
        </div>
      )}

      {/* Debate Transcript Log */}
      <div className="flex-1 hud-panel border border-[#232530] p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[520px] bg-[#13141C]">
        
        {history.length === 0 ? (
          <div className="py-12 text-center space-y-2 font-mono">
            <Cpu className="w-8 h-8 text-[#3B8EEA] mx-auto opacity-80" />
            <p className="text-sm text-[#F4F4F6] uppercase tracking-widest font-bold">
              MATCH OPENED // ROUND 1 DEBATE INITIATED
            </p>
            <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans">
              State your primary thesis and evidence below to establish your position. The hidden opponent is waiting to interrogate your logic.
            </p>
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="space-y-4 border-b border-[#232530] pb-6 last:border-b-0">
              
              {/* Student Argument Box (Student Input Theme #3B8EEA) */}
              <div className="hud-panel bg-[#0B0B0F] border border-[#3B8EEA] p-4 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs border-b border-[#232530] pb-2">
                  <div className="flex items-center gap-2 text-[#3B8EEA] font-bold">
                    <User className="w-4 h-4" />
                    <span>STUDENT ARGUMENT // ROUND {item.round}</span>
                  </div>
                  {item.challengeApplied && (
                    <span className="text-[10px] bg-[#13141C] text-zinc-400 px-2 py-0.5 border border-[#232530]">
                      UNDER: {item.challengeApplied}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#F4F4F6] font-sans leading-relaxed whitespace-pre-wrap">
                  "{item.userArgument}"
                </p>
              </div>

              {/* Weakness Detection Diagnostic Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0B0B0F] border border-[#232530] text-xs font-mono w-fit mx-auto sm:ml-6">
                <Zap className="w-3.5 h-3.5 text-[#FFC93C]" />
                <span className="text-zinc-400">ANALYSIS:</span>
                <span className="text-[#FFC93C] font-bold uppercase">
                  WEAKNESS DETECTED: {item.weaknessDetected}
                </span>
              </div>

              {/* Opponent Attack Box (Damage/Attack Theme #FF4B3E) */}
              <div className="hud-panel bg-[#0B0B0F] border border-[#FF4B3E] p-4 space-y-2.5 sm:ml-6">
                <div className="flex items-center justify-between font-mono text-xs border-b border-[#232530] pb-2">
                  <div className="flex items-center gap-2 text-[#FF4B3E] font-bold">
                    <CornerDownRight className="w-4 h-4" />
                    <span>OPPONENT COUNTER-ATTACK</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px]">
                      QUALITY SCORE: <strong className="text-[#F4F4F6]">{item.score}/100</strong>
                    </span>
                    <span className="text-black font-bold text-xs bg-[#FF4B3E] px-2 py-0.5 border border-[#FF4B3E]">
                      -{item.damageTaken} HEALTH
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#F4F4F6] font-sans leading-relaxed font-medium">
                  "{item.opponentResponse}"
                </p>

                <p className="font-mono text-[11px] text-zinc-400 bg-[#13141C] p-2 border border-[#232530]">
                  <strong className="text-[#3B8EEA]">RATIONALE:</strong> {item.reason}
                </p>
              </div>

            </div>
          ))
        )}

        {/* Loading Overlay inside Log */}
        {isLoading && (
          <div className="py-8 px-4 bg-[#0B0B0F] border border-[#3B8EEA] text-center space-y-3 font-mono">
            <RefreshCw className="w-6 h-6 text-[#3B8EEA] animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs text-[#3B8EEA] font-bold uppercase tracking-widest">
                {loadingStepText || "OPPONENT IS PROCESSING YOUR ARGUMENT..."}
              </p>
              <p className="text-[11px] text-zinc-400 font-sans">
                Generating structured analysis & executing persona attack
              </p>
            </div>
          </div>
        )}

        {/* Error State Banner */}
        {error && (
          <div className="p-4 bg-[#FF4B3E]/10 border border-[#FF4B3E] text-[#FF4B3E] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF4B3E] shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-[#FF4B3E] hover:bg-[#F4F4F6] text-black font-bold border border-[#FF4B3E] transition-colors cursor-pointer shrink-0"
            >
              [ RETRY LAST STEP ]
            </button>
          </div>
        )}

        <div ref={scrollBottomRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="space-y-3 font-mono">
        
        {/* Helper rule badges above input */}
        <div className="flex items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-[#3B8EEA] font-bold">ROUND {round} ARGUMENT INPUT</span>
          </div>

          <div className={`text-[11px] font-bold ${charCount > 500 ? "text-[#FF4B3E]" : "text-zinc-400"}`}>
            {charCount} / 500 CHARS MAX
          </div>
        </div>

        {/* Textarea & Mic + Submit controls */}
        <div className="relative">
          <textarea
            rows={3}
            maxLength={500}
            value={inputArgument}
            onChange={(e) => setInputArgument(e.target.value)}
            disabled={isLoading}
            placeholder={
              activeChallengeInfo
                ? `Write your argument following active challenge rule (${activeChallengeInfo.title})...`
                : "Type your argument thesis and evidence clearly (max 500 chars)..."
            }
            className={`w-full bg-[#0B0B0F] border p-3.5 text-sm font-sans text-[#F4F4F6] focus:outline-none transition-colors resize-none ${
              charCount > 500
                ? "border-[#FF4B3E] focus:border-[#FF4B3E]"
                : "border-[#232530] focus:border-[#3B8EEA]"
            }`}
          />

          {/* Bottom Toolbar inside text area */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#232530]">
            
            {/* Optional Speech To Text Mic Toggle */}
            {speechSupported ? (
              <button
                type="button"
                onClick={toggleMic}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border transition-colors cursor-pointer ${
                  isListening
                    ? "bg-[#FF4B3E] border-[#FF4B3E] text-black font-bold animate-pulse"
                    : "bg-[#13141C] border-[#232530] text-zinc-400 hover:text-[#F4F4F6]"
                }`}
              >
                {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isListening ? "LISTENING..." : "SPEECH TO TEXT"}</span>
              </button>
            ) : (
              <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                <Info className="w-3 h-3" /> TEXT INPUT PREFERRED
              </span>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !inputArgument.trim()}
              className="px-6 py-2 bg-[#3B8EEA] hover:bg-[#F4F4F6] hover:text-black disabled:bg-[#13141C] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#3B8EEA] disabled:border-[#232530] disabled:text-zinc-600 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>SUBMIT ARGUMENT</span>
              <Send className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

      </form>

    </div>
  );
};
