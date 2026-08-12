export type AttackType = "ASSUMPTION" | "EVIDENCE" | "LOGIC" | "REBUTTAL";

export type ChallengeKey =
  | "NO_ASSUMPTIONS"
  | "EVIDENCE_LOCK"
  | "THREE_SENTENCES"
  | "COUNTEREXAMPLE";

export interface ChallengeInfo {
  key: ChallengeKey;
  title: string;
  badge: string;
  rule: string;
  icon: string;
}

export interface Opponent {
  opponent: string; // e.g. LAWYER, STATISTICIAN, ECONOMIST, PHILOSOPHER, DEVIL'S ADVOCATE
  style: string;
  difficulty: number; // 1 to 5
}

export interface HistoryItem {
  round: number;
  userArgument: string;
  opponentResponse: string;
  weaknessDetected: AttackType;
  challengeApplied: ChallengeKey | null;
  score: number;
  damageTaken: number;
  reason: string;
}

export interface GameState {
  topic: string;
  position: "FOR" | "AGAINST";
  round: number;
  maxRounds: number;
  argumentHealth: number;
  opponent: Opponent | null;
  history: HistoryItem[];
  activeChallenge: ChallengeKey | null;
  gameOver: boolean;
}

export interface CuratedTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
}

export const CURATED_TOPICS: CuratedTopic[] = [
  {
    id: "social-media",
    title: "Should social media algorithms be legally regulated?",
    category: "TECH & GOVERNANCE",
    summary: "Debate public oversight versus corporate free speech and platform innovation.",
  },
  {
    id: "ai-schools",
    title: "Should AI tools be permitted in middle & high school education?",
    category: "EDUCATION & AI",
    summary: "Examine skill atrophy versus early AI literacy and tool mastery.",
  },
  {
    id: "ubi",
    title: "Is Universal Basic Income necessary in an automated economy?",
    category: "ECONOMICS & AUTOMATION",
    summary: "Balancing wage disruption against inflation risk and fiscal sustainability.",
  },
  {
    id: "nuclear-energy",
    title: "Should nuclear power be rapidly expanded for climate mitigation?",
    category: "ENERGY & CLIMATE",
    summary: "Compare zero-carbon baseload energy against waste management and safety concerns.",
  },
  {
    id: "remote-work",
    title: "Should remote work be established as a legally protected right?",
    category: "LABOR & FUTURE OF WORK",
    summary: "Weigh worker autonomy and geographic flexibility against team cohesion and property value.",
  },
  {
    id: "gene-editing",
    title: "Should human embryo gene editing be permitted for non-fatal traits?",
    category: "BIOETHICS",
    summary: "Debate genetic inequality and designer traits versus preventative human enhancement.",
  },
];

export const CHALLENGE_MAP: Record<AttackType, ChallengeInfo> = {
  ASSUMPTION: {
    key: "NO_ASSUMPTIONS",
    title: "NO ASSUMPTIONS",
    badge: "⚡ NO ASSUMPTIONS",
    rule: "You must explicitly state and justify every premise before asserting your conclusion.",
    icon: "ShieldAlert",
  },
  EVIDENCE: {
    key: "EVIDENCE_LOCK",
    title: "EVIDENCE LOCK",
    badge: "🔒 EVIDENCE LOCK",
    rule: "You cannot reuse any evidence, statistic, or example already cited this match.",
    icon: "Lock",
  },
  LOGIC: {
    key: "THREE_SENTENCES",
    title: "THREE SENTENCES ONLY",
    badge: "⏱️ THREE SENTENCES",
    rule: "Your response is capped at exactly 3 sentences maximum. Eliminate fluff.",
    icon: "Maximize2",
  },
  REBUTTAL: {
    key: "COUNTEREXAMPLE",
    title: "COUNTEREXAMPLE REQUIRED",
    badge: "🎯 COUNTEREXAMPLE",
    rule: "You must directly address a specific counterexample before introducing new claims.",
    icon: "Target",
  },
};

export const OPPONENT_FLAVORS: Record<string, string> = {
  LAWYER: "who spent the entire match hunting for precise definitions, logical gaps, and legal burdens.",
  STATISTICIAN: "who dismantled your empirical claims and exposed unverified sample sizes.",
  ECONOMIST: "who relentlessly probed your hidden trade-offs, opportunity costs, and market incentives.",
  PHILOSOPHER: "who unraveled your foundational unexamined assumptions and moral premises.",
  "DEVIL'S ADVOCATE": "who attacked every single structural opening indiscriminately.",
};

export interface AnalysisResponse {
  claim: string;
  evidence: string[];
  assumptions: string[];
  weaknesses: string[];
  attack_type: AttackType;
}

export interface AttackResponse {
  opponentAttack: string;
  score: number;
  damage: number;
  reason: string;
}

export interface FinalEvaluationResponse {
  survival: number;
  logic: number;
  evidence: number;
  rebuttal: number;
  adaptability: number;
  strongestArgument: string;
  biggestWeakness: string;
  criticalAssumption: string;
  recommendation: string;
}
