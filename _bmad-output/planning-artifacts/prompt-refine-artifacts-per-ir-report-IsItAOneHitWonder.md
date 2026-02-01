# World-Class Prompt: Refine Planning Artifacts per Implementation Readiness Report (IsItAOneHitWonder)

Use this prompt in a **fresh context window** to address the four minor findings from the Check Implementation Readiness workflow. These refinements improve clarity before Phase 4 (implementation) without re-running full planning workflows.

---

## Copy-paste prompt (start here)

**Goal:** Refine the IsItAOneHitWonder planning artifacts to address the four minor findings from the Implementation Readiness Report (2026-02-01). Update `epics.md` and `ux-design-specification.md` with targeted edits—no re-creation of documents.

**What to do:**

1. **Load the source documents.**
   Resolve `{project-root}` as `c:\Users\daniel.judge\src\IsItAOneHitWonder`. Read:

   - **IR Report (authoritative source):** `_bmad-output/planning-artifacts/implementation-readiness-report-2026-02-01.md`
     - Sections: Step 5 Epic Quality Review (minor concerns), Summary and Recommended Next Steps
   - **Epics:** `_bmad-output/planning-artifacts/epics.md`
   - **UX Design:** `_bmad-output/planning-artifacts/ux-design-specification.md`
   - **UX Design Directions (for lock-in):** `_bmad-output/planning-artifacts/ux-design-directions.html`

2. **Apply the four refinements below.** Make surgical edits only; preserve all other content.

---

### Refinement 1: Epic 2 story implementation order (epics.md)

**Finding:** Story 2.2 AC states no-match is "handled in Story 2.4," creating a forward dependency. Implementers need a clear order.

**Action:** Add an explicit implementation order note in Epic 2. In the Epic 2 section (Search and result experience), add a short subsection **"Implementation order"** after the epic goal, before the stories:

```markdown
**Implementation order:** Implement Stories 2.1 → 2.3 (Yes result) → 2.4 (no-match view) → 2.2 (search + routing to both) → 2.5. Story 2.4 delivers the no-match view to which Story 2.2 navigates when there is no match or no confident match.
```

If Epic 2 already has a similar note, strengthen it to include this explicit sequence. Ensure Story 2.2 and 2.4 ACs reference this order where relevant.

---

### Refinement 2: FR19 browser support policy (epics.md)

**Finding:** FR19 is cross-cutting; no single story owns "defined browser support policy" or "graceful degradation when JS disabled." Minor risk of omission.

**Action:** Add one sentence to **Epic 2 intro** or **Story 2.1** acceptance criteria stating that the implementation follows a defined browser support policy. Example:

```markdown
Browser support: Last 2 versions of Chrome, Firefox, Safari, and Edge (per FR19). No IE11.
```

Place this in the Epic 2 overview or as an additional AC in Story 2.1. Do not create a new story.

---

### Refinement 3: JS-off behavior (epics.md and/or ux-design-specification.md)

**Finding:** PRD states optional "graceful degradation or message when JS disabled." UX and architecture mention "optional JS-off fallback" but no concrete decision is documented.

**Action:** Make a decision and document it in one place.

- **Option A – Implement minimal fallback:** Add a short AC or note to Story 2.1 or Epic 2: "When JavaScript is disabled: home page shows a brief message (e.g. 'Enable JavaScript to search'); direct links to `/result/[slug]` render static content from the prebuilt page." Add the same to UX Design Specification under Platform Strategy or Technical Constraints.
- **Option B – Defer for MVP:** Add a note: "JS-off fallback is deferred for MVP; no explicit message or static fallback. Revisit post-launch if needed."
- **Option C – User chooses:** If you (the user) have not decided, add a placeholder: "**Decision needed:** JS-off behavior: implement minimal fallback (message + static result pages) or defer for MVP. Product owner to confirm before or during Epic 2 implementation."

Default to **Option B (defer)** unless you have a strong preference; the IR report says optional.

---

### Refinement 4: Design direction lock (ux-design-specification.md)

**Finding:** UX recommends Direction 1 (Minimal neutral) or 2 (Warm accent) from `ux-design-directions.html`; "lock in after stakeholder review." Implementation should use one chosen direction for tokens.

**Action:** Add a **"Design direction (locked)"** subsection to `ux-design-specification.md`, e.g. under Visual Design or Technical Constraints:

```markdown
### Design direction (locked)

**Direction 1 – Minimal neutral** (or **Direction 2 – Warm accent**—choose one) from `ux-design-directions.html` is the locked direction for Tailwind tokens and component styling. Use this direction consistently across all components.
```

If you (the user) have not chosen yet, add: "**Stakeholder decision needed:** Lock Direction 1 (Minimal neutral) or Direction 2 (Warm accent) before visual implementation." Product owner should confirm before developers apply Tailwind tokens.

---

3. **Output and validation.**

   - Save all edits to `epics.md` and `ux-design-specification.md`.
   - Do **not** change PRD, architecture, or IR report.
   - If you cannot make a decision for Refinement 3 or 4, add the placeholder text and note "Product owner to confirm" so it is visible during implementation.

4. **Summary.**

   After edits, output a brief summary: which refinements were applied, which have placeholders (if any), and whether the artifacts are ready for Sprint Planning.

---

## How to run (quick reference)

| Step | Action |
|------|--------|
| **1** | Open a **new chat** (fresh context). |
| **2** | Paste the prompt above (from "**Goal:**" through Refinement 4) and send. |
| **3** | Review the edits; if Refinement 3 or 4 has a placeholder, make the product decision and ask the agent to update the placeholder with the final choice. |
| **4** | Proceed to Sprint Planning (`/bmad-bmm-sprint-planning`) when satisfied. |

**Workflow:** Refine Planning Artifacts (ad hoc, post–Check Implementation Readiness)  
**Input:** `implementation-readiness-report-2026-02-01.md`, `epics.md`, `ux-design-specification.md`  
**Output:** Updated `epics.md`, `ux-design-specification.md`  
**Gate:** Addresses minor IR findings before Phase 4.

---

## BMAD workflow relationship

This prompt sits **between** Check Implementation Readiness (IR, sequence 70) and Sprint Planning (SP, sequence 10 of Phase 4). It is an **ad hoc refinement task**, not a formal BMAD workflow. Use it when:

- IR report status is **READY** but minor findings exist.
- You want to tighten epics/UX before implementation.
- You prefer targeted edits over re-running Create Epics and Stories or Correct Course.

**Alternative:** You may proceed to Sprint Planning without running this prompt—the IR report states the project is **READY**. This refinement reduces the chance of small gaps (no-match routing, browser support, design tokens) during build.
