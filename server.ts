import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

// Lazy initialization helper for Gemini AI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MISSING_KEY",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const OPPONENT_PERSONAS = [
  {
    opponent: "LAWYER",
    style: "Attacks precise definitions, logical consistency, and burden of proof.",
    difficulty: 4,
  },
  {
    opponent: "STATISTICIAN",
    style: "Attacks small sample sizes, missing data sources, and correlation vs causation.",
    difficulty: 3,
  },
  {
    opponent: "ECONOMIST",
    style: "Attacks hidden opportunity costs, trade-offs, and unintended economic incentives.",
    difficulty: 4,
  },
  {
    opponent: "PHILOSOPHER",
    style: "Attacks fundamental unstated assumptions, ethical premises, and moral frameworks.",
    difficulty: 5,
  },
  {
    opponent: "DEVIL'S ADVOCATE",
    style: "Attacks every vulnerability indiscriminately using counterexamples and edge cases.",
    difficulty: 5,
  },
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // API 1: OPPONENT GENERATOR
  app.post("/api/generate-opponent", async (req, res) => {
    try {
      const { topic, position } = req.body;
      const ai = getGenAI();

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Topic: "${topic}"\nStudent Position: ${position}`,
        config: {
          systemInstruction:
            "You are a game master assigning a debate opponent. Given the topic and student's position, choose ONE opponent persona from: LAWYER (attacks definitions and logic), STATISTICIAN (attacks evidence), ECONOMIST (attacks trade-offs and incentives), PHILOSOPHER (attacks assumptions), DEVIL'S ADVOCATE (attacks everything indiscriminately). Respond only in the requested JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              opponent: {
                type: Type.STRING,
                description:
                  "Must be one of: LAWYER, STATISTICIAN, ECONOMIST, PHILOSOPHER, DEVIL'S ADVOCATE",
              },
              style: {
                type: Type.STRING,
                description: "1-2 sentence description of their attack strategy.",
              },
              difficulty: {
                type: Type.INTEGER,
                description: "Integer difficulty rating from 1 to 5.",
              },
            },
            required: ["opponent", "style", "difficulty"],
          },
        },
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/generate-opponent:", err);
      // Fallback opponent
      const fallback =
        OPPONENT_PERSONAS[Math.floor(Math.random() * OPPONENT_PERSONAS.length)];
      res.json(fallback);
    }
  });

  // API 2: ARGUMENT ANALYZER
  app.post("/api/analyze-argument", async (req, res) => {
    try {
      const { topic, position, userArgument, history } = req.body;
      const ai = getGenAI();

      const historySummary = Array.isArray(history) && history.length > 0
        ? history
            .map(
              (h: any) =>
                `Round ${h.round}: User said: "${h.userArgument}" | Opponent attacked: "${h.opponentResponse}"`
            )
            .join("\n")
        : "First round of debate.";

      const prompt = `Topic: "${topic}"
Student Position: ${position}
Debate History:
${historySummary}

Latest Student Argument:
"${userArgument}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are analyzing a student's debate argument to find its single biggest weakness. Be precise and specific to what they actually wrote. Respond only in the requested JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              claim: {
                type: Type.STRING,
                description: "The core claim asserted by the student.",
              },
              evidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key evidence or examples mentioned.",
              },
              assumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Unstated assumptions made in the argument.",
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific flaws or gaps in reasoning.",
              },
              attack_type: {
                type: Type.STRING,
                description:
                  "Must be exactly one of: ASSUMPTION, EVIDENCE, LOGIC, REBUTTAL",
              },
            },
            required: [
              "claim",
              "evidence",
              "assumptions",
              "weaknesses",
              "attack_type",
            ],
          },
        },
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);

      // Validate attack_type
      const validTypes = ["ASSUMPTION", "EVIDENCE", "LOGIC", "REBUTTAL"];
      if (!validTypes.includes(parsed.attack_type)) {
        parsed.attack_type = "LOGIC";
      }

      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/analyze-argument:", err);
      // Fallback
      res.json({
        claim: "Student stated their core position on the topic.",
        evidence: [],
        assumptions: ["Assumed premise holds without empirical proof."],
        weaknesses: ["Argument lacks precise supporting evidence or structural rigor."],
        attack_type: "LOGIC",
      });
    }
  });

  // API 3: CHALLENGE / RESPONSE GENERATOR
  app.post("/api/generate-attack", async (req, res) => {
    try {
      const {
        topic,
        position,
        opponent,
        attack_type,
        userArgument,
        history,
        activeChallenge,
      } = req.body;
      const ai = getGenAI();

      const historyText = Array.isArray(history) && history.length > 0
        ? history
            .map(
              (h: any) =>
                `Round ${h.round}: User: "${h.userArgument}" -> Attack: "${h.opponentResponse}"`
            )
            .join("\n")
        : "None (Round 1)";

      const prompt = `Topic: "${topic}" (${position})
Opponent Persona: ${opponent?.name || "DEBATE OPPONENT"} (${opponent?.style || "Sharp interrogator"})
Attack Type Target: ${attack_type}
Active Challenge Constraint: ${activeChallenge || "None"}
Prior Debate Transcript:
${historyText}

Current Student Argument:
"${userArgument}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a sharp, in-character debate opponent with the given persona and style. Attack the argument using the specified attack_type, in a way consistent with your persona's typical attack style. Keep your response to 2-3 sentences maximum — direct, sharp, no preamble, no repeating the student's argument back to them. Never attack the person, only the argument. Reference earlier rounds when relevant to show continuity.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              opponentAttack: {
                type: Type.STRING,
                description:
                  "2-3 sentence sharp, in-character attack on the student's argument.",
              },
              score: {
                type: Type.NUMBER,
                description:
                  "Score 0-100 evaluating quality of student's PRECEDING argument.",
              },
              damage: {
                type: Type.NUMBER,
                description: "Health points to subtract (integer 0 to 30).",
              },
              reason: {
                type: Type.STRING,
                description:
                  "One direct sentence explaining why this score/damage was assigned.",
              },
            },
            required: ["opponentAttack", "score", "damage", "reason"],
          },
        },
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);

      // Clamp damage and score
      parsed.damage = Math.max(0, Math.min(30, Math.round(parsed.damage || 15)));
      parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score || 65)));

      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/generate-attack:", err);
      // Fallback
      res.json({
        opponentAttack:
          "Your argument makes a broad assertion, but fails to address the underlying structural trade-off. Where is your empirical validation for that claim?",
        score: 65,
        damage: 15,
        reason: "Argument lacked specific grounding under counter-interrogation.",
      });
    }
  });

  // API 4: FINAL EVALUATION
  app.post("/api/final-evaluation", async (req, res) => {
    const { topic, position, history, opponent, totalRounds, finalHealth } = req.body;
    try {
      const ai = getGenAI();

      const transcript = Array.isArray(history)
        ? history
            .map(
              (h: any) =>
                `[ROUND ${h.round}]
Student: "${h.userArgument}"
Weakness: ${h.weaknessDetected} | Challenge: ${h.challengeApplied || "None"}
Opponent Attack: "${h.opponentResponse}"
Score: ${h.score} | Damage Taken: ${h.damageTaken} | Reason: ${h.reason}`
            )
            .join("\n\n")
        : "";

      const prompt = `Topic: "${topic}" (${position})
Hidden Opponent Identity: ${opponent?.name || "LAW"} (${opponent?.style || ""})
Rounds Completed: ${totalRounds}
Final Argument Health: ${finalHealth} / 100

Full Match Transcript:
${transcript}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are producing a final debate performance report. Be specific and cite actual moments from the transcript. Respond only in the requested JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              survival: {
                type: Type.NUMBER,
                description: "Score 0-100 for composure and stamina.",
              },
              logic: {
                type: Type.NUMBER,
                description: "Score 0-100 for logical rigor.",
              },
              evidence: {
                type: Type.NUMBER,
                description: "Score 0-100 for empirical backing.",
              },
              rebuttal: {
                type: Type.NUMBER,
                description: "Score 0-100 for handling counter-attacks.",
              },
              adaptability: {
                type: Type.NUMBER,
                description: "Score 0-100 for adhering to active challenge constraints.",
              },
              strongestArgument: {
                type: Type.STRING,
                description:
                  "1-2 sentences summarizing the student's strongest point with quote.",
              },
              biggestWeakness: {
                type: Type.STRING,
                description:
                  "1-2 sentences identifying recurring flaw or opening.",
              },
              criticalAssumption: {
                type: Type.STRING,
                description:
                  "The most vulnerable unexamined assumption from the debate.",
              },
              recommendation: {
                type: Type.STRING,
                description:
                  "Two actionable advice sentences for future high-stakes debates.",
              },
            },
            required: [
              "survival",
              "logic",
              "evidence",
              "rebuttal",
              "adaptability",
              "strongestArgument",
              "biggestWeakness",
              "criticalAssumption",
              "recommendation",
            ],
          },
        },
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/final-evaluation:", err);
      // Fallback
      res.json({
        survival: Math.min(100, Math.max(20, Math.round(finalHealth * 0.8 + 20))),
        logic: 75,
        evidence: 68,
        rebuttal: 72,
        adaptability: 80,
        strongestArgument:
          "Maintained focus on the primary ethical imperative despite aggressive counter-scrutiny.",
        biggestWeakness:
          "Relied on unverified generalizations during intense cross-examination.",
        criticalAssumption:
          "Assumed implementation costs would be negligible without providing economic metrics.",
        recommendation:
          "Lead with concrete evidence early and explicitly define your operational premises before defending them.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DEBATE ROGUELIKE] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
