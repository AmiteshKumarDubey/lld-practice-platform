# AI Usage & Collaborative Engineering Decisions

- **Author:** Amitesh Kumar Dubey
- **Date:** 23 September 2026
- **Status:** MVP Prototype — Assignment Submission

---

This document outlines **4 key architectural and design decisions** made during the development of the **LLD Practice Platform**, highlighting what the AI suggested, what was accepted or rejected, and the engineering rationale behind each decision.

## Decision 1: Hybrid Evaluation Engine vs. Pure LLM Evaluation

- **AI Suggestion:**  
  Initially, the AI suggested routing 100% of submission evaluation directly to an LLM (OpenAI / Claude) via a single prompt that would return both structural analysis (class presence, SOLID checks) and qualitative critiques in one JSON response.

- **My Decision:** **Rejected Pure LLM — Adopted Hybrid Strategy Pattern (`DeterministicChecker` + `LLMEvaluator`)**

- **Why / Rationale:**  
  Pure LLM evaluations are non-deterministic, potentially slow (3–10 seconds), and can hallucinate structural missing methods. By building a local `DeterministicChecker` using AST/regex parsing for structural rules, the system gets instant, 100% reliable feedback for structural elements (e.g. checking whether `VehicleType` enum or `ParkingLot` class exists) and only relies on the LLM for subjective design reasoning.

---

## Decision 2: Monolithic In-Memory/SQLite Architecture vs. Queue-Based Microservice

- **AI Suggestion:**  
  The AI recommended setting up a background worker queue using Redis and BullMQ to decouple submission HTTP requests from long-running evaluation tasks.

- **My Decision:** **Rejected Redis/Queue — Accepted Monolithic Async Pipeline with Polling**

- **Why / Rationale:**  
  The assignment PDF explicitly cautions against over-engineering HLD infrastructure ("This is primarily an LLD/domain-design exercise. Do not spend the majority of your time on Kubernetes, microservices..."). An in-memory asynchronous execution loop backed by SQLite state polling delivers a clean, zero-dependency developer experience that runs instantly with `npm start`.

---

## Decision 3: Resilient LLM Fallback (`MockLLMEvaluator`)

- **AI Suggestion:**  
  The AI suggested throwing an HTTP 500 error or `EVALUATION_FAILED` state whenever an OpenAI / Claude API key is missing or an HTTP network request to the LLM provider fails.

- **My Decision:** **Accepted Strategy Fallback to `MockLLMEvaluator`**

- **Why / Rationale:**  
  A platform submitted for grading or evaluation by third parties must work seamlessly out-of-the-box without requiring the evaluator to supply paid API credentials. Implementing a domain-aware `MockLLMEvaluator` under the `IEvaluator` interface allows the system to generate realistic, rubric-matched design critiques offline while seamlessly using real LLM calls when an API key is present.

---

## Decision 4: Multi-Format Submission Model (Code, Text, Diagram)

- **AI Suggestion:**  
  The AI proposed restricting submissions exclusively to executable Java code files so that static analysis could use standard Java AST parsers.

- **My Decision:** **Expanded to Multi-Format (`CODE_TS`, `CODE_JAVA`, `CODE_PYTHON`, `TEXT`, `DIAGRAM_PLANTUML`)**

- **Why / Rationale:**  
  Real-world LLD interviews often involve candidates explaining designs in pseudo-code, TypeScript, Python, or PlantUML class diagrams. Designing the `Submission` domain model to handle multiple formats makes the platform significantly more realistic and extensible for learners.

---

## Personalization & Candidate QA & Debugging Notes

- **Testing & Debugging Rigor:** During manual QA, discovered and directed fixes for three real bugs the AI's initial implementation missed:
  1. *Starter code template resolution bug:* Starter code templates weren't problem-aware across language tab switches (Elevator problem showed Parking Lot code), causing false 0% structure scores on non-Parking-Lot problems.
  2. *Duplicated wording bug:* A string-templating bug in mock feedback text produced redundant phrases like "State Pattern pattern" or "Strategy Pattern pattern".
  3. *Hardcoded scoring bug:* The initial mock qualitative evaluator returned a static 75% score regardless of submission length or quality.
  Verified each fix by resubmitting varied-quality code across all 5 problems $\times$ 5 formats (25 combinations) and confirming dynamic, differentiated scores.
- **Learner Practice Loop Focus:** Kept the domain model strictly focused on `Problem`, `Attempt`, `Submission`, and `FeedbackReport`.
- **SOLID Verification:** Verified that `EvaluationPipeline` follows Open/Closed Principle (OCP) — new evaluators can be added without modifying existing pipeline code.
