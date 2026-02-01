# World-Class Prompt: Sprint Planning (IsItAOneHitWonder)

Use this prompt in a **fresh context window** to generate the sprint status file that kicks off Phase 4 (implementation). The output is the single source of truth for epic and story status that implementation agents (Create Story, Dev Story, Code Review) will follow.

---

## Copy-paste prompt (start here)

**Goal:** Produce the IsItAOneHitWonder sprint plan by parsing all epics and stories from `epics.md`, building a complete `sprint-status.yaml`, and writing it to the implementation artifacts folder. This is the BMAD Sprint Planning workflow (SP, sequence 10 of Phase 4).

**What to do:**

1. **Resolve paths.**
   - `{project-root}` = `c:\Users\daniel.judge\src\IsItAOneHitWonder`
   - **Epics (input):** `_bmad-output/planning-artifacts/epics.md`
   - **Sprint status (output):** `_bmad-output/implementation-artifacts/sprint-status.yaml`
   - **Story location (for future story files):** `_bmad-output/implementation-artifacts` (or subfolder `stories/` if you use one)

2. **Load and parse epics.**
   - Read the full `epics.md` from the path above.
   - Identify every **Epic** (e.g. `## Epic 1:`, `## Epic 2:`) and every **Story** (e.g. `### Story 1.1: Title`, `### Story 2.3: Title`).
   - **Story key conversion:** From `Story E.S: Title` produce key `E-S-title-in-kebab-case`.
     - Example: `Story 2.1: Set up initial project` → `2-1-set-up-initial-project`
     - Example: `Story 2.4: No-match view` → `2-4-no-match-view`

3. **Build the sprint status structure.**
   For each epic, in order, add to `development_status`:
   - One line: `epic-{N}: backlog`
   - For each story in that epic: `{E-S-kebab-title}: backlog`
   - One line: `epic-{N}-retrospective: optional`
   Then repeat for the next epic.

4. **Optional: Intelligent status detection.**
   - If `_bmad-output/implementation-artifacts/sprint-status.yaml` already exists, load it and **preserve** any status that is more advanced than `backlog` (never downgrade).
   - If the folder contains story files like `{story-key}.md` (e.g. `2-1-set-up-initial-project.md`), set that story’s status to at least `ready-for-dev` unless the existing file already has a higher status.

5. **Write the sprint status file.**
   - Create the directory `_bmad-output/implementation-artifacts` if it does not exist.
   - Write `sprint-status.yaml` with this structure (use today’s date and project name):

```yaml
# generated: YYYY-MM-DD
# project: IsItAOneHitWonder
# project_key: NOKEY
# tracking_system: file-system
# story_location: "{project-root}/_bmad-output/implementation-artifacts"

# STATUS DEFINITIONS:
# Epic: backlog | in-progress | done
# Story: backlog | ready-for-dev | in-progress | review | done
# Retrospective: optional | done

generated: YYYY-MM-DD
project: IsItAOneHitWonder
project_key: NOKEY
tracking_system: file-system
story_location: "c:\\Users\\daniel.judge\\src\\IsItAOneHitWonder\\_bmad-output\\implementation-artifacts"

development_status:
  epic-1: backlog
  # ... all stories for Epic 1 in order ...
  epic-1-retrospective: optional

  epic-2: backlog
  # ... all stories for Epic 2 in order ...
  epic-2-retrospective: optional

  epic-3: backlog
  # ... all stories for Epic 3 in order ...
  epic-3-retrospective: optional
```

6. **Validate.**
   - Every epic in `epics.md` appears in `development_status`.
   - Every story in `epics.md` appears in `development_status`.
   - Every epic has an `epic-{N}-retrospective` entry.
   - No extra items that don’t exist in `epics.md`.
   - All status values are legal: epic (`backlog`|`in-progress`|`done`), story (`backlog`|`ready-for-dev`|`in-progress`|`review`|`done`), retrospective (`optional`|`done`).

7. **Summary.**
   After writing the file, output a short summary:
   - **File written:** `_bmad-output/implementation-artifacts/sprint-status.yaml`
   - **Total epics:** N
   - **Total stories:** N
   - **Next steps:** Run Create Story (`/bmad-bmm-create-story`) to prepare the first story for development, or use Dev Story (`/bmad-bmm-dev-story`) when a story is ready.

---

## How to run (quick reference)

| Step | Action |
|------|--------|
| **1** | Open a **new chat** (fresh context). |
| **2** | Paste the prompt above (from "**Goal:**" through step 7) and send. |
| **3** | Confirm `sprint-status.yaml` was created and totals match your epics/stories. |
| **4** | Proceed to **Create Story** for the first story in the plan, then **Dev Story** and **Code Review** as per the BMAD implementation cycle. |

**Workflow:** Sprint Planning (BMAD Phase 4, sequence 10)  
**Input:** `epics.md`  
**Output:** `_bmad-output/implementation-artifacts/sprint-status.yaml`  
**Agent (if using BMAD agent):** Bob (Scrum Master), command `/bmad-bmm-sprint-planning`

---

## BMAD workflow relationship

- **Prerequisites:** Check Implementation Readiness (IR) should be **READY**. Optional: run the [Refine Planning Artifacts](prompt-refine-artifacts-per-ir-report-IsItAOneHitWonder.md) prompt to address minor IR findings first.
- **After this:** Use the generated `sprint-status.yaml` with **Create Story** → **Validate Story** → **Dev Story** → **Code Review** in sequence; optionally **Sprint Status** to summarize progress, **Retrospective** at epic end.
- **Alternative:** You can run the formal workflow via `/bmad-bmm-sprint-planning` (loads `workflow.xml` and `sprint-planning/workflow.yaml`); this prompt is a self-contained, doc-based equivalent for a fresh context.

---

## Status state machine (reference)

- **Epic:** `backlog` → `in-progress` → `done`
- **Story:** `backlog` → `ready-for-dev` → `in-progress` → `review` → `done`
- **Retrospective:** `optional` ↔ `done`

Epic moves to `in-progress` when the first story is created (Create Story). Stories typically flow one-by-one through Create Story → Dev Story → Code Review → `done` before the next story is created.
