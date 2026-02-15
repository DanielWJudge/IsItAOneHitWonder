# Code Review Findings: Story 2-5 (Footer and CC BY-SA 4.0 attribution)

**Story:** 2-5-footer-and-cc-by-sa-4-0-attribution.md  
**Reviewed:** 2026-02-15  
**Reviewer:** Adversarial Senior Developer (workflow)

---

## Git vs Story Discrepancies

**Count:** 0

- Working tree was clean. Story File List (Footer.astro created, BaseLayout.astro modified) matches the implementation; no files changed in git but omitted from the story, and no story-listed files without corresponding changes.

---

## Issues Found

**High:** 0  
**Medium:** 2  
**Low:** 5  

---

## CRITICAL ISSUES

- None. All tasks marked [x] are implemented. Acceptance criteria are satisfied.

---

## MEDIUM ISSUES

### 1. DRY violation: duplicated attribution constants (maintainability)

**Where:** `src/components/Footer.astro` and `src/components/ResultBlock.astro`

**What:** The same `sourceUrl`, `licenseUrl`, and `linkClass` are defined in both components. The story Dev Notes say: *"Consider shared constants if desired"* and *"Reuse: Extract or mirror ResultBlock's sourceUrl, licenseUrl, and link styling in Footer to avoid divergence."*

**Why it matters:** If the Wikipedia URL, license URL, or link styling changes, two files must be updated in sync; easy to miss one and create inconsistent attribution or styling.

**Suggestion:** Extract to a shared module (e.g. `src/data/attribution.ts` or `src/lib/attribution.ts`) and import in both Footer and ResultBlock.

---

### 2. Story artifact: unreplaced placeholder in Dev Agent Record

**Where:** `_bmad-output/implementation-artifacts/2-5-footer-and-cc-by-sa-4-0-attribution.md` → Dev Agent Record → Agent Model Used

**What:** The field still contains `{{agent_model_name_version}}` and was never replaced with the actual model/version used for implementation.

**Why it matters:** Traceability and reproducibility are weakened; future readers cannot see which agent (or version) produced the implementation.

**Suggestion:** Replace with the real model name/version or "Manual" / "N/A" if not applicable.

---

## LOW ISSUES

### 3. BaseLayout comment omits no-match page

**Where:** `src/layouts/BaseLayout.astro` (frontmatter comment)

**What:** Comment says *"Use on index and result pages"* but the layout is also used by `result/no-match.astro`. So "result pages" is technically correct but could be clearer.

**Suggestion:** e.g. *"Use on index, result ([slug]), and no-match pages."*

---

### 4. No automated check that footer appears on all routes

**Where:** Build / test strategy

**What:** Story allows manual verification only, and footer presence was confirmed manually and via build output. There is no test or script that asserts the footer (or its links) appears on index, result, and no-match.

**Why it matters:** A future change (e.g. conditional layout or a new page that skips BaseLayout) could drop the footer without any failing check.

**Suggestion:** Optional: add a small build-time script or E2E assertion that checks for footer/attribution links on sample routes.

---

### 5. Link color contrast (WCAG AA)

**Where:** Footer and ResultBlock use `text-amber-600` for links on a light (stone/white) background.

**What:** WCAG 2.1 Level AA requires at least 4.5:1 contrast for normal text. Amber-600 on a typical light background may be close; this was not measured in the review.

**Suggestion:** Confirm contrast ratio (e.g. with dev tools or a contrast checker) and adjust to a darker amber if needed.

---

### 6. Duplication not documented in code

**Where:** `src/components/Footer.astro` (and optionally ResultBlock.astro)

**What:** The frontmatter says *"Matches ResultBlock URLs and link styling"* but does not note that the constants are duplicated or that extraction to a shared module is recommended.

**Suggestion:** Add a short comment, e.g. *"TODO: extract sourceUrl, licenseUrl, linkClass to shared module (see ResultBlock)."*

---

### 7. External attribution links: open in same tab

**Where:** Footer and ResultBlock `<a href={sourceUrl}>` and `<a href={licenseUrl}>` (no `target="_blank"`).

**What:** Links open in the same window. This is valid and often preferred for accessibility. If product or policy later requires external attribution links to open in a new tab, `target="_blank"` and `rel="noopener noreferrer"` would be needed.

**Suggestion:** Document the current decision (same-tab) in Dev Notes or architecture so future changes are intentional.

---

## Verification summary

| Check | Result |
|-------|--------|
| Footer on home (index) | Present in `dist/index.html` |
| Footer on Yes result | Present in `dist/result/[slug]/index.html` (sampled) |
| Footer on no-match | Present in `dist/result/no-match/index.html` |
| Source link URL | Correct (Wikipedia US list) |
| License link URL | Correct (CC BY-SA 4.0) |
| Link text | "Source: Wikipedia US list", "CC BY-SA 4.0" |
| Focus styling | `focus:ring-2 focus:ring-amber-500 focus:ring-offset-2` |
| Touch targets | `min-h-[44px] min-w-[44px]` on links |
| Semantic footer | `<footer aria-label="Attribution">` |
| Build | `npm run build` succeeds |

---

## Outcome

**Recommendation:** **Approve with minor follow-ups.** Acceptance criteria and tasks are met. The two MEDIUM items (shared constants, story placeholder) and the LOW items can be handled in this story or as follow-up work.
