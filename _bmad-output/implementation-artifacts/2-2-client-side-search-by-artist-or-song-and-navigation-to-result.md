# Story 2.2: Client-side search by artist or song and navigation to result

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to search by artist name or song title and be taken to a result page or no-match state,
so that I can find out whether an artist/song is on the Wikipedia US one-hit wonder list.

## Acceptance Criteria

1. **Given** I am on the home page and the list data (or search index) is loaded  
   **When** I enter an artist name or song title and submit (Enter or tap/click Search)  
   **Then** the system performs lookup against the build-time dataset only (no runtime API call for list data) (FR1, FR2, FR4)  
   **And** if there is a match, I am navigated to the result page for that entry (e.g. `/result/[slug]`)  
   **And** if there is no match (or no confident match), I am navigated to the no-match view (delivered by Story 2.4; implement 2.4 before 2.2 per Epic 2 implementation order)  
   **And** search results are shown within 2 seconds of submit on typical hardware (NFR-P2)  
   **And** a loading state (e.g. "Searching…" or disabled submit) is shown until the result is shown (UX)

## Tasks / Subtasks

- [x] Task 1: Add Fuse.js and wire search logic (AC: #1)
  - [x] Subtask 1.1: `npm install fuse.js` (use latest, e.g. ^7.1.0)
  - [x] Subtask 1.2: In SearchForm.astro script: `import Fuse from 'fuse.js'`; load `window.__ONE_HIT_WONDERS__`; configure Fuse with keys `['artist','song']`; return best match (or null)
  - [x] Subtask 1.3: Configure Fuse.js for typo tolerance (e.g. `threshold: 0.4`) and single-result behavior
- [x] Task 2: Wire SearchForm submit to search and navigation (AC: #1)
  - [x] Subtask 2.1: Replace `e.preventDefault()` in SearchForm with: read input value, run search, show loading state (disabled submit + "Searching…")
  - [x] Subtask 2.2: On match: navigate to `/result/[slug]` using `import.meta.env.BASE_URL` + `result/` + slug (e.g. `location.href` or `location.assign`)
  - [x] Subtask 2.3: On no match: navigate to no-match view (see Task 3)
  - [x] Subtask 2.4: Clear loading state after navigation; ensure result within ~2s (NFR-P2)
- [x] Task 3: No-match view (AC: #1)
  - [x] Subtask 3.1: If Story 2.4 (no-match view) is not yet implemented: create `src/pages/result/no-match.astro` with minimal content—verdict "No" or "Not on our list", one-line definition, source link (Architecture ADR-7). Use BaseLayout.
  - [x] Subtask 3.2: If Story 2.4 is implemented: navigate to the existing no-match route (e.g. `/result/no-match` or as defined in 2.4)
- [x] Task 4: Verify accessibility and loading UX (AC: #1)
  - [x] Subtask 4.1: Loading state: disable submit, show "Searching…" (or spinner) until navigation completes
  - [x] Subtask 4.2: Ensure search and navigation remain keyboard-operable; focus management acceptable (e.g. focus stays on submit until navigation)

## Dev Notes

### Architecture Compliance

- **ADR-2 (Client-side search):** Use Fuse.js (or MiniSearch) on build-time JSON. No server round-trip for list data. [Source: architecture.md § ADR-2]
- **ADR-5 (URLs):** Result pages at `/result/[slug]`; slug from data. Search resolves to same slug scheme. Use `import.meta.env.BASE_URL` for correct paths on GitHub Pages (`base: '/IsItAOneHitWonder/'`). [Source: architecture.md § ADR-5]
- **ADR-6 (Accessibility):** Search input and submit remain keyboard-operable with visible focus indicators. [Source: architecture.md § ADR-6]
- **ADR-7 (No match):** Navigate to no-match view with verdict "No" or "Not on our list", same definition and source as Yes results. [Source: architecture.md § ADR-7]
- **Project structure:** SearchForm triggers client-side search and navigation. List data from `window.__ONE_HIT_WONDERS__` (inlined at build from `load-list.ts`). [Source: architecture.md § Implementation Patterns]

### Technical Requirements

- **Search library:** Fuse.js (Architecture ADR-2). Index over `artist` and `song`. Fuzzy matching for typo tolerance.
- **Data source:** `window.__ONE_HIT_WONDERS__` — array of `{ artist, song, year, slug }`. Already inlined in `index.astro` via `define:vars`.
- **Navigation:** Match → `location.assign(base + 'result/' + slug)` or equivalent. No match → `base + 'result/no-match'` (or route defined by Story 2.4).
- **Base URL:** Use `import.meta.env.BASE_URL` (e.g. `/IsItAOneHitWonder/`) for all client-side navigation so links work on GitHub Pages.
- **Loading state:** Disable submit button, change label to "Searching…" (or show spinner) until navigation. Per UX: result within ~2s.

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Fuse.js | ^7.1.0 — Client-side fuzzy search. Zero dependencies. Use `keys: ['artist','song']`, `threshold: 0.4` (adjust for typo tolerance). |
| Astro | ^5.17.1 — No change. SearchForm script runs client-side (no `client:` directive needed; script in component runs on load). |
| Tailwind CSS | ^4.1.18 — No change. Use for loading state styling if needed. |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/components/SearchForm.astro` | **Modify.** Replace `e.preventDefault()` with search logic, loading state, navigation. |
| `src/pages/index.astro` | **No change.** Already inlines list data to `window.__ONE_HIT_WONDERS__`. |
| `src/pages/result/no-match.astro` | **Create (if 2.4 not done).** Minimal no-match page: verdict "No", definition, source. Use BaseLayout. |
| `package.json` | **Modify.** Add `fuse.js` dependency. |

### Testing Requirements

- **Functional:** Enter "Chumbawamba" or "Tubthumping" → navigate to `/result/chumbawamba` (or correct slug). Enter "xyznonexistent" → navigate to no-match view.
- **Performance:** Search + navigation within 2s on typical hardware (NFR-P2).
- **Loading UX:** Submit shows "Searching…" or disabled state until result appears.
- **Base URL:** Verify navigation works with `base: '/IsItAOneHitWonder/'` (run `npm run build` and `npm run preview` to test).
- **Accessibility:** Keyboard: Tab to input, type, Enter to submit; focus indicators remain. No regression from Story 2.1.
- No automated unit tests required; manual verification sufficient.

### Previous Story Intelligence (Story 2.1)

- **SearchForm.astro:** Form id `search-form`, input id `search-input`, submit button. Currently has `e.preventDefault()` — replace with full search logic. Script uses `document.getElementById('search-form')`. [Source: 2-1-home-page-with-single-prominent-search-control.md]
- **index.astro:** Inlines list via `window.__ONE_HIT_WONDERS__ = list` from `listData` (load-list.ts). Do not remove. [Source: 2-1-home-page-with-single-prominent-search-control.md]
- **Data shape:** `{ artist, song, year, slug }` per entry. Slug is URL-safe, e.g. `chumbawamba`. [Source: load-list.ts, one-hit-wonders.json]
- **Design constraint:** No purple/blue as primary (workspace rule). Amber used for focus/buttons. [Source: 2-1 completion notes]
- **Code review learnings (2-1):** Use `getElementById('search-form')` for form reference; avoid redundant aria-labels; form id is component-scoped.

### Git Intelligence Summary

- **Recent commits:** Story 2.1 (SearchForm, index.astro), Story 1.5 (site URL, HTTPS), 1.4 (CI), 1.3 (wire JSON).
- **Patterns:** Components in `src/components/`, pages in `src/pages/`, Astro + Tailwind. No Fuse.js or client search yet.
- **Conventions:** PascalCase components; `import.meta.env.BASE_URL` for asset paths (BaseLayout).

### Latest Tech Information (Fuse.js)

- **Fuse.js 7.1.0:** Lightweight, zero deps. Use `new Fuse(list, { keys: ['artist','song'], threshold: 0.4 })`. `search(query)` returns matches; take first for single-result navigation.
- **Bundle:** Fuse.js is small; suitable for client-side. No build config changes needed for Astro.
- **Typo tolerance:** `threshold` 0–1; lower = stricter. 0.4 allows minor typos. Adjust based on UX testing.

### Project Structure Notes

- **Alignment:** Architecture specifies client-side search in SearchForm or index; Fuse.js on build-time JSON. Matches.
- **No-match route:** Architecture does not specify exact path. Use `/result/no-match` to keep result URLs consistent. Ensure no artist has slug `no-match` (unlikely in data).

### References

- [Fuse.js Documentation](https://fusejs.io/)
- [Astro Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/)
- [Architecture ADR-2, ADR-5, ADR-7](_bmad-output/planning-artifacts/architecture.md)
- [UX Design - Search, Loading state](_bmad-output/planning-artifacts/ux-design-specification.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Fuse.js ^7.1.0 added; SearchForm runs client-side search on `window.__ONE_HIT_WONDERS__` with keys `['artist','song']`, threshold 0.4.
- Submit handler: read input, run search, set loading (disabled submit + "Searching…"), navigate to `/result/[slug]` on match or `/result/no-match` on no match. Uses `import.meta.env.BASE_URL` for GitHub Pages.
- Created `src/pages/result/no-match.astro` (Story 2.4 not done): verdict "No", "Not on our list", one-line definition, source + CC BY-SA 4.0 links, BaseLayout.
- Build passes. Manual verification: search "Chumbawamba" or "Tubthumping" → `/result/chumbawamba`; "xyznonexistent" → no-match.
- **Review fixes (2026-02-15):** Fuse.js `includeScore: true` and confidence threshold 0.5 (ADR-7 low-confidence → no-match). Try/catch around search with fallback to no-match. Slug encoded with encodeURIComponent. Empty submit shows "Please enter an artist or song" in live region. File List updated to include package-lock.json; reminder to commit no-match.astro.

### File List

- `package.json` (modified — added fuse.js ^7.1.0)
- `package-lock.json` (modified — lockfile updated by npm install fuse.js)
- `src/components/SearchForm.astro` (modified — Fuse.js search, loading state, navigation, confidence threshold, try/catch, empty message, slug encoding)
- `src/pages/result/no-match.astro` (new — minimal no-match page per ADR-7; ensure committed with story)

### Senior Developer Review (AI)

**Reviewer:** DJ (adversarial code review) on 2026-02-15

**Git vs Story:** 2 discrepancies (package-lock.json modified, no-match.astro untracked). **Issues:** 1 High, 2 Medium, 4 Low.

**Findings:**

- **HIGH — AC/ADR-7 “no confident match” not implemented:** Acceptance criterion and ADR-7 require “no match **(or no confident match)**” → no-match view. The implementation always takes the first Fuse.js result when `results.length > 0`, with no check on match quality. With `threshold: 0.4`, a weak match (e.g. low score) can still navigate to an artist page instead of no-match. **Required:** Use Fuse.js `includeScore: true`, then treat best match as “no confident match” when score exceeds a chosen threshold (e.g. > 0.5) and navigate to no-match instead.
- **MEDIUM — File List incomplete:** `package-lock.json` was modified by `npm install fuse.js` but is not listed in the story File List. Documentation of changes should include it.
- **MEDIUM — New file not in version control:** `src/pages/result/no-match.astro` is untracked (`??`). Story correctly lists it as new; for transparency and CI, it should be committed with the story.
- **LOW — No try/catch around search:** If `Fuse` or `fuse.search()` throws (e.g. malformed list), the error is uncaught and the user gets no navigation or feedback. Defensive `try/catch` with fallback to no-match would be safer.
- **LOW — Empty submit gives no feedback:** Submitting with an empty input returns early with no message. Consider showing “Please enter an artist or song” or keeping focus in the input for accessibility.
- **LOW — Slug used in URL without encoding:** `match.slug` is concatenated into the path. Data is validated at build; if a slug ever contained `..` or `/`, the URL could be wrong. Defensive encodeURIComponent on slug (or validation that slug is path-safe) would harden the app.
- **LOW — Fuse instance per search:** A new `Fuse` instance is created on every search. Acceptable for single-submit-then-navigate; could be noted or reused if behavior changes.

**Outcome:** Changes requested. Story status set to in-progress until HIGH and MEDIUM issues are addressed.

**Fixes applied (2026-02-15):** HIGH fixed (Fuse includeScore + confidence threshold 0.5). MEDIUM File List fixed (package-lock.json added). MEDIUM untracked file: File List and completion note remind to commit no-match.astro. LOW fixes: try/catch, empty submit message, encodeURIComponent(slug).

### Change Log

- 2026-02-15: Implemented client-side search with Fuse.js, navigation to result/no-match, loading state, no-match page. Status → review.
- 2026-02-15: Code review (AI). Findings: 1 High (confidence threshold), 2 Medium (File List, untracked file), 4 Low. Status → in-progress.
- 2026-02-15: Review fixes applied: confidence threshold, try/catch, slug encoding, empty submit message, File List + package-lock.json. Commit no-match.astro to complete.
- 2026-02-15: Committed and pushed. Status → done.
