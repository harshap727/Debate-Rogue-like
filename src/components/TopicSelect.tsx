import React, { useState } from "react";
import { CURATED_TOPICS, CuratedTopic } from "../types";
import {
  Check,
  Edit3,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Scale,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Eye,
  Cpu,
} from "lucide-react";

interface TopicSelectProps {
  onConfirmTopic: (topic: string, position: "FOR" | "AGAINST", selectedOpponent: string, difficultyLevel: string) => void;
  onBack: () => void;
}

const OPPONENT_OPTIONS = [
  {
    id: "AUTO_ASSIGN",
    name: "Dynamic Matchmaker",
    role: "Ref's Recommendation",
    difficulty: "Variable",
    style: "The AI Referee evaluates your topic and assigns the opponent with the highest critical tension.",
    icon: Cpu,
    color: "#3B8EEA",
  },
  {
    id: "Harvey Goodman",
    name: "Harvey Goodman",
    role: "Lawyer",
    difficulty: "★★★★☆",
    style: "Attacks definitions, precision, logical contradictions, and burden of proof.",
    icon: Scale,
    color: "#E2BA49",
  },
  {
    id: "Goldeen Sachs",
    name: "Goldeen Sachs",
    role: "Economist",
    difficulty: "★★★★☆",
    style: "Probes opportunity costs, economic incentives, resource allocation, and trade-offs.",
    icon: TrendingUp,
    color: "#2ED573",
  },
  {
    id: "Zhang Kiyosaki",
    name: "Zhang Kiyosaki",
    role: "Data Analyst",
    difficulty: "★★★☆☆",
    style: "Targets statistical sample sizes, methodology bias, metrics, and correlation vs causation.",
    icon: BarChart3,
    color: "#FF9F43",
  },
  {
    id: "Karl Friedrich",
    name: "Karl Friedrich",
    role: "Philosopher",
    difficulty: "★★★★★",
    style: "Probes moral consistency, universal rules, first principles, and unstated assumptions.",
    icon: HelpCircle,
    color: "#A55EEA",
  },
  {
    id: "Conan Chandler",
    name: "Conan Chandler",
    role: "Detective",
    difficulty: "★★★★★",
    style: "Probes unstated logical gaps, alternative explanations, and unexplained variables.",
    icon: Eye,
    color: "#FF4B3E",
  },
];

export const TopicSelect: React.FC<TopicSelectProps> = ({
  onConfirmTopic,
  onBack,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(CURATED_TOPICS[0].id);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [useCustomTopic, setUseCustomTopic] = useState<boolean>(false);
  const [position, setPosition] = useState<"FOR" | "AGAINST">("FOR");
  const [opponentChoice, setOpponentChoice] = useState<string>("AUTO_ASSIGN");
  const [difficultyLevel, setDifficultyLevel] = useState<string>("NORMAL");

  const handleSelectCurated = (topic: CuratedTopic) => {
    setSelectedTopicId(topic.id);
    setUseCustomTopic(false);
  };

  const handleCustomTopicChange = (val: string) => {
    setCustomTopic(val);
    if (val.trim().length > 0) {
      setUseCustomTopic(true);
    }
  };

  const getEffectiveTopic = (): string => {
    if (useCustomTopic && customTopic.trim().length > 0) {
      return customTopic.trim();
    }
    const found = CURATED_TOPICS.find((t) => t.id === selectedTopicId);
    return found ? found.title : CURATED_TOPICS[0].title;
  };

  const handleProceed = () => {
    const finalTopic = getEffectiveTopic();
    if (!finalTopic) return;
    onConfirmTopic(finalTopic, position, opponentChoice, difficultyLevel);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#232530] pb-4 font-mono">
        <div>
          <span className="font-mono text-xs text-[#3B8EEA] tracking-widest uppercase font-semibold">
            STEP 01 // DEBATE PARAMETERS
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-[#F4F4F6] uppercase mt-1">
            SELECT TOPIC & OPPONENT
          </h2>
        </div>
        <button
          onClick={onBack}
          className="font-mono text-xs text-zinc-400 hover:text-[#F4F4F6] hover:border-[#F4F4F6] border border-[#232530] px-3 py-1.5 transition-colors cursor-pointer"
        >
          [ ← RETURN TO MAIN ]
        </button>
      </div>

      {/* Topics Grid */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs text-[#F4F4F6] font-bold uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#3B8EEA]" />
            CHOOSE CURATED TOPIC ARENA
          </label>
          <span className="font-mono text-[11px] text-zinc-400">
            {CURATED_TOPICS.length} ARENAS AVAILABLE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CURATED_TOPICS.map((topic) => {
            const isSelected = !useCustomTopic && selectedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => handleSelectCurated(topic)}
                className={`p-4 border transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-[#13141C] border-[#3B8EEA] text-[#F4F4F6]"
                    : "bg-[#13141C] border-[#232530] text-zinc-300 hover:border-zinc-500"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] tracking-wider text-[#3B8EEA] font-bold uppercase bg-[#0B0B0F] px-2 py-0.5 border border-[#232530]">
                    {topic.category}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-[#3B8EEA] text-black flex items-center justify-center font-bold text-xs shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#F4F4F6] mb-1 leading-snug font-sans">
                  {topic.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {topic.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Topic Field */}
      <div className="hud-panel p-4 border border-[#232530] space-y-2">
        <label className="font-mono text-xs text-[#F4F4F6] font-bold uppercase tracking-wider flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-[#3B8EEA]" />
          OR ENTER CUSTOM TOPIC
        </label>
        <div className="relative font-mono">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => handleCustomTopicChange(e.target.value)}
            placeholder="e.g. Should universal healthcare be fully state-funded?"
            className={`w-full bg-[#0B0B0F] border px-3.5 py-2.5 text-sm font-sans focus:outline-none transition-colors ${
              useCustomTopic && customTopic.trim().length > 0
                ? "border-[#3B8EEA] text-[#F4F4F6]"
                : "border-[#232530] text-zinc-200 focus:border-zinc-500"
            }`}
          />
          {useCustomTopic && customTopic.trim().length > 0 && (
            <span className="absolute right-3 top-2.5 font-mono text-[10px] bg-[#3B8EEA] text-black px-1.5 py-0.5 font-bold uppercase">
              CUSTOM ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Position Toggle Section */}
      <div className="hud-panel p-5 border border-[#232530] space-y-4 font-mono">
        <div>
          <label className="font-mono text-xs text-[#F4F4F6] font-bold uppercase tracking-wider block mb-1">
            SELECT YOUR ADVOCACY STANCE
          </label>
          <p className="text-xs text-zinc-400 font-sans">
            Your opponent will automatically argue the opposing viewpoint.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono">
          <button
            type="button"
            onClick={() => setPosition("FOR")}
            className={`py-3.5 px-4 text-center border font-bold text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
              position === "FOR"
                ? "bg-[#2ED573]/10 border-[#2ED573] text-[#2ED573]"
                : "bg-[#0B0B0F] border-[#232530] text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <span className={`w-2.5 h-2.5 ${position === "FOR" ? "bg-[#2ED573]" : "bg-zinc-600"}`} />
            [ FOR / AFFIRMATIVE ]
          </button>

          <button
            type="button"
            onClick={() => setPosition("AGAINST")}
            className={`py-3.5 px-4 text-center border font-bold text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
              position === "AGAINST"
                ? "bg-[#FF4B3E]/10 border-[#FF4B3E] text-[#FF4B3E]"
                : "bg-[#0B0B0F] border-[#232530] text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <span className={`w-2.5 h-2.5 ${position === "AGAINST" ? "bg-[#FF4B3E]" : "bg-zinc-600"}`} />
            [ AGAINST / NEGATIVE ]
          </button>
        </div>
      </div>

      {/* Opponent Selection Section */}
      <div className="hud-panel p-5 border border-[#232530] space-y-4 font-mono">
        <div>
          <label className="font-mono text-xs text-[#F4F4F6] font-bold uppercase tracking-wider block mb-1">
            SELECT YOUR DEBATE OPPONENT
          </label>
          <p className="text-xs text-zinc-400 font-sans">
            Each character targets a completely different dimension of critical reasoning and logical rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {OPPONENT_OPTIONS.map((opt) => {
            const isSelected = opponentChoice === opt.id;
            const IconComponent = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setOpponentChoice(opt.id)}
                className={`p-4 text-left border transition-all cursor-pointer flex flex-col justify-between h-44 relative group ${
                  isSelected
                    ? "bg-[#13141C] border-[#3B8EEA]"
                    : "bg-[#0B0B0F] border-[#232530] hover:border-zinc-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      className="p-1.5 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: `${opt.color}15`, color: opt.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase text-zinc-400">
                      DIFF: <span style={{ color: opt.color }}>{opt.difficulty}</span>
                    </span>
                  </div>

                  <h4 className="font-mono text-sm font-bold text-[#F4F4F6] leading-tight">
                    {opt.name}
                  </h4>
                  <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                    {opt.role}
                  </p>
                  <p className="text-xs text-zinc-400 font-sans leading-snug mt-2 line-clamp-3">
                    {opt.style}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute right-2 bottom-2 w-4 h-4 bg-[#3B8EEA] flex items-center justify-center text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level Selection Section */}
      <div className="hud-panel p-5 border border-[#232530] space-y-4 font-mono">
        <div>
          <label className="font-mono text-xs text-[#F4F4F6] font-bold uppercase tracking-wider block mb-1">
            SELECT DEBATE DIFFICULTY TIER
          </label>
          <p className="text-xs text-zinc-400 font-sans">
            Controls damage multipliers and AI attack rigor during cross-examination.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          {[
            { id: "EASY", name: "EASY", desc: "0.7x Damage", color: "#2ED573" },
            { id: "NORMAL", name: "NORMAL", desc: "1.0x Standard", color: "#3B8EEA" },
            { id: "HARD", name: "HARD", desc: "1.3x Relentless", color: "#FFC93C" },
            { id: "EXPERT", name: "EXPERT", desc: "1.6x Brutal", color: "#FF4B3E" },
          ].map((lvl) => {
            const isSelected = difficultyLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setDifficultyLevel(lvl.id)}
                className={`p-3 text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-[#13141C] border-[#3B8EEA] text-[#F4F4F6]"
                    : "bg-[#0B0B0F] border-[#232530] text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <span className="font-bold text-xs" style={{ color: lvl.color }}>
                  [{lvl.name}]
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-sans">
                  {lvl.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm CTA */}
      <div className="pt-2 font-mono">
        <button
          onClick={handleProceed}
          className="w-full py-4 bg-[#3B8EEA] hover:bg-[#F4F4F6] text-black font-mono font-bold text-base uppercase tracking-wider transition-colors flex items-center justify-center gap-3 border border-[#3B8EEA] hover:border-[#F4F4F6] cursor-pointer"
        >
          <span>LOCK IN PARAMETERS & DEPLOY ARENA</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};

