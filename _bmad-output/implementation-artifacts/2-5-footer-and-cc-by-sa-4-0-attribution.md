# Story 2.5: Footer and CC BY-SA 4.0 attribution

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see the data source and CC BY-SA 4.0 license (source link and license link) on the site,
so that I can verify attribution and reuse terms.

## Acceptance Criteria

1. **Given** I am on any page (home or result)  
   **When** I view the footer (or dedicated attribution area)  
   **Then** I see a link to the Wikipedia US one-hit wonder list (source) and a link to the CC BY-SA 4.0 license (FR12)  
   **And** the links have descriptive text (e.g. "Source: Wikipedia US list", "CC BY-SA 4.0") and are keyboard-operable with visible focus (NFR-A4, UX)

## Tasks / Subtasks

- [x] Task 1: Create Footer component (AC: #1)
  - [x] Subtask 1.1: Create `src/components/Footer.astro` with source link and CC BY-SA 4.0 license link
  - [x] Subtask 1.2: Use same URLs and link text as ResultBlock (source: Wikipedia US list; license: CC BY-SA 4.0)
  - [x] Subtask 1.3: Apply stone/amber palette; 44px min touch targets; focus:ring-amber-500 (workspace rule, NFR-A2)
- [x] Task 2: Integrate Footer into all pages (AC: #1)
  - [x] Subtask 2.1: Add Footer to BaseLayout (or include Footer in index.astro, result/[slug].astro, result/no-match.astro)
  - [x] Subtask 2.2: Footer visible on home, Yes result, and no-match pages
  - [x] Subtask 2.3: Footer uses semantic `<footer>` element with appropriate landmarks
- [x] Task 3: Verify accessibility and UX (AC: #1)
  - [x] Subtask 3.1: Links keyboard-operable; visible focus indicators (NFR-A2)
  - [x] Subtask 3.2: Descriptive link text; no purple/blue primary (workspace rule)
  - [x] Subtask 3.3: Touch targets ≥44px; consistent with ResultBlock link styling

## Dev Notes

### Architecture Compliance

- **ADR-4 (Attribution):** Source link + CC BY-SA 4.0 license link in result block **and in footer** on all pages. [Source: architecture.md § ADR-4]
- **ADR-6 (Accessibility):** Links keyboard-operable, visible focus indicators, accessible names. [Source: architecture.md § ADR-6]
- **Project structure:** Architecture specifies `Footer.astro` in `src/components/`. [Source: architecture.md § Project Structure & Boundaries]
- **Component boundaries:** Footer = Source link + license link (and optional "How we define it"); site-wide. [Source: architecture.md § Component boundaries]

### Technical Requirements

- **Source URL:** `https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States`
- **License URL:** `https://creativecommons.org/licenses/by-sa/4.0/`
- **Link text:** "Source: Wikipedia US list" and "CC BY-SA 4.0" (match ResultBlock for consistency)
- **Placement:** Footer at bottom of every page (home, Yes result, no-match)
- **Integration:** Add Footer to BaseLayout so it appears on all pages without duplicating markup in each page

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Astro | ^5.17.1 — Footer is static Astro component; no client script. |
| Tailwind CSS | ^4.1.18 — Stone/amber palette; no purple/blue primary (workspace rule). |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/components/Footer.astro` | **Create.** New component: source link + license link; semantic `<footer>`; same URLs and styling as ResultBlock. |
| `src/layouts/BaseLayout.astro` | **Modify.** Add Footer inside `<body>` after `<slot />` so it appears on all pages. |
| `src/components/ResultBlock.astro` | **No change.** ResultBlock already has source + license in result block; footer is ADDITIONAL site-wide attribution per ADR-4. |

### Testing Requirements

- **Functional:** Home, Yes result, no-match — footer visible with both links; links open correct URLs.
- **Accessibility:** Tab to links; visible focus ring (amber); keyboard Enter activates links.
- **Visual:** Stone/amber palette; no purple/blue; touch targets ≥44px; consistent with ResultBlock.
- **Build:** `npm run build` succeeds; footer in dist output on all pages.
- No automated unit tests required; manual verification sufficient.

### Previous Story Intelligence (Story 2.4)

- **ResultBlock.astro:** Uses `sourceUrl` and `licenseUrl` constants; `linkClass` with `text-amber-600`, `focus:ring-amber-500`, `min-h-[44px] min-w-[44px]`, `whitespace-nowrap`. [Source: ResultBlock.astro]
- **BaseLayout.astro:** Has `<slot />` for page content; no footer yet. Add Footer after slot. [Source: BaseLayout.astro]
- **Design constraint:** No purple/blue as primary. Amber for links/focus. Stone for text. [Source: workspace rule, Stories 2-1 through 2-4]
- **Reuse:** Extract or mirror ResultBlock's `sourceUrl`, `licenseUrl`, and link styling in Footer to avoid divergence. Consider shared constants if desired.

### Git Intelligence Summary

- **Recent commits:** Story 2-4 (no-match verification), Story 2-3 (ResultBlock, result page), Story 2-2 (SearchForm, no-match), Story 2-1 (SearchForm).
- **Patterns:** ResultBlock defines source/license URLs and link styling; Footer should match. BaseLayout wraps all pages; single integration point for Footer.

### Latest Tech Information

- **CC BY-SA 4.0 URL:** `https://creativecommons.org/licenses/by-sa/4.0/` — canonical, stable. [Source: Creative Commons]
- **Astro layouts:** Footer in BaseLayout ensures single source; no per-page duplication.

### Project Structure Notes

- **Alignment:** Architecture specifies Footer.astro; BaseLayout is the logical place to include it site-wide.
- **Reuse:** Do NOT duplicate ResultBlock's definition/source markup in Footer. Footer is attribution links only (source + license). ResultBlock has definition + source in result context; Footer has source + license for site-wide compliance.

### References

- [Architecture ADR-4, ADR-6](_bmad-output/planning-artifacts/architecture.md)
- [Epic 2 Story 2.5](_bmad-output/planning-artifacts/epics.md)
- [ResultBlock.astro](src/components/ResultBlock.astro) — source/license URLs and link styling to match
- [BaseLayout.astro](src/layouts/BaseLayout.astro) — integration point for Footer
- [Story 2.4](_bmad-output/implementation-artifacts/2-4-no-match-result-state.md) — ResultBlock patterns

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Created Footer.astro with source and CC BY-SA 4.0 license links; stone/amber palette; 44px touch targets; focus:ring-amber-500.
- Integrated Footer into BaseLayout so it appears on home, Yes result, and no-match pages.
- Build verified; footer in dist output on all pages.

### File List

- src/components/Footer.astro (created)
- src/layouts/BaseLayout.astro (modified)

### Change Log

- 2026-02-15: Footer component created; integrated into BaseLayout for site-wide CC BY-SA 4.0 attribution.
