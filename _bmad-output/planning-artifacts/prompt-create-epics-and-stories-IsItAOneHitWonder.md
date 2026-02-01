# World-Class Prompt: Create Epics and Stories (IsItAOneHitWonder)

Use this prompt in a **fresh context window** to run the BMAD Create Epics and Stories workflow for this project. Optionally load the Product Manager agent first for best results.

---

## Copy-paste prompt (start here)

**Goal:** Run the BMAD **Create Epics and Stories** workflow for the IsItAOneHitWonder project. Produce implementation-ready epics and user stories from the existing PRD, Architecture, and UX documents.

**What to do:**

1. **Load and follow the workflow exactly.**  
   Load the full workflow file:  
   `{project-root}/_bmad/bmm/workflows/3-solutioning/create-epics-and-stories/workflow.md`  
   Read its entire contents and follow its directions. Do **not** skip steps or load multiple step files at once.

2. **Use this project’s planning artifacts as inputs.**  
   The workflow will validate and use these documents (resolve `{project-root}` as the repo root, e.g. `c:\Users\daniel.judge\src\IsItAOneHitWonder`):

   - **PRD (required):** `_bmad-output/planning-artifacts/prd.md`  
     - Contains FR1–FR19, NFRs, MVP scope, user journeys, and success criteria for the “Is it a one-hit wonder?” search → verdict → share product.
   - **Architecture (required):** `_bmad-output/planning-artifacts/architecture.md`  
     - Contains ADRs for data pipeline (MediaWiki API → parse → build-time JSON), client-side search (Fuse.js or MiniSearch), deployment (GitHub Pages), Astro starter setup, URL scheme, attribution, and NFRs (performance, security, accessibility).
   - **UX Design (recommended):** `_bmad-output/planning-artifacts/ux-design-specification.md`  
     - Contains interaction patterns, mobile-first/touch targets, WCAG AA, shareable URLs, copy-one-line flow, and visual constraints (no purple/blue primary).

3. **Resolve config from:**  
   `_bmad/bmm/config.yaml`  
   Use: `project_name` (IsItAOneHitWonder), `planning_artifacts` (_bmad-output/planning-artifacts), `user_name` (DJ), `communication_language` (English). Output file for epics and stories: `_bmad-output/planning-artifacts/epics.md`.

4. **Execute step-by-step.**  
   - Start with **Step 1:** `_bmad/bmm/workflows/3-solutioning/create-epics-and-stories/steps/step-01-validate-prerequisites.md`  
     Validate PRD, Architecture, and UX exist; extract all FRs, NFRs, and additional requirements; populate the epics template; get user confirmation before continuing.  
   - Then **Step 2:** Design epics (user-value-focused, standalone, no technical-layer epics); get explicit approval.  
   - Then **Step 3:** Create stories for each epic (template structure, Given/When/Then AC, single-dev completable, no forward dependencies).  
   - Then **Step 4:** Final validation (FR coverage, architecture/starter alignment, dependency check); complete workflow.

5. **Critical rules.**  
   - One step file at a time; read each step fully before acting.  
   - At menus, halt and wait for user input; only proceed to the next step when the user selects **C (Continue)**.  
   - Update `stepsCompleted` and frontmatter in `epics.md` as you complete each step.  
   - Epics must be organized by **user value** (e.g. “Search and result experience”, “Share and copy”, “Data pipeline and deploy”), not by technical layer (e.g. “Database”, “API”, “Frontend”).  
   - If the Architecture specifies a starter (e.g. Astro init + Tailwind), Epic 1 Story 1 must be “Set up initial project from starter template.”

**Project context (for epic/story design):**  
- **Product:** Single-purpose web app: search by artist/song → Yes/No verdict + “The one hit: [Song] – [Artist]” + one-line definition and source (Wikipedia US list); share/copy one compact line including definition.  
- **Tech:** Astro static site, build-time JSON from MediaWiki API, client-side search, GitHub Pages, weekly data refresh with graceful fallback.  
- **Scope:** MVP only (no quiz, regions, or API in v1).  
- **Constraints:** No purple/blue as primary color; WCAG 2.1 AA; mobile-first; shareable result URLs (e.g. `/result/chumbawamba`).

Execute the workflow from Step 1 and work through each step in order until the final validation is complete and `_bmad-output/planning-artifacts/epics.md` is ready for development.

---

## How to run (quick reference)

| Step | Action |
|------|--------|
| **1** | Open a **new chat** (fresh context). |
| **2** | (Optional) Load PM agent: `/bmad:Asks 'WHY?' relentlessly like a detective on a case. Direct and data-sharp:agent:pm` |
| **3** | Run workflow: **`/bmad-bmm-create-epics-and-stories`**  
| **4** | Or paste the prompt above and send. |
| **5** | When the workflow shows a menu, reply with **C** to continue to the next step (or **A** / **P** for Advanced Elicitation / Party Mode). |

**Workflow:** Create Epics and Stories (CE)  
**Command:** `/bmad-bmm-create-epics-and-stories`  
**Agent:** John, Product Manager (📋)  
**Output:** `_bmad-output/planning-artifacts/epics.md`  
**Catalog:** BMM 3-solutioning, sequence 30 (after Create/Validate Architecture, before Validate Epics and Check Implementation Readiness).
