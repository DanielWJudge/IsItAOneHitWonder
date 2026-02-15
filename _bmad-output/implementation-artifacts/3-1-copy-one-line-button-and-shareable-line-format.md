# Story 3.1: Copy one line button and shareable line format

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to copy (or share) one compact line from the result page that includes the verdict, definition reference, and when Yes the one hit,
so that I can paste or share the answer with its source in one line.

## Acceptance Criteria

1. **Given** I am on a result page (Yes or No)  
   **When** the page is displayed  
   **Then** I see a primary action to copy the shareable line (e.g. "Copy one line" button) (FR10)

2. **When** I activate the copy action (click, tap, or keyboard)  
   **Then** the system writes the shareable line to the clipboard via the Clipboard API (FR9)  
   **And** the line format is: `"{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist].}"` (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.") (FR9, Architecture ADR-8)  
   **And** for a No result, the line includes the verdict and definition reference (e.g. "No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US).")  
   **And** clear feedback is shown after copy (e.g. "Copied" for 2–3 seconds then revert) (UX)  
   **And** the copy action is keyboard-operable and has an accessible name (e.g. "Copy one line" or aria-label) (NFR-A3)  
   **And** the copy button has a minimum touch target of 44px (UX)

## Tasks / Subtasks

- [x] Task 1: Create shareable line format utility (AC: #1, #2)
  - [x] Subtask 1.1: Add `buildShareableLine(verdict, entry?)` in `src/lib/shareable-line.ts` — returns exact format per ADR-8
  - [x] Subtask 1.2: Yes format: `"Yes – {Artist} is a one-hit wonder (Wikipedia US list). The one hit: {Song}."`
  - [x] Subtask 1.3: No format: `"No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US)."`
- [x] Task 2: Create CopyButton component (AC: #1, #2)
  - [x] Subtask 2.1: Create `src/components/CopyButton.astro` with `client:load` or `client:visible` (Clipboard API requires client JS)
  - [x] Subtask 2.2: Props: `shareableLine: string` (or `verdict` + `entry?` to build internally)
  - [x] Subtask 2.3: Button label "Copy one line"; aria-label "Copy one line"; min 44px touch target
  - [x] Subtask 2.4: On click: `navigator.clipboard.writeText(shareableLine)`; show "Copied" for 2–3s then revert
  - [x] Subtask 2.5: Stone/amber palette; focus:ring-amber-500; no purple/blue (workspace rule)
- [x] Task 3: Integrate CopyButton into ResultBlock (AC: #1, #2)
  - [x] Subtask 3.1: ResultBlock receives `entry` and `verdict`; compute shareable line and pass to CopyButton
  - [x] Subtask 3.2: Place CopyButton as primary action in nav (before "Search again") — UX: "Copy one line" is primary action on result page
  - [x] Subtask 3.3: Yes result page and no-match page both show CopyButton (both have shareable lines)
- [x] Task 4: Verify accessibility and UX (AC: #2)
  - [x] Subtask 4.1: Keyboard: Tab to button, Enter/Space activates; visible focus ring
  - [x] Subtask 4.2: "Copied" feedback visible and/or aria-live for screen readers (NFR-A3, UX)
  - [x] Subtask 4.3: Touch target ≥44px; consistent with Footer/ResultBlock link styling

## Dev Notes

### Architecture Compliance

- **ADR-8 (Share/Copy):** Shareable format `"{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist]."}`; Copy button writes via Clipboard API; "Copied" feedback 2–3s. [Source: architecture.md § ADR-8]
- **ADR-6 (Accessibility):** Copy button keyboard-operable, accessible name ("Copy one line"), clear feedback visible/announced (aria-live). [Source: architecture.md § ADR-6]
- **Project structure:** `CopyButton.astro` in `src/components/`; reads shareable line from result context. [Source: architecture.md § Project Structure & Boundaries, Component boundaries]
- **Format patterns:** Architecture specifies exact Yes and No examples. [Source: architecture.md § Format Patterns]

### Technical Requirements

- **Shareable line format (ADR-8):**
  - **Yes:** `"Yes – {Artist} is a one-hit wonder (Wikipedia US list). The one hit: {Song}."` (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.")
  - **No:** `"No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US)."`
- **Clipboard API:** `navigator.clipboard.writeText(text)` — async, returns Promise. Requires secure context (HTTPS); site is on GitHub Pages HTTPS. [Source: MDN]
- **CopyButton:** Must be a client-side island (`client:load` or `client:visible`) — Clipboard API is browser API, not available at build time.
- **Feedback:** Show "Copied" for 2–3 seconds, then revert to "Copy one line". Use `aria-live="polite"` for screen reader announcement.
- **Placement:** Primary action on result page; in ResultBlock's nav, before "Search again" link.

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Astro | ^5.17.1 — CopyButton needs `client:load` or `client:visible` for Clipboard API. |
| Tailwind CSS | ^4.1.18 — Stone/amber palette; no purple/blue primary (workspace rule). |
| Clipboard API | Native browser API — no npm dependency. Supported in Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+; requires HTTPS. |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/lib/shareable-line.ts` | **Create.** Export `buildShareableLine(verdict: 'Yes' \| 'No', entry?: OneHitWonderEntry): string`. Pure function; no side effects. |
| `src/components/CopyButton.astro` | **Create.** Client island; props: `shareableLine: string`. Button with Clipboard API; "Copied" feedback. |
| `src/components/ResultBlock.astro` | **Modify.** Import `buildShareableLine`; add CopyButton in nav before "Search again"; pass shareable line. |
| `src/pages/result/[slug].astro` | **No change.** ResultBlock already receives entry + verdict; CopyButton is inside ResultBlock. |
| `src/pages/result/no-match.astro` | **No change.** Uses ResultBlock with verdict="No"; CopyButton will appear via ResultBlock. |

### Testing Requirements

- **Functional:** Yes result → Copy button → paste → exact format "Yes – {Artist} is a one-hit wonder (Wikipedia US list). The one hit: {Song}."; No result → paste → "No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US)."
- **Feedback:** After copy, button shows "Copied" for 2–3s then reverts to "Copy one line".
- **Accessibility:** Tab to Copy button; Enter/Space activates; visible focus ring (amber); aria-label present.
- **Visual:** Stone/amber palette; 44px min touch target; no purple/blue.
- **Build:** `npm run build` succeeds; CopyButton in dist output on Yes and No result pages.
- No automated unit tests required; manual verification sufficient.

### Previous Story Intelligence (Story 2.5)

- **ResultBlock.astro:** Has `entry`, `verdict` props; nav with "Search again" link; uses `ATTRIBUTION_LINK_CLASS` from `src/lib/attribution.ts`. [Source: ResultBlock.astro]
- **attribution.ts:** Shared constants for source/license URLs and link styling. Consider `shareable-line.ts` as similar shared utility. [Source: src/lib/attribution.ts]
- **Design constraint:** No purple/blue as primary. Amber for links/focus. Stone for text. [Source: workspace rule, Stories 2-1 through 2-5]
- **Touch targets:** `min-h-[44px] min-w-[44px]` used in Footer and ResultBlock links. CopyButton must match. [Source: Footer.astro, ResultBlock.astro]
- **BaseLayout:** Footer already integrated; CopyButton is in ResultBlock, not layout. [Source: 2-5-footer-and-cc-by-sa-4-0-attribution.md]

### Git Intelligence Summary

- **Recent commits:** Story 2-5 (Footer, shared attribution), Story 2-4 (no-match), Story 2-3 (ResultBlock). CopyButton is new component; shareable-line.ts is new lib module.
- **Patterns:** Components in `src/components/`; shared logic in `src/lib/`; client islands use `client:load` when interaction required.
- **Conventions:** PascalCase components; stone/amber palette; 44px touch targets; focus:ring-amber-500.

### Latest Tech Information

- **Clipboard API:** `navigator.clipboard.writeText(text)` — widely supported (Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+). Requires secure context (HTTPS). Returns Promise; handle reject for clipboard-denied. [Source: MDN, Can I use]
- **Astro client directives:** `client:load` = hydrate on page load; `client:visible` = hydrate when in viewport. CopyButton is above fold on result page — either works; `client:load` ensures button is interactive immediately.

### Project Structure Notes

- **Alignment:** Architecture specifies CopyButton.astro; shareable line format in ADR-8. Matches.
- **Reuse:** `buildShareableLine` is pure function — testable, reusable. ResultBlock and CopyButton both consume it.
- **No reinvention:** ResultBlock already has verdict, entry, definition text. Shareable line builds from same data; do not duplicate definition string — extract to shared constant if needed.

### References

- [Architecture ADR-6, ADR-8](_bmad-output/planning-artifacts/architecture.md)
- [Epic 3 Story 3.1](_bmad-output/planning-artifacts/epics.md)
- [ResultBlock.astro](src/components/ResultBlock.astro) — integration point for CopyButton
- [attribution.ts](src/lib/attribution.ts) — pattern for shared lib module
- [Story 2.5](_bmad-output/implementation-artifacts/2-5-footer-and-cc-by-sa-4-0-attribution.md) — Footer/ResultBlock patterns

## Senior Developer Review (AI)

- **Reviewer:** DJ (adversarial code review workflow)
- **Date:** 2026-02-15
- **Outcome:** Changes requested → fixes applied automatically.
- **Findings addressed:** (1) HIGH: Copy button accessible name—removed static aria-label so "Copied"/"Copy failed" are announced; added separate aria-live region for status. (2) MEDIUM: File List—added sprint-status.yaml. (3) MEDIUM: CopyButton used with client:load in ResultBlock per Subtask 2.1. (4) LOW: shareable-line fallback comment added.
- **Status after review:** done.

## Change Log

- 2026-02-15: Implemented copy one line button and shareable line format (shareable-line.ts, CopyButton.astro, ResultBlock integration)
- 2026-02-15: Code review (AI): fixed accessibility (aria-label vs status announcement), added CopyButton client:load, File List and fallback comment updates

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- **Task 1:** Created `src/lib/shareable-line.ts` with `buildShareableLine(verdict, entry?)` returning exact ADR-8 format. Yes: `"Yes – {Artist} is a one-hit wonder (Wikipedia US list). The one hit: {Song}."`; No: `"No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US)."`
- **Task 2:** Created `src/components/CopyButton.astro` with vanilla client script (Clipboard API). Button uses `shareableLine` prop, `navigator.clipboard.writeText()`, "Copied" feedback for 2.5s, aria-label, aria-live, min 44px touch target, stone/amber palette, focus:ring-amber-500.
- **Task 3:** Integrated CopyButton into ResultBlock nav before "Search again". ResultBlock computes shareable line via `buildShareableLine(verdict, entry)` and passes to CopyButton. Both Yes and No result pages show CopyButton.
- **Task 4:** Accessibility: native button supports Tab/Enter/Space; focus ring via Tailwind; aria-live="polite" for screen reader announcement; 44px touch target.
- **Build:** `npm run build` succeeds; CopyButton present in dist on Yes and No result pages.
- **Code review (AI) fixes:** CopyButton: removed static aria-label so button text ("Copy one line"/"Copied"/"Copy failed") is the accessible name; added separate sr-only aria-live region for status announcement. ResultBlock: CopyButton now used with client:load per Subtask 2.1. shareable-line.ts: documented fallback line. File List: added sprint-status.yaml.

### File List

- `src/lib/shareable-line.ts` (created)
- `src/components/CopyButton.astro` (created)
- `src/components/ResultBlock.astro` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
