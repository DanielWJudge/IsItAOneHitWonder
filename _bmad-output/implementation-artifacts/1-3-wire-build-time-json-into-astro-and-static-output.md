# Story 1.3: Wire build-time JSON into Astro and static output

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the parsed list JSON to be consumed at Astro build time and available for static generation,
So that the site can generate result pages and the client can load list data without a server round-trip.

## Acceptance Criteria

1. **Given** `src/data/one-hit-wonders.json` exists (from Story 1.2 or committed fallback)  
   **When** `astro build` runs  
   **Then** Astro reads the JSON (e.g. from `src/data/one-hit-wonders.json`)  
   **And** the build completes without requiring a runtime API call for list data (FR17)  
   **And** the built output includes the list data (e.g. in `dist/` or inlined where consumed) so client-side search can use it

## Tasks / Subtasks

- [x] Task 1: Ensure Astro reads JSON at build time (AC: #1)
  - [x] Import or read `src/data/one-hit-wonders.json` in Astro build context (e.g. in a page, layout, or `getStaticPaths`)
  - [x] Verify build does not call any external API for list data
- [x] Task 2: Expose list data in built output for client-side search (AC: #1)
  - [x] Ensure list data is available in `dist/` for future client use: either inlined in a page (e.g. script/data on index) or output as a static JSON asset (e.g. copied to public or generated route)
  - [x] Document where client will load the data from (Epic 2 will consume it)
- [x] Task 3: Optional—scaffold `result/[slug].astro` with `getStaticPaths` from JSON (AC: #1)
  - [x] If scope allows: add `src/pages/result/[slug].astro` that exports `getStaticPaths()` reading the JSON and returning one `{ params: { slug } }` per entry; page content can be minimal placeholder until Story 2.3

### Review Follow-ups (AI) — 2026-02-01

- [x] [AI-Review][Medium] Result page has no styles — use shared layout and global.css [src/pages/result/[slug].astro]
- [x] [AI-Review][Medium] Type annotation mismatch for `year` — use `string | number` via shared type [src/pages/result/[slug].astro]
- [x] [AI-Review][Medium] No shared layout or head consistency — add BaseLayout.astro with favicon, generator meta, global.css [src/layouts/BaseLayout.astro]
- [x] [AI-Review][Medium] Duplicate JSON imports — add shared data module `src/data/load-list.ts` [src/pages/index.astro, src/pages/result/[slug].astro]
- [x] [AI-Review][Low] sprint-status.yaml modified — document in File List (implementation artifact)
- [x] [AI-Review][Low] No duplicate-slug guard in getStaticPaths — add Set check and throw if duplicates [src/pages/result/[slug].astro]
- [ ] [AI-Review][Low] Large inline payload in index.html — document or future-optimize with static JSON asset if bundle size becomes a concern (deferred)

## Dev Notes

### Architecture Compliance

- **ADR-1 Data pipeline (Architecture § ADR-1):** List data is produced by fetch script to `src/data/one-hit-wonders.json`; consumed at Astro build. No runtime API for list data.
- **ADR-5 URLs & SEO (Architecture § ADR-5):** Result pages `/result/[slug]`; build must generate one HTML per list entry (or dynamic route with static prerender). `getStaticPaths()` in `result/[slug].astro` should read the same JSON and return slugs.
- **Data Model & Build Pipeline (Architecture):** Build pipeline order: Fetch → Parse → **Build (Astro reads JSON)** → Deploy. JSON fields: `artist`, `song`, `year`, `slug` (camelCase).
- **Project structure (Architecture § Project Structure & Boundaries):** `src/data/one-hit-wonders.json` consumed by Astro at build; `src/pages/result/[slug].astro` uses `getStaticPaths()` from JSON.

### Technical Requirements

- **Astro:** Use build-time data loading only. Import JSON from `src/data/` (e.g. `import data from '../data/one-hit-wonders.json'`) or use `import.meta.glob`/Vite to read at build. No `fetch()` to external API for list data during build.
- **Static output:** Astro config must use static output (default in Astro 4+). Do not add `output: 'server'`. Build must complete with only file I/O for list data.
- **Built output:** List data must appear in `dist/` so client can use it: (1) inlined in HTML (e.g. script tag or data attribute on index), or (2) static file (e.g. copy JSON to `public/` so it is served as `/one-hit-wonders.json`). Choose one and document.

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/data/one-hit-wonders.json` | Input: exists from Story 1.2; do not change schema |
| `src/pages/index.astro` | May import JSON and expose in built output (e.g. for future client search) |
| `src/pages/result/[slug].astro` | Optional this story: add with `getStaticPaths()` from JSON; minimal body until Story 2.3 |
| `astro.config.mjs` | No change required for this story (output remains static) |

Do NOT:
- Add a runtime API or server route for list data.
- Change the JSON schema (`artist`, `song`, `year`, `slug`).

### Library / Framework Requirements

| Package | Version | Notes |
|---------|---------|-------|
| Astro | (existing) | Use existing project version; build-time import only |
| Node / Vite | (existing) | JSON import is built-in |

No new npm dependencies required.

### Testing Requirements

- **Manual:** Run `npm run build` (or `astro build`). Confirm build succeeds and does not call MediaWiki or any external API. Confirm list data is present in `dist/` (either inlined in HTML or as a static JSON file).
- **Sanity:** If `result/[slug].astro` exists, run build and verify one HTML file per slug under `dist/result/<slug>/index.html` (or equivalent).
- No automated tests required for this story.

### Previous Story Intelligence (1-2)

- **JSON location:** `src/data/one-hit-wonders.json` exists; array of `{ artist, song, year, slug }` (camelCase). Hundreds of entries (e.g. 1700+). Do not re-parse or re-fetch; consume as-is.
- **Script:** `scripts/fetch-one-hit-wonders.js` produces the JSON; `npm run fetch-data` runs it. This story does not change the script or CI; it only wires Astro to the existing file.
- **Pattern:** Story 1-2 used exact architecture paths; keep `src/data/one-hit-wonders.json` as single source for build.

### Latest Tech Information (Astro build-time data)

- **Astro 4.x:** Static by default. Import JSON in `.astro` or `.ts`: `import data from '../data/one-hit-wonders.json'` — Vite bundles it at build. For `getStaticPaths`, return `data.map(entry => ({ params: { slug: entry.slug }, props: { entry } }))`.
- **Exposing to client:** (1) Inline: in a page component, pass the array to a client script (e.g. `<script define:vars={{ list: data }}>window.__ONE_HIT_WONDERS__ = list;</script>`) so it is in the HTML. (2) Static file: put JSON in `public/` (e.g. copy at build) so it is served at `/one-hit-wonders.json`; client fetches it. Architecture allows either "in dist/ or inlined where consumed."

### Project Context Reference

- **PRD:** [Source: _bmad-output/planning-artifacts/prd.md] — FR17 (parsed list available for client-side lookup without server round-trip).
- **Architecture:** [Source: _bmad-output/planning-artifacts/architecture.md] — ADR-1, ADR-5, Data Model & Build Pipeline, Project Structure.
- **Epics:** [Source: _bmad-output/planning-artifacts/epics.md] — Epic 1 Story 1.3.

### Project Structure Notes

- **Existing:** `src/pages/index.astro` (minimal), `src/data/one-hit-wonders.json`, `astro.config.mjs` (no `site` yet; Story 1.5). No `result/` route yet.
- **Alignment:** Architecture specifies `src/pages/result/[slug].astro` with `getStaticPaths()` from JSON; adding it here (optional) unblocks Epic 2 and keeps all build-time wiring in one story.

### References

- Astro getStaticPaths: https://docs.astro.build/en/guides/routing/#dynamic-routes
- Astro build-time data: https://docs.astro.build/en/guides/data-fetching/
- Architecture ADR-1, ADR-5: _bmad-output/planning-artifacts/architecture.md

## Change Log

- **2026-02-01:** Wired build-time JSON into Astro: index.astro imports list data and exposes via `window.__ONE_HIT_WONDERS__`; added result/[slug].astro with getStaticPaths from JSON. Build succeeds; list in dist (inlined + static result pages).

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- **Task 1:** `src/pages/index.astro` imports `src/data/one-hit-wonders.json` at build time. No external API; Vite bundles JSON. `result/[slug].astro` also imports the same JSON for `getStaticPaths()`.
- **Task 2:** List data is inlined in the built index via `<script define:vars={{ list: listData }}>window.__ONE_HIT_WONDERS__ = list;</script>`. Client (Epic 2) loads from `window.__ONE_HIT_WONDERS__`. Confirmed in `dist/index.html`.
- **Task 3:** Added `src/pages/result/[slug].astro` with `getStaticPaths()` from JSON; one HTML per slug under `dist/result/<slug>/index.html`. Placeholder body until Story 2.3.
- **Validation:** `npm run build` completed successfully; output is static; list data present in dist (inlined in index + 1534+ result pages).

### File List

- `src/pages/index.astro` (modified)
- `src/pages/result/[slug].astro` (new)
- `src/layouts/BaseLayout.astro` (new — review follow-up)
- `src/data/load-list.ts` (new — review follow-up)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified — implementation artifact)
