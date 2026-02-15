# Story 2.3: Result page with verdict, one hit, definition, and source

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the result page to show a clear Yes/No verdict, "The one hit: [Song] – [Artist]" when Yes, and the one-line definition and source in one view,
so that I have the full answer and its source without opening another page.

## Acceptance Criteria

1. **Given** I have navigated to a result page for a list entry (e.g. `/result/chumbawamba`)  
   **When** the page is displayed  
   **Then** I see a clear Yes verdict and the line "The one hit: [Song] – [Artist]" (e.g. "The one hit: Tubthumping – Chumbawamba") (FR5, FR6)  
   **And** I see a one-line definition of "one-hit wonder" and the source (Wikipedia US list) on the same view without opening another page or control (FR7, FR11)  
   **And** the verdict, one hit, definition, and source appear in a single, coherent result block (FR8)  
   **And** the page has a descriptive title and meta suitable for SEO (e.g. "[Artist] – One-Hit Wonder? | IsItAOneHitWonder") (Architecture ADR-5)  
   **And** heading structure and landmarks allow screen-reader users to navigate to verdict, one hit, definition, and source (NFR-A4)

## Tasks / Subtasks

- [x] Task 1: Implement ResultBlock component (AC: #1)
  - [x] Subtask 1.1: Create `src/components/ResultBlock.astro` with props: `entry` (artist, song, year, slug), `verdict` ("Yes" for list entries)
  - [x] Subtask 1.2: Render verdict "Yes", line "The one hit: [Song] – [Artist]", one-line definition, source + CC BY-SA 4.0 links
  - [x] Subtask 1.3: Use semantic structure: `<section aria-labelledby="verdict-heading">`, `<h2 id="verdict-heading">`, landmarks for screen readers (NFR-A4)
  - [x] Subtask 1.4: Match no-match.astro styling (stone/amber palette, no purple/blue primary per workspace rule)
- [x] Task 2: Update result/[slug].astro to use ResultBlock and SEO meta (AC: #1)
  - [x] Subtask 2.1: Replace placeholder content with `<ResultBlock entry={entry} verdict="Yes" />`
  - [x] Subtask 2.2: Set BaseLayout `title` to `"[Artist] – One-Hit Wonder? | IsItAOneHitWonder"` (e.g. "Chumbawamba – One-Hit Wonder? | Is It A One Hit Wonder")
  - [x] Subtask 2.3: Add `description` meta: e.g. "Yes – [Artist] is a one-hit wonder. The one hit: [Song]."
- [x] Task 3: Verify coherence and accessibility (AC: #1)
  - [x] Subtask 3.1: Result block shows verdict, one hit, definition, source in single coherent layout
  - [x] Subtask 3.2: Add SearchForm or "Search again" link for navigation back to home
  - [x] Subtask 3.3: Touch targets ≥44px; keyboard-operable; visible focus indicators (NFR-A2, UX)

## Dev Notes

### Architecture Compliance

- **ADR-4 (Attribution):** One-line definition and source on every result view. Source link + CC BY-SA 4.0 link in result block. [Source: architecture.md § ADR-4]
- **ADR-5 (URLs & SEO):** Result pages at `/result/[slug]`; descriptive title and meta (e.g. "[Artist] – One-Hit Wonder? | IsItAOneHitWonder"). [Source: architecture.md § ADR-5]
- **ADR-6 (Accessibility):** Heading structure and landmarks so screen readers navigate to verdict, one hit, definition, source. Touch targets ≥44px. [Source: architecture.md § ADR-6]
- **Project structure:** ResultBlock displays verdict, one hit (when Yes), definition, source; read-only. [Source: architecture.md § Component boundaries]

### Technical Requirements

- **Data source:** `entry` from `getStaticPaths()` props — `{ artist, song, year, slug }`. Already passed to `[slug].astro`. [Source: result/[slug].astro, load-list.ts]
- **Definition text:** "We use the Wikipedia US one-hit wonder list: one top-40 hit in the US." (match no-match.astro)
- **Source URL:** `https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States`
- **License URL:** `https://creativecommons.org/licenses/by-sa/4.0/`
- **One hit format:** "The one hit: [Song] – [Artist]" (e.g. "The one hit: Tubthumping – Chumbawamba")
- **BaseLayout:** Accepts `title` and `description`; use for SEO. Site title "Is It A One Hit Wonder" from BaseLayout.

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Astro | ^5.17.1 — No new deps. ResultBlock is Astro component; no client script needed for static content. |
| Tailwind CSS | ^4.1.18 — Use for layout, typography, links (amber for focus/links per no-match.astro). |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/components/ResultBlock.astro` | **Create.** Verdict, one hit, definition, source. Props: `entry`, `verdict`. |
| `src/pages/result/[slug].astro` | **Modify.** Replace placeholder with ResultBlock; set title/description for SEO. |
| `src/layouts/BaseLayout.astro` | **No change.** Already supports title, description. |

### Testing Requirements

- **Functional:** Navigate to `/result/chumbawamba` (or any valid slug) → see "Yes", "The one hit: Tubthumping – Chumbawamba", definition, source links.
- **SEO:** Page title "[Artist] – One-Hit Wonder? | Is It A One Hit Wonder"; meta description present.
- **Accessibility:** Heading hierarchy (h1, h2); landmarks; keyboard nav; focus indicators. No regression from 2.1/2.2.
- **Visual:** Match no-match.astro styling (stone text, amber links); no purple/blue primary.
- **Build:** `npm run build` succeeds; all static result pages render.
- No automated unit tests required; manual verification sufficient.

### Previous Story Intelligence (Story 2.2)

- **result/[slug].astro:** Already has `getStaticPaths()` from listData; passes `entry` to props. Placeholder content: `<h1>{entry.artist}</h1>`, `<p>{entry.song} ({entry.year})</p>`. Replace with ResultBlock. [Source: 2-2-client-side-search-by-artist-or-song-and-navigation-to-result.md]
- **no-match.astro:** Reference implementation for definition, source, license links, structure. Use same `sourceUrl`, `licenseUrl`, definition text, section/heading pattern. [Source: no-match.astro]
- **BaseLayout:** `title` and optional `description` props. `fullTitle` = `title | Is It A One Hit Wonder` when title differs. [Source: BaseLayout.astro]
- **Design constraint:** No purple/blue as primary. Amber for links/focus. Stone for text. [Source: 2-1, 2-2, workspace rule]
- **Code review learnings (2-2):** Use `import.meta.env.BASE_URL` for links if needed; ensure slug encoding if building URLs client-side (this story is static, no client URLs).

### Git Intelligence Summary

- **Recent commits:** Story 2-2 (Fuse.js search, no-match page, review fixes), Story 2-1 (SearchForm, index), Story 1-5 (site URL, HTTPS).
- **Patterns:** Components in `src/components/`, pages in `src/pages/`, Astro + Tailwind. Result pages use `getStaticPaths()` with listData.
- **Conventions:** PascalCase components; BaseLayout for all pages; `load-list.ts` for data; amber/stone palette.

### Latest Tech Information

- **Astro static pages:** `getStaticPaths()` already implemented. No changes to build pipeline. ResultBlock is server-rendered; no islands.
- **SEO:** Use `<BaseLayout title="..." description="...">`; Astro passes these to `<title>` and `<meta name="description">`.

### Project Structure Notes

- **Alignment:** Architecture specifies ResultBlock.astro for verdict, one hit, definition, source. Matches.
- **no-match.astro:** Story 2.4 may enhance; for 2.3, ensure Yes result page matches the definition/source pattern so both views are coherent.

### References

- [Architecture ADR-4, ADR-5, ADR-6](_bmad-output/planning-artifacts/architecture.md)
- [UX Design - Result at a glance, Transparency](_bmad-output/planning-artifacts/ux-design-specification.md)
- [no-match.astro](src/pages/result/no-match.astro) — structure and styling reference

### Senior Developer Review (AI)

- **Review date:** 2026-02-15. **Outcome:** Changes requested; fixes applied automatically.
- **Title/SEO note:** AC and ADR-5 examples use "IsItAOneHitWonder" as the site name; the actual site title in BaseLayout is **"Is It A One Hit Wonder"** (with spaces). The browser title is therefore "[Artist] – One-Hit Wonder? | Is It A One Hit Wonder". No code change required; this is the intended brand string.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Implementation Plan

- Task 1: Created ResultBlock.astro with entry/verdict props, semantic HTML (section, h2, aria-labelledby), definition text and source/license URLs matching no-match.astro. Stone/amber styling, min-h-[44px] min-w-[44px] for touch targets.
- Task 2: Imported ResultBlock in [slug].astro, replaced placeholder with ResultBlock, set BaseLayout title and description for SEO.
- Task 3: Single coherent layout verified; Search again link added in ResultBlock; focus:ring-2 focus:ring-amber-500 for keyboard focus.

### Completion Notes List

- ResultBlock.astro created with verdict, one hit line, definition, source links (Wikipedia US list + CC BY-SA 4.0), and Search again link. Semantic structure: section aria-labelledby, h2 verdict-heading. Stone/amber palette, touch targets ≥44px, focus indicators.
- result/[slug].astro updated: ResultBlock integration, page title "[Artist] – One-Hit Wonder?", meta description "Yes – [Artist] is a one-hit wonder. The one hit: [Song]."
- Build verified: `npm run build` succeeds; /result/chumbawamba renders correctly.
- Code review (2026-02-15): Fixes applied—result page h1 now page-specific; no-match uses ResultBlock; ResultBlock has optional entry, sr-only Definition/Source h3s, nav for Search again, defensive one-hit guard.

### File List

- src/components/ResultBlock.astro (created)
- src/pages/result/[slug].astro (modified)
- src/pages/result/no-match.astro (modified — code review: now uses ResultBlock for consistency and 44px touch targets)

## Change Log

- 2026-02-15: Implemented ResultBlock component, result page with verdict/one-hit/definition/source, SEO meta, Search again link. All AC satisfied.
- 2026-02-15: Code review fixes: result page h1 set to page-specific (artist – One-Hit Wonder?); no-match.astro refactored to use ResultBlock; ResultBlock supports optional entry and verdict="No", sr-only h3s for Definition/Source, nav landmark for Search again, defensive guard for one-hit line; story updated with review note and file list.
