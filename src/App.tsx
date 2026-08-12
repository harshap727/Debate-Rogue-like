import React, { useState } from "react";
import {
  GameState,
  Opponent,
  AttackType,
  ChallengeKey,
  HistoryItem,
  FinalEvaluationResponse,
} from "./types";
import { NavigationBar } from "./components/NavigationBar";
import { LandingPage } from "./components/LandingPage";
import { TopicSelect } from "./components/TopicSelect";
import { MatchStart } from "./components/MatchStart";
import { LiveDebate } from "./components/LiveDebate";
import { FinalEvaluation } from "./components/FinalEvaluation";

type Screen = "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  const [gameState, setGameState] = useState<GameState>({
    topic: "",
    position: "FOR",
    round: 1,
    maxRounds: 4,
    argumentHealth: 100,
    opponent: null,
    history: [],
    activeChallenge: null,
    gameOver: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [lastUserArg, setLastUserArg] = useState<string>("");
  const [evaluation, setEvaluation] = useState<FinalEvaluationResponse | null>(null);

  // Helper reset
  const handleReset = () => {
    setGameState({
      topic: "",
      position: "FOR",
      round: 1,
      maxRounds: 4,
      argumentHealth: 100,
      opponent: null,
      history: [],
      activeChallenge: null,
      gameOver: false,
    });
    setScreen("landing");
    setError(null);
    setIsLoading(false);
    setEvaluation(null);
  };

  // 1. Topic Confirmed -> Fetch Opponent -> Match Start
  const handleConfirmTopic = async (topic: string, position: "FOR" | "AGAINST") => {
    setGameState((prev) => ({ ...prev, topic, position }));
    setScreen("match_start");
    await fetchOpponent(topic, position);
  };

  const fetchOpponent = async (topic: string, position: "FOR" | "AGAINST") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-opponent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, position }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: Opponent = await res.json();
      setGameState((prev) => ({ ...prev, opponent: data }));
    } catch (err: any) {
      console.error("Opponent fetch error:", err);
      // Fallback opponent
      setGameState((prev) => ({
        ...prev,
        opponent: {
          opponent: "DEVIL'S ADVOCATE",
          style: "Attacks every vulnerability indiscriminately using counterexamples.",
          difficulty: 5,
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Start Match -> Live Debate
  const handleStartMatch = () => {
    setScreen("live_debate");
  };

  // 3. Deterministic Challenge Selection Mapping
  const mapAttackTypeToChallenge = (attackType: AttackType): ChallengeKey => {
    switch (attackType) {
      case "ASSUMPTION":
        return "NO_ASSUMPTIONS";
      case "EVIDENCE":
        return "EVIDENCE_LOCK";
      case "LOGIC":
        return "THREE_SENTENCES";
      case "REBUTTAL":
        return "COUNTEREXAMPLE";
      default:
        return "THREE_SENTENCES";
    }
  };

  // 4. Submit Argument Turn
  const handleSubmitArgument = async (userArgument: string) => {
    setLastUserArg(userArgument);
    setIsLoading(true);
    setError(null);

    try {
      // Step A: Analyze Argument
      setLoadingStepText("Opponent is analyzing your argument for weaknesses...");
      const analyzeRes = await fetch("/api/analyze-argument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: gameState.topic,
          position: gameState.position,
          userArgument,
          history: gameState.history,
        }),
      });

      if (!analyzeRes.ok) throw new Error(`Analyze API error: ${analyzeRes.status}`);
      const analysisData = await analyzeRes.json();
      const weaknessDetected: AttackType = analysisData.attack_type || "LOGIC";

      // Step B: Generate Opponent Counter-Attack
      setLoadingStepText("Opponent is executing counter-attack...");
      const attackRes = await fetch("/api/generate-attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: gameState.topic,
          position: gameState.position,
          opponent: gameState.opponent,
          attack_type: weaknessDetected,
          userArgument,
          history: gameState.history,
          activeChallenge: gameState.activeChallenge,
        }),
      });

      if (!attackRes.ok) throw new Error(`Attack API error: ${attackRes.status}`);
      const attackData = await attackRes.json();

      const damageTaken = attackData.damage || 15;
      const score = attackData.score || 65;
      const opponentResponse =
        attackData.opponentAttack ||
        "Your argument fails to account for the core structural trade-offs involved.";
      const reason =
        attackData.reason || "Lacked specific empirical backing under cross-examination.";

      // Step C: Deterministically Update Game Engine State
      const newHealth = Math.max(0, gameState.argumentHealth - damageTaken);
      const nextChallenge = mapAttackTypeToChallenge(weaknessDetected);

      const historyItem: HistoryItem = {
        round: gameState.round,
        userArgument,
        opponentResponse,
        weaknessDetected,
        challengeApplied: gameState.activeChallenge,
        score,
        damageTaken,
        reason,
      };

      const updatedHistory = [...gameState.history, historyItem];

      const isFinished = newHealth <= 0 || gameState.round >= gameState.maxRounds;

      if (isFinished) {
        const finalState = {
          ...gameState,
          argumentHealth: newHealth,
          history: updatedHistory,
          gameOver: true,
        };
        setGameState(finalState);
        setScreen("final_eval");
        await triggerFinalEvaluation(finalState);
      } else {
        setGameState({
          ...gameState,
          argumentHealth: newHealth,
          round: gameState.round + 1,
          activeChallenge: nextChallenge,
          history: updatedHistory,
        });
      }
    } catch (err: any) {
      console.error("Error submitting argument turn:", err);
      setError("Network or API hiccup during turn processing. Click retry to resume.");
    } finally {
      setIsLoading(false);
      setLoadingStepText("");
    }
  };

  // 5. Trigger Final Evaluation
  const triggerFinalEvaluation = async (stateToEval: GameState) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/final-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: stateToEval.topic,
          position: stateToEval.position,
          history: stateToEval.history,
          opponent: stateToEval.opponent,
          totalRounds: stateToEval.history.length,
          finalHealth: stateToEval.argumentHealth,
        }),
      });

      if (!res.ok) throw new Error(`Final Eval error ${res.status}`);
      const data: FinalEvaluationResponse = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error("Error in final evaluation:", err);
      // Fallback evaluation
      setEvaluation({
        survival: Math.round(stateToEval.argumentHealth * 0.8 + 20),
        logic: 75,
        evidence: 68,
        rebuttal: 72,
        adaptability: 82,
        strongestArgument: "Maintained structural consistency under direct pressure.",
        biggestWeakness: "Relied on broad assumptions without immediate empirical backing.",
        criticalAssumption: "Assumed implementation feasibility without citing operational metrics.",
        recommendation:
          "Lead with verified empirical evidence early and define your premises explicitly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-[#3B8EEA] selection:text-black">
      
      {/* Global Tactical HUD Navigation Bar & Scores */}
      <NavigationBar
        currentScreen={screen}
        gameState={gameState}
        onNavigate={(newScreen) => setScreen(newScreen)}
        onReset={handleReset}
      />

      <main className="flex-1 flex flex-col">
        {screen === "landing" && (
          <LandingPage onStart={() => setScreen("topic_select")} />
        )}

        {screen === "topic_select" && (
          <TopicSelect
            onConfirmTopic={handleConfirmTopic}
            onBack={() => setScreen("landing")}
          />
        )}

        {screen === "match_start" && (
          <MatchStart
            topic={gameState.topic}
            position={gameState.position}
            opponent={gameState.opponent}
            isLoading={isLoading}
            error={error}
            onRetry={() => fetchOpponent(gameState.topic, gameState.position)}
            onStartMatch={handleStartMatch}
          />
        )}

        {screen === "live_debate" && (
          <LiveDebate
            gameState={gameState}
            onSubmitArgument={handleSubmitArgument}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
            error={error}
            onRetry={() => handleSubmitArgument(lastUserArg)}
          />
        )}

        {screen === "final_eval" && (
          <FinalEvaluation
            gameState={gameState}
            evaluation={evaluation}
            isLoading={isLoading}
            error={error}
            onRetry={() => triggerFinalEvaluation(gameState)}
            onRestart={handleReset}
          />
        )}
      </main>

    </div>
  );
}
