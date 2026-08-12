<div align="center">
⚔️ DEBATE ROGUELIKE
An AI that doesn't help you build your argument. It tries to destroy it.

Face five AI opponents, each with their own reasoning style, each hunting for a different weakness in what you just said. Survive, adapt, get better.

Show Image Show Image Show Image Show Image

</div> <br>
⚡ The Idea

Most AI writing tools want to help you sound convincing. This one doesn't.

You pick a topic, take a side, and make your case. Then five distinct AI personalities — each built around a different mode of scrutiny — take turns finding the exact place your argument is weakest. Not generic pushback. Targeted, specific, and it gets harder the longer you survive.

We aren't building an AI that argues with you. We're building an AI system that systematically stress-tests your reasoning.

<br>
🧠 Meet Your Opponents

Five reasoning frameworks, five different ways to come after the same claim.

Character	Role	What they're hunting for
⚖️ Harvey Goodman	The Lawyer	"Is the claim precise enough to defend?" — definitions, loopholes, sloppy framing
📈 Goldeen Sachs	The Economist	"What are the consequences?" — incentives, trade-offs, costs you didn't mention
🔍 Zhang Kiyosaki	The Data Analyst	"Where is the evidence?" — unsupported claims, correlation vs. causation
🎓 Karl Friedrich	The Professor	"Does the logic hold?" — structure, internal consistency, whether the conclusion follows
🕵️ Conan Chandler	The Detective	"What's being overlooked?" — contradictions, hidden assumptions, gaps

Each one isn't a costume on the same chatbot — they're a distinct lens applied to your argument.

<br>
🔁 How a Round Works
  CHOOSE TOPIC
       │
       ▼
  TAKE A POSITION
       │
       ▼
  MAKE YOUR ARGUMENT ──────┐
       │                   │
       ▼                   │
  AI OPPONENT ATTACKS      │
       │                   │
       ▼                   │
  FACE THE SPECIALISTS     │
       │                   │
       ▼                   │
  DEFEND YOUR POSITION ────┘
       │
       ▼
  STRUCTURED EVALUATION
       │
       ▼
  SHARPER ARGUMENT

No fluff, no "great point!" filler. Every exchange is short, sharp, and aimed at whatever you just said.

<br>
🛠️ Built With

This project runs on the Google AI Studio app template, powered by:

React 19 + TypeScript — UI and app logic
Vite 6 — build tooling and dev server
Express — lightweight server layer
@google/genai — Gemini API integration for opponent reasoning, evaluation, and scoring
Firebase — backend services
Tailwind CSS 4 — styling
Framer Motion — interface animation
Lucide — icon set
<br>
🚀 Getting Started
bash
# Clone the repo
git clone https://github.com/harshap727/Debate-Rogue-like.git
cd Debate-Rogue-like

# Install dependencies
bun install    # or npm install

# Set up environment variables
cp .env.example .env
# then add your Gemini API key inside .env

# Run the dev server
bun run dev    # or npm run dev

Build for production:

bash
bun run build
bun run start
<br>
📁 Project Structure
Debate-Rogue-like/
├── src/                     # Application source
├── assets/.aistudio/        # AI Studio project assets
├── server.ts                # Express server entry point
├── firestore.rules          # Firebase security rules
├── firebase-applet-config.json
├── metadata.json
└── vite.config.ts
<br>
🎯 Why This, Not Just a Chatbot

A general-purpose AI will generate a counterargument if you ask for one. This project is structured differently on purpose:

Five distinct reasoning frameworks, not one voice in five outfits
Targets your specific weak point, not a random objection
Escalates, so surviving longer actually gets harder
Evaluates and scores, so the loop is learn → improve → repeat, not just chat

The goal isn't a better arguing partner. It's a sharper you.

<br> <div align="center">
Don't just have an opinion. Learn to defend it.
</div>
