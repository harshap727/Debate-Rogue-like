import React from "react";
import {
  GameState,
  FinalEvaluationResponse,
  OPPONENT_FLAVORS,
} from "../types";
import {
  Award,
  Skull,
  RotateCcw,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

interface FinalEvaluationProps {
  gameState: GameState;
  evaluation: FinalEvaluationResponse | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onRestart: () => void;
}

export const FinalEvaluation: React.FC<FinalEvaluationProps> = ({
  gameState,
  evaluation,
  isLoading,
  error,
  onRetry,
  onRestart,
}) => {
  const { topic, position, argumentHealth, opponent, history } = gameState;

  const totalRoundsCompleted = history.length;
  const survivedAllRounds = argumentHealth > 0;

  const opponentName = opponent?.opponent || "DEVIL'S ADVOCATE";
  const opponentFlavor =
    OPPONENT_FLAVORS[opponentName] ||
    "who interrogated your argument's structure aggressively.";

  // Metric Bar helper component
  const MetricBar = ({ label, score }: { label: string; score: number }) => {
    let colorClass = "bg-[#2ED573] text-[#2ED573]";
    if (score < 50) colorClass = "bg-[#FF4B3E] text-[#FF4B3E]";
    else if (score < 75) colorClass = "bg-[#FFC93C] text-[#FFC93C]";

    return (
      <div className="space-y-1 font-mono">
        <div className="flex justify-between text-xs">
          <span className="text-[#F4F4F6] uppercase tracking-wider">{label}</span>
          <span className={`font-bold ${colorClass.split(" ")[1]}`}>
            {score}/100
          </span>
        </div>
        <div className="w-full h-2 bg-[#0B0B0F] border border-[#232530] overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${colorClass.split(" ")[0]}`}
            style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-mono space-y-8">
      
      {/* Top Banner Status */}
      <div className="hud-panel border border-[#232530] p-6 text-center space-y-3 relative overflow-hidden bg-[#13141C]">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B0B0F] border border-[#232530] font-mono text-xs text-[#3B8EEA] tracking-widest uppercase">
          <Award className="w-4 h-4 text-[#3B8EEA]" />
          POST-MATCH DEBRIEF // PERFORMANCE EVALUATION
        </div>

        <h1 className="font-mono text-3xl sm:text-4xl font-extrabold text-[#F4F4F6] tracking-tight uppercase">
          {survivedAllRounds ? (
            <span className="text-[#2ED573]">DEBATE SURVIVED</span>
          ) : (
            <span className="text-[#FF4B3E]">ARGUMENT COLLAPSED</span>
          )}
        </h1>

        <p className="font-mono text-xs text-zinc-400">
          COMPLETED {totalRoundsCompleted} ROUNDS // FINAL HEALTH:{" "}
          <strong className={survivedAllRounds ? "text-[#2ED573]" : "text-[#FF4B3E]"}>
            {argumentHealth}/100
          </strong>
        </p>
      </div>

      {/* Opponent Identity Reveal Banner */}
      <div className="hud-panel bg-[#0B0B0F] border border-[#FF4B3E] p-6 space-y-3 relative font-mono">
        <div className="flex items-center gap-2 font-mono text-xs text-[#FF4B3E] font-bold uppercase tracking-widest">
          <Skull className="w-5 h-5 text-[#FF4B3E]" />
          <span>HIDDEN OPPONENT REVEALED</span>
        </div>

        <div className="space-y-1">
          <h2 className="font-mono text-xl sm:text-2xl font-black text-[#F4F4F6] uppercase tracking-wider">
            YOU WERE UP AGAINST: <span className="text-[#FF4B3E]">{opponentName}</span>
          </h2>
          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            "{opponentName} — {opponentFlavor}"
          </p>
        </div>

        {opponent?.style && (
          <p className="font-mono text-xs text-zinc-400 bg-[#13141C] p-3 border border-[#232530]">
            <strong className="text-[#3B8EEA]">ATTACK PROFILE:</strong> {opponent.style}
          </p>
        )}
      </div>

      {/* Loading vs Content */}
      {isLoading ? (
        <div className="hud-panel p-12 text-center space-y-3 font-mono bg-[#13141C] border border-[#232530]">
          <div className="w-8 h-8 border-2 border-[#3B8EEA] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#3B8EEA] uppercase font-bold tracking-widest">
            COMPILING FINAL TACTICAL PERFORMANCE REPORT...
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-[#FF4B3E]/10 border border-[#FF4B3E] text-[#FF4B3E] text-center font-mono text-xs space-y-3">
          <AlertCircle className="w-6 h-6 text-[#FF4B3E] mx-auto" />
          <p>{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#0B0B0F] hover:bg-[#F4F4F6] hover:text-black text-[#F4F4F6] font-mono text-xs border border-[#232530] hover:border-[#F4F4F6] transition-colors cursor-pointer"
          >
            [ RETRY EVALUATION ]
          </button>
        </div>
      ) : evaluation ? (
        <div className="space-y-6">
          
          {/* Radar Metrics Grid */}
          <div className="hud-panel p-6 border border-[#232530] space-y-4 bg-[#13141C]">
            <h3 className="font-mono text-xs text-[#F4F4F6] font-bold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3B8EEA]" />
              RHETORICAL SCORECARD METRICS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <MetricBar label="01. SURVIVAL & STAMINA" score={evaluation.survival} />
              <MetricBar label="02. LOGICAL RIGOR" score={evaluation.logic} />
              <MetricBar label="03. EVIDENCE QUALITY" score={evaluation.evidence} />
              <MetricBar label="04. REBUTTAL SPEED" score={evaluation.rebuttal} />
              <MetricBar label="05. ADAPTABILITY & RULES" score={evaluation.adaptability} />
            </div>
          </div>

          {/* Detailed Observations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            
            {/* Strongest Moment */}
            <div className="hud-panel p-5 border border-[#2ED573] bg-[#0B0B0F] space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#2ED573] font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>STRONGEST ARGUMENT MOMENT</span>
              </div>
              <p className="text-xs text-[#F4F4F6] font-sans leading-relaxed">
                {evaluation.strongestArgument}
              </p>
            </div>

            {/* Biggest Weakness */}
            <div className="hud-panel p-5 border border-[#FF4B3E] bg-[#0B0B0F] space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#FF4B3E] font-bold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>PRIMARY RECURRING WEAKNESS</span>
              </div>
              <p className="text-xs text-[#F4F4F6] font-sans leading-relaxed">
                {evaluation.biggestWeakness}
              </p>
            </div>

            {/* Critical Assumption */}
            <div className="hud-panel p-5 border border-[#FFC93C] bg-[#0B0B0F] space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#FFC93C] font-bold uppercase">
                <Zap className="w-4 h-4" />
                <span>CRITICAL UNEXAMINED ASSUMPTION</span>
              </div>
              <p className="text-xs text-[#F4F4F6] font-sans leading-relaxed">
                {evaluation.criticalAssumption}
              </p>
            </div>

            {/* Expert Recommendation */}
            <div className="hud-panel p-5 border border-[#3B8EEA] bg-[#0B0B0F] space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#3B8EEA] font-bold uppercase">
                <BookOpen className="w-4 h-4" />
                <span>ACTIONABLE DEBATE RECOMMENDATION</span>
              </div>
              <p className="text-xs text-[#F4F4F6] font-sans leading-relaxed">
                {evaluation.recommendation}
              </p>
            </div>

          </div>

        </div>
      ) : null}

      {/* Restart CTA */}
      <div className="pt-4 text-center font-mono">
        <button
          onClick={onRestart}
          className="w-full sm:w-80 mx-auto py-4 bg-[#3B8EEA] hover:bg-[#F4F4F6] text-black font-mono font-bold text-base uppercase tracking-wider transition-colors flex items-center justify-center gap-3 border border-[#3B8EEA] hover:border-[#F4F4F6] cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>RESTART NEW DEBATE RUN</span>
        </button>
      </div>

    </div>
  );
};
