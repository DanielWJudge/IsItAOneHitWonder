# Story 2.4: No-match result state

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see a clear "No" or "Not on our list" outcome with the same definition and source visible when my search does not match,
so that I understand the result is "not on this list" rather than an error.

*This view is the destination when Story 2.2's search finds no match; implement before Story 2.2 per Epic 2 implementation order.*

## Acceptance Criteria

1. **Given** I have submitted a search that has no match (or no confident match)  
   **When** the no-match result is shown  
   **Then** I see a verdict of "No" or "Not on our list" (FR13)  
   **And** I see the same one-line definition and source as on a "Yes" result (FR13)  
   **And** there is no "one hit" line (only for Yes results)  
   **And** the tone is neutral and informative, not an error message (UX)

## Tasks / Subtasks

- [x] Task 1: Verify no-match page meets all AC (AC: #1)
  - [x] Subtask 1.1: Confirm `src/pages/result/no-match.astro` exists and uses ResultBlock with `verdict="No"`
  - [x] Subtask 1.2: Verify verdict "No" and "Not on our list" text; same definition and source as Yes result; no one-hit line
  - [x] Subtask 1.3: Confirm neutral tone (no error styling, no "Sorry" or error icon)
- [x] Task 2: Verify SEO and accessibility (AC: #1)
  - [x] Subtask 2.1: BaseLayout `title` and `description` set for no-match (e.g. "Not on our list")
  - [x] Subtask 2.2: Heading structure and landmarks (h1, h2, section aria-labelledby) for screen readers (NFR-A4)
  - [x] Subtask 2.3: Touch targets ≥44px; keyboard-operable; visible focus indicators (NFR-A2, UX)
- [x] Task 3: Verify SearchForm navigation and integration (AC: #1)
  - [x] Subtask 3.1: SearchForm navigates to `/result/no-match` when no match (or low-confidence match)
  - [x] Subtask 3.2: "Search again" link present and functional
  - [x] Subtask 3.3: Direct URL `/result/no-match` renders correctly (static page)

## Dev Notes

### Architecture Compliance

- **ADR-4 (Attribution):** One-line definition and source on every result view. Source link + CC BY-SA 4.0 link in result block. [Source: architecture.md § ADR-4]
- **ADR-5 (URLs & SEO):** Result pages at `/result/[slug]`; no-match at `/result/no-match`. Descriptive title and meta. [Source: architecture.md § ADR-5]
- **ADR-6 (Accessibility):** Heading structure and landmarks; touch targets ≥44px; visible focus indicators. [Source: architecture.md § ADR-6]
- **ADR-7 (No match):** Verdict "No" or "Not on our list"; same definition and source as Yes; no "one hit" line; neutral tone. [Source: architecture.md § ADR-7]
- **Project structure:** ResultBlock displays verdict, definition, source; no-match uses ResultBlock with verdict="No". [Source: architecture.md § Component boundaries]

### Technical Requirements

- **Route:** `/result/no-match` — static page at `src/pages/result/no-match.astro`
- **Component:** Use `ResultBlock` with `verdict="No"` (no `entry` prop). ResultBlock already supports this; shows "No", "Not on our list.", definition, source, Search again link.
- **Definition text:** "We use the Wikipedia US one-hit wonder list: one top-40 hit in the US." (must match Yes result page)
- **Source URL:** `https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States`
- **License URL:** `https://creativecommons.org/licenses/by-sa/4.0/`
- **BaseLayout:** `title="Not on our list"`, `description="Search did not find a match on the Wikipedia US one-hit wonder list."`
- **Tone:** Neutral, informative. No red/error colors, no "Sorry" or error icon. Stone/amber palette per workspace rule.

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Astro | ^5.17.1 — no-match.astro is static; ResultBlock is Astro component. No client script needed. |
| Tailwind CSS | ^4.1.18 — Stone/amber palette; no purple/blue primary (workspace rule). |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/pages/result/no-match.astro` | **Verify/Modify.** Static page; BaseLayout + ResultBlock verdict="No". May already exist from Story 2.2/2.3. |
| `src/components/ResultBlock.astro` | **No change.** Already supports verdict="No", optional entry, definition, source, Search again. |

### Testing Requirements

- **Functional:** Navigate to `/result/no-match` directly → see "No", "Not on our list.", definition, source links, Search again.
- **Search flow:** Enter "xyznonexistent" on home → navigate to no-match view.
- **Parity:** Definition and source text identical to Yes result page (ResultBlock ensures this).
- **Accessibility:** Heading hierarchy; landmarks; keyboard nav; focus indicators; touch targets ≥44px.
- **Visual:** Stone/amber palette; no error styling; neutral tone.
- **Build:** `npm run build` succeeds; no-match page in dist.
- No automated unit tests required; manual verification sufficient.

### Previous Story Intelligence (Story 2.3)

- **ResultBlock.astro:** Supports `verdict="Yes" | "No"` and optional `entry`. When verdict="No", shows "No", "Not on our list.", definition, source; no one-hit line. [Source: ResultBlock.astro]
- **no-match.astro:** Refactored in Story 2.3 code review to use ResultBlock for consistency. Uses BaseLayout with title/description. [Source: 2-3-result-page-with-verdict-one-hit-definition-and-source.md]
- **SearchForm.astro:** Navigates to `base + 'result/no-match'` when Fuse.js returns no match or low-confidence match. [Source: SearchForm.astro]
- **Design constraint:** No purple/blue as primary. Amber for links/focus. Stone for text. [Source: workspace rule, 2-1, 2-2, 2-3]

### Git Intelligence Summary

- **Recent commits:** Story 2-3 (ResultBlock, result page, no-match refactor), Story 2-2 (Fuse.js search, no-match creation), Story 2-1 (SearchForm).
- **Patterns:** ResultBlock reused for both Yes and No; no-match.astro is minimal wrapper; BaseLayout for title/description.

### Latest Tech Information

- **Astro static pages:** no-match.astro is a static page; no getStaticPaths needed (single route).
- **ResultBlock:** Already implements FR13; no-match page is thin wrapper.

### Project Structure Notes

- **Alignment:** Architecture specifies no-match at `/result/no-match` or equivalent; ResultBlock for verdict/definition/source. Matches.
- **Reuse:** Do NOT create duplicate definition/source markup. ResultBlock is the single source. no-match.astro only imports and uses it.

### References

- [Architecture ADR-4, ADR-5, ADR-6, ADR-7](_bmad-output/planning-artifacts/architecture.md)
- [Epic 2 Story 2.4](_bmad-output/planning-artifacts/epics.md)
- [ResultBlock.astro](src/components/ResultBlock.astro) — single component for Yes and No
- [no-match.astro](src/pages/result/no-match.astro) — current implementation
- [Story 2.3](_bmad-output/implementation-artifacts/2-3-result-page-with-verdict-one-hit-definition-and-source.md) — ResultBlock and no-match refactor

## Dev Agent Record

### Agent Model Used

Code review (AI) – fixes applied 2026-02-15

### Debug Log References

### Completion Notes List

- **Verification complete:** All implementation from Stories 2.2/2.3 already satisfied AC. No code changes required.
- **Task 1:** no-match.astro uses ResultBlock verdict="No"; verdict "No" + "Not on our list."; same definition/source as Yes; no one-hit line; neutral stone/amber tone.
- **Task 2:** BaseLayout title="Not on our list", description set; h1/h2/h3 structure, section aria-labelledby, nav aria-label; 44px touch targets, focus:ring-amber-500.
- **Task 3:** SearchForm navigates to base+'result/no-match' on no match or low-confidence; ResultBlock "Search again" link; static no-match page builds to dist/result/no-match/.
- **Build:** `npm run build` succeeds; no-match page present in dist output.
- **Code review fixes (2026-02-15):** no-match.astro — h1 set to "Not on our list" (ADR-5 parity with Yes result); main given aria-label="No match result". ResultBlock.astro — whitespace-nowrap on result links for stable 44px touch targets. Story — File List and placeholder updated.

### File List

- **Modified (code review):** `src/pages/result/no-match.astro`, `src/components/ResultBlock.astro`
- **Added:** `_bmad-output/implementation-artifacts/2-4-no-match-result-state.md`
- **Verified (no change):** `src/components/SearchForm.astro`

### Change Log

- 2026-02-15: Story 2-4 verification complete. All AC satisfied by existing implementation; no code changes.
- 2026-02-15: Code review fixes applied: no-match h1 + main aria-label, ResultBlock link whitespace-nowrap, story File List and Dev Agent Record updated; status → done.
