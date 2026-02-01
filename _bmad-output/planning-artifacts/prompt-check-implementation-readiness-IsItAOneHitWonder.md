# World-Class Prompt: Check Implementation Readiness (IsItAOneHitWonder)

Use this prompt in a **fresh context window** to run the BMAD Check Implementation Readiness workflow for this project. Use the Architect agent for best results—this workflow uses an adversarial review approach to find gaps before implementation.

---

## Copy-paste prompt (start here)

**Goal:** Run the BMAD **Check Implementation Readiness** workflow for the IsItAOneHitWonder project. Validate that PRD, Architecture, Epics, and UX are complete, aligned, and ready for Phase 4 implementation—with a focus on ensuring epics and stories are logical and have accounted for all requirements and planning.

**What to do:**

1. **Load and follow the workflow exactly.**
   Load the full workflow file:
   `{project-root}/_bmad/bmm/workflows/3-solutioning/check-implementation-readiness/workflow.md`
   Read its entire contents and follow its directions. Do **not** skip steps or load multiple step files at once. The first step is in the `steps/` subfolder: `./steps/step-01-document-discovery.md`.

2. **Use this project's planning artifacts as inputs.**
   The workflow will discover, inventory, and validate these documents (resolve `{project-root}` as the repo root, e.g. `c:\Users\daniel.judge\src\IsItAOneHitWonder`):

   - **PRD (required):** `_bmad-output/planning-artifacts/prd.md`
     - Contains FR1–FR19, NFRs (P1–P3, S1–S2, A1–A4, I1–I2), MVP scope, user journeys, and success criteria for the "Is it a one-hit wonder?" search → verdict → share product.
   - **Architecture (required):** `_bmad-output/planning-artifacts/architecture.md`
     - Contains 8 ADRs: data pipeline (MediaWiki API → parse → JSON), client-side search (Fuse.js/MiniSearch), deployment (GitHub Pages), attribution, URLs/SEO, accessibility, error handling, share/copy. Includes project structure, implementation patterns, and requirements-to-structure mapping.
   - **Epics (required):** `_bmad-output/planning-artifacts/epics.md`
     - Contains 3 epics: Epic 1 (Data pipeline and deploy), Epic 2 (Search and result experience), Epic 3 (Share and copy). FR coverage map; stories with Given/When/Then acceptance criteria.
   - **UX Design (required):** `_bmad-output/planning-artifacts/ux-design-specification.md`
     - Contains interaction patterns, mobile-first/touch targets (≥44px), WCAG AA, shareable URLs, copy-one-line flow, and visual constraints (no purple/blue primary).
   - **PRD Validation Report (context):** `_bmad-output/planning-artifacts/prd-IsItAOneHitWonder-2026-02-01-validation-report.md`
     - PRD passed validation (holistic 4/5); minor actionable findings (FR4, FR17 wording). Use as context for PRD quality baseline.

3. **Resolve config from:**
   `_bmad/bmm/config.yaml`
   Use: `project_name` (IsItAOneHitWonder), `planning_artifacts` (_bmad-output/planning-artifacts), `user_name` (DJ), `communication_language` (English). Output file: `_bmad-output/planning-artifacts/implementation-readiness-report-{{date}}.md` (e.g. `implementation-readiness-report-2026-02-01.md`).

4. **Execute step-by-step.**
   - **Step 1:** Document Discovery — Search for PRD, Architecture, Epics, UX; group sharded files; flag duplicates; get user confirmation.
   - **Step 2:** PRD Analysis — Read PRD completely; extract ALL FRs and NFRs; document findings in report.
   - **Step 3:** Epic Coverage Validation — Map epics to FRs; build coverage matrix; identify any FRs NOT covered in epics.
   - **Step 4:** UX Alignment — Validate UX aligns with PRD and Architecture; check for missing UX requirements in architecture.
   - **Step 5:** Epic Quality Review — Validate epics against create-epics-and-stories best practices: user value focus, epic independence, no forward dependencies, proper story sizing and AC structure. Architecture specifies Astro starter → Epic 1 Story 1 must be "Set up initial project from starter template."
   - **Step 6:** Final Assessment — Compile summary, critical issues, recommended next steps; set overall readiness status (READY / NEEDS WORK / NOT READY).

5. **Critical rules.**
   - One step file at a time; read each step fully before acting.
   - At menus (Step 1), halt and wait for user input; only proceed when the user selects **C (Continue)**. Steps 2–5 auto-proceed; Step 6 completes the workflow.
   - You are an expert Product Manager and Scrum Master focused on requirements traceability and spotting gaps—success is measured in finding planning failures others missed.
   - Adversarial mindset: challenge epics that are technical milestones, forward dependencies, vague acceptance criteria, or missing FR coverage.

**Project context (for validation):**

- **Product:** Single-purpose web app: search by artist/song → Yes/No verdict + "The one hit: [Song] – [Artist]" + one-line definition and source (Wikipedia US list); share/copy one compact line including definition.
- **Tech:** Astro static site, build-time JSON from MediaWiki API, client-side search (Fuse.js or MiniSearch), GitHub Pages, weekly data refresh with `continue-on-error` on fetch.
- **FRs:** 19 functional (search, result presentation, share/copy, attribution, graceful degradation, data pipeline, access). All 19 are mapped to epics in epics.md.
- **Epic structure:** Epic 1 (5 stories: starter, fetch, wire JSON, CI, HTTPS) → Epic 2 (5 stories: home page, search, result page, no-match, footer) → Epic 3 (1 story: copy button).
- **Constraints:** No purple/blue primary; WCAG 2.1 AA; mobile-first; shareable URLs `/result/[slug]`.

Execute the workflow from Step 1 and work through all six steps until the implementation readiness report is complete and you can recommend whether to proceed to Phase 4 (implementation) or address gaps first.

---

## How to run (quick reference)

| Step | Action |
|------|--------|
| **1** | Open a **new chat** (fresh context). |
| **2** | (Recommended) Load Architect agent: `/bmad:Balancing 'what could be' with 'what should be':agent:architect` |
| **3** | Run workflow: **`/bmad-bmm-check-implementation-readiness`** |
| **4** | Or paste the prompt above and send. |
| **5** | When Step 1 shows a menu, reply with **C** to continue to Step 2. |
| **6** | Steps 2–6 run sequentially; review the final report at `_bmad-output/planning-artifacts/implementation-readiness-report-YYYY-MM-DD.md`. |

**Workflow:** Check Implementation Readiness (IR)  
**Command:** `/bmad-bmm-check-implementation-readiness`  
**Agent:** Winston, Architect (🏗️)  
**Output:** `_bmad-output/planning-artifacts/implementation-readiness-report-{{date}}.md`  
**Catalog:** BMM 3-solutioning, sequence 70 (after Create Epics and Stories; gate before Phase 4 implementation).

**Tip:** For validation workflows, BMAD recommends using a different high-quality LLM if available to catch gaps your primary model might overlook.
