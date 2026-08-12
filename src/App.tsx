import React, { useState, useEffect } from "react";
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
import { HistoryModal } from "./components/HistoryModal";
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "./lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Screen = "landing" | "topic_select" | "match_start" | "live_debate" | "final_eval";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState<any | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.message?.includes("popup-closed-by-user")
      ) {
        console.log("Sign-in popup was closed by user before completing auth.");
        return;
      }
      console.error("Google sign in error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const [gameState, setGameState] = useState<GameState>({
    topic: "",
    position: "FOR",
    opponentChoice: "AUTO_ASSIGN",
    difficultyLevel: "NORMAL",
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
      opponentChoice: "AUTO_ASSIGN",
      difficultyLevel: "NORMAL",
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
  const handleConfirmTopic = async (topic: string, position: "FOR" | "AGAINST", opponentChoice: string, difficultyLevel: string) => {
    setGameState((prev) => ({ ...prev, topic, position, opponentChoice, difficultyLevel }));
    setScreen("match_start");
    await fetchOpponent(topic, position, opponentChoice);
  };

  const fetchOpponent = async (topic: string, position: "FOR" | "AGAINST", opponentChoice: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-opponent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, position, opponentChoice }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: Opponent = await res.json();
      setGameState((prev) => ({ ...prev, opponent: data }));
    } catch (err: any) {
      console.error("Opponent fetch error:", err);
      setGameState((prev) => ({
        ...prev,
        opponent: {
          opponent: "Harvey Goodman",
          style: "Precise, calm, skeptical, intimidating. Probes definitions, burden of proof, and exceptions.",
          difficulty: 4,
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
          difficultyLevel: gameState.difficultyLevel,
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

      // Step C: Update State
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
        scores: attackData.scores,
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
      
      const passedRounds = stateToEval.history.filter((h) => h.score >= 60).length;
      if (passedRounds < 2) {
        data.survival = Math.min(45, data.survival);
        data.biggestWeakness = `[DEFEAT: ONLY PASSED ${passedRounds}/2 REQUIRED ROUNDS]. ` + data.biggestWeakness;
      }

      setEvaluation(data);

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await addDoc(collection(db, "debates"), {
            userId: user.uid,
            topic: stateToEval.topic,
            position: stateToEval.position,
            opponent: stateToEval.opponent,
            difficultyLevel: stateToEval.difficultyLevel || "NORMAL",
            history: stateToEval.history,
            finalHealth: stateToEval.argumentHealth,
            evaluation: data,
            createdAt: serverTimestamp(),
          });
        } catch (dbErr) {
          console.error("Error saving debate to Firestore:", dbErr);
        }
      }
    } catch (err: any) {
      console.error("Error in final evaluation:", err);
      const passedRounds = stateToEval.history.filter((h) => h.score >= 60).length;
      const survivalScore = passedRounds < 2 ? 35 : Math.round(stateToEval.argumentHealth * 0.8 + 20);
      const fallbackEval: FinalEvaluationResponse = {
        survival: survivalScore,
        logic: 75,
        evidence: 68,
        rebuttal: 72,
        adaptability: 82,
        strongestArgument: "Maintained structural consistency under direct pressure.",
        biggestWeakness: passedRounds < 2 
          ? `[DEFEAT: ONLY PASSED ${passedRounds}/2 REQUIRED ROUNDS]. Relied on broad assumptions.`
          : "Relied on broad assumptions without immediate empirical backing.",
        criticalAssumption: "Assumed implementation feasibility without citing operational metrics.",
        recommendation: "Lead with verified empirical evidence early and define your premises explicitly.",
      };
      setEvaluation(fallbackEval);

      if (user) {
        try {
          await addDoc(collection(db, "debates"), {
            userId: user.uid,
            topic: stateToEval.topic,
            position: stateToEval.position,
            opponent: stateToEval.opponent,
            difficultyLevel: stateToEval.difficultyLevel || "NORMAL",
            history: stateToEval.history,
            finalHealth: stateToEval.argumentHealth,
            evaluation: fallbackEval,
            createdAt: serverTimestamp(),
          });
        } catch (dbErr) {
          console.error("Error saving debate to Firestore:", dbErr);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-[#3B8EEA] selection:text-black">
      
      {/* Responsive Navigation Pane (Sidebar on PC, Top on Mobile/Tab) */}
      <NavigationBar
        currentScreen={screen}
        gameState={gameState}
        onNavigate={(newScreen) => setScreen(newScreen)}
        onReset={handleReset}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenHistory={() => setShowHistoryModal(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
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
            onRetry={() => fetchOpponent(gameState.topic, gameState.position, gameState.opponentChoice || "AUTO_ASSIGN")}
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

      {/* History Cloud Archive Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        user={user}
      />

    </div>
  );
}
