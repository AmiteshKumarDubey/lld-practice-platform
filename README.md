# LLD Practice Platform — Engineering Prototype

- **Author:** Amitesh Kumar Dubey
- **Date:** 23 September 2026
- **Status:** MVP Prototype — Assignment Submission

---

A focused, domain-driven Low-Level Design (LLD) practice and evaluation platform. This project provides learners with a structured environment to practice classic LLD problems (Parking Lot, Elevator Control System, Vending Machine State Machine, Distributed Rate Limiter), submit solutions in multiple formats (TypeScript, Java, Python, Text, PlantUML), and receive instant hybrid feedback (deterministic AST checks + LLM qualitative reasoning).

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npm test # Runs unit & integration test suite (14 tests)
npm run dev # Starts Express API server on http://localhost:5000
```

### 2. Setup & Launch Frontend (In a separate terminal)
```bash
cd frontend
npm install
npm run dev # Starts Vite dev server on http://localhost:3000
```

Open your browser to `http://localhost:3000` to interact with the practice platform.

---

## 🛠️ Tech Stack & Decisions

| Layer | Technology Choice | Engineering Rationale |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express with TypeScript | TypeScript enforces strict OOP class abstractions, interfaces, enums, and domain model encapsulation — perfectly demonstrating LLD principles (SOLID, Design Patterns). |
| **Frontend** | React (Vite + TS) | Modern functional component architecture with responsive glassmorphism dark theme, split-pane design editor, status badges, and interactive feedback cards. |
| **Evaluation Engine** | Hybrid `IEvaluator` Strategy Engine | Combines a `DeterministicChecker` (static AST/regex analysis for classes, methods, SOLID anti-patterns) with an `LLMEvaluator` (OpenAI/Claude) or `MockLLMEvaluator` fallback. |
| **Storage** | SQLite / Abstracted Repository Pattern | Monolithic data storage with zero cloud/DB container setup. Abstracted behind `IAttemptRepository` interface. |

---

## 📁 Repository Structure

```
lld-practice-platform/
├── docs/
│   ├── research-note.md      # 1–2 page research note on learner problems & existing tools
│   └── design-note.md        # MVP architecture, user flow mermaid diagram, class design
├── backend/
│   ├── src/
│   │   ├── domain/           # Core OOD domain models (Problem, Attempt, Submission, FeedbackReport)
│   │   │   ├── evaluation/   # Strategy pattern evaluation engine (DeterministicChecker, LLMEvaluator)
│   │   │   └── repositories/ # Data access abstractions (IProblemRepository, IAttemptRepository)
│   │   ├── services/         # Application services (AttemptService, ProblemService)
│   │   ├── controllers/      # REST API controllers
│   │   └── routes/           # Express endpoints (/api/problems, /api/attempts)
│   └── tests/                # Jest unit & integration tests (100% pass)
├── frontend/
│   ├── src/
│   │   ├── components/       # Header, ProblemList, DesignWorkspace, FeedbackView, History
│   │   ├── services/         # API client
│   │   └── types/            # TypeScript interfaces
├── AI_USAGE.md               # Log of 4 key AI-assisted engineering decisions
└── README.md                 # Setup & project documentation
```

---

## 🔍 Key Domain Architecture Highlights

1. **Attempt Lifecycle Machine:**  
   `IN_PROGRESS` $\rightarrow$ `SUBMITTED` $\rightarrow$ `EVALUATING` $\rightarrow$ `COMPLETED` / `EVALUATION_FAILED`.
2. **Strategy Pattern Evaluation (`IEvaluator`):**  
   Evaluators implement `IEvaluator.evaluate(submission, rubric)`. New checking rules or AI providers can be plugged in without modifying existing pipeline code (Open/Closed Principle).
3. **Resilient Offline Fallback (`MockLLMEvaluator`):**  
   If no OpenAI/Claude API key is set (`OPENAI_API_KEY`), the system seamlessly defaults to `MockLLMEvaluator`, generating realistic rubric-matched feedback offline.
4. **Retry & Failure Recovery:**  
   Supports one-click evaluation retries via `POST /api/attempts/:id/retry-evaluation`.

---

## 📋 Evaluated Problems Included

1. **Parking Lot Management System** (Medium) — Multi-floor spot assignment, vehicle types, IPricingStrategy.
2. **Elevator Control System** (Medium) — Elevator car state machine, LOOK/SCAN dispatch strategy, hall requests.
3. **Vending Machine State Machine** (Easy) — Complete IVendingState transitions, coin handling, inventory rack allocation.
4. **Distributed Rate Limiter API** (Hard) — Token bucket algorithm, sliding window log, IRateLimitStrategy.

---

## ⚠️ Known Limitations & Future Roadmap

- **Interactive UML Diagram Rendering:** Future versions could integrate interactive Mermaid JS / PlantUML live visual rendering in the browser editor.
- **AST Parsing for Java/Python:** Current AST checks use regex & syntax boundary parsers; adding language-native WASM parsers (e.g. Tree-Sitter) would expand AST depth.
- **Peer Code Review Mode:** Adding candidate social sharing for collaborative peer critiques.
