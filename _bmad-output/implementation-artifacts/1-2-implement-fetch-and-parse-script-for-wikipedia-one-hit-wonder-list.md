# Story 1.2: Implement fetch and parse script for Wikipedia one-hit wonder list

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a script that fetches the Wikipedia US one-hit wonder list via the MediaWiki API and parses it into structured data,
So that the product has a single source of list data without scraping.

## Acceptance Criteria

1. **Given** the MediaWiki API is available  
   **When** the fetch script runs (e.g. `node scripts/fetch-one-hit-wonders.js` or equivalent)  
   **Then** it requests the list page via the Action API (`action=query`, `prop=revisions`, `rvprop=content`, `titles=List_of_one-hit_wonders_in_the_United_States`)  
   **And** it parses the raw wikitext into rows with artist, song, and year (or equivalent)  
   **And** it assigns a URL-safe slug per entry (e.g. derived from artist name)  
   **And** it outputs structured JSON (e.g. array of `{ artist, song, year, slug }`) to a file (e.g. `src/data/one-hit-wonders.json`)  
   **And** the script does not scrape; it uses the API only (FR15)

## Tasks / Subtasks

- [x] Task 1: Create scripts directory and fetch script (AC: #1)
  - [x] Ensure `scripts/` directory exists (create if missing)
  - [x] Create `scripts/fetch-one-hit-wonders.js` (or `.mjs` if using ES modules without bundling)
  - [x] Use Node.js built-in `fetch` (Node 18+) or `https` module to call MediaWiki API
- [x] Task 2: Implement MediaWiki API request (AC: #1)
  - [x] Build API URL: `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&titles=List_of_one-hit_wonders_in_the_United_States&formatversion=2`
  - [x] Handle response; extract wikitext from `query.pages[0].revisions[0].slots.main.content`
  - [x] Handle API errors (network, 404, invalid response) with clear exit codes
- [x] Task 3: Implement wikitext parser (AC: #1)
  - [x] Parse list entries from wikitext; list uses bullet format `* [[Artist]] – "[[Song]]" (YEAR)` or variations
  - [x] Handle section headers (e.g. `== 1950s ==`, `== 1960s ==`) and skip non-entry content
  - [x] Extract artist (strip wikilinks `[[...]]`), song, year from each matching line
  - [x] Tolerate minor format variations (e.g. external links, citations like `[47]`)
- [x] Task 4: Implement slug generation and JSON output (AC: #1)
  - [x] Generate URL-safe slug from artist (lowercase, replace spaces/special chars with hyphens)
  - [x] Ensure slug uniqueness (append numeric suffix if duplicate)
  - [x] Write array of `{ artist, song, year, slug }` to `src/data/one-hit-wonders.json`
  - [x] Create `src/data/` directory if it doesn't exist
- [x] Task 5: Wire npm script (AC: #1)
  - [x] Update `package.json` "fetch-data" script to run the fetch script (e.g. `node scripts/fetch-one-hit-wonders.js`)

### Review Follow-ups (AI)

- [x] [AI-Review][MEDIUM] Add fetch timeout (e.g. AbortController + 30s) so script does not hang [scripts/fetch-one-hit-wonders.js]
- [x] [AI-Review][MEDIUM] Handle non-JSON response (try/catch around res.json() or Content-Type check); clear error message [scripts/fetch-one-hit-wonders.js]
- [x] [AI-Review][MEDIUM] Wrap writeFileSync (and mkdirSync) in try/catch for disk/permission errors [scripts/fetch-one-hit-wonders.js]
- [x] [AI-Review][LOW] Use full repo URL in User-Agent (e.g. https://github.com/user/repo) [scripts/fetch-one-hit-wonders.js]
- [x] [AI-Review][LOW] Consider stripping citation refs [47] globally in artist/song, not only at end [scripts/fetch-one-hit-wonders.js]
- [x] [AI-Review][LOW] Consider distinct exit codes for network vs API vs parse/file errors
- [x] [AI-Review][LOW] Optional: sanity-check response content is expected list page before parsing

## Dev Notes

### Architecture Compliance

- **ADR-1 Data pipeline (Architecture § ADR-1):** Fetch via MediaWiki Action API (`action=query`, `prop=revisions`, `rvprop=content`, `titles=List_of_one-hit_wonders_in_the_United_States`). Parse raw wikitext with custom parser. Output structured JSON (artist, song, year, slug) to `src/data/one-hit-wonders.json`. No scraping; API only.
- **Project structure (Architecture § Project Structure & Boundaries):** Script at `scripts/fetch-one-hit-wonders.js`; output at `src/data/one-hit-wonders.json`. JSON fields: `artist`, `song`, `year`, `slug` (camelCase per Architecture).
- **FR15:** System ingests list via MediaWiki API (no scraping).

### Technical Requirements

- **Node.js:** v18.20+ (engines in package.json). Use built-in `fetch` (Node 18+) for HTTP.
- **MediaWiki API:** Use Revisions API. Example: `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=List_of_one-hit_wonders_in_the_United_States&rvprop=content&rvslots=*&formatversion=2`
- **Content path:** `response.query.pages[0].revisions[0].slots.main.content` (formatversion=2)
- **Parser:** Regex/pattern for wikitext entries. Common patterns: `* [[Artist]] – "[[Song]]" (YEAR)`, `* [Artist](url) – "[Song]" (YEAR)` (external), `* Artist – "Song" (YEAR)` (no links).
- **Slug:** Lowercase, alphanumeric + hyphens; e.g. `Chumbawamba` → `chumbawamba`; `The Chords (American band)` → `the-chords` or `the-chords-american-band`.

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `scripts/fetch-one-hit-wonders.js` | Fetch + parse script; run via `node scripts/fetch-one-hit-wonders.js` |
| `src/data/one-hit-wonders.json` | Output: `[{ artist, song, year, slug }, ...]` |
| `src/data/` | Create if missing; contains build-time JSON |

Do NOT:
- Scrape HTML; use MediaWiki API only.
- Add runtime dependencies (e.g. axios) unless necessary; Node `fetch` is sufficient.

### Library / Framework Versions

| Package | Version | Notes |
|---------|---------|-------|
| Node.js | ≥18.20.0 | Built-in `fetch`; `fs`, `path` for file I/O |

No new npm dependencies required; script uses Node built-ins.

### Testing Requirements

- **Manual:** Run `node scripts/fetch-one-hit-wonders.js`; verify `src/data/one-hit-wonders.json` exists and contains valid array with `artist`, `song`, `year`, `slug`.
- **Sanity check:** JSON should have hundreds of entries (list has 500+ artists); slug should be URL-safe.
- No automated tests required for this story; parser validation is manual.

### Latest Tech Information (MediaWiki API)

- **Revisions API (2024–2025):** Use `formatversion=2` for cleaner JSON. `rvslots=*` required to get content in slot-based response. Content in `slots.main.content`.
- **Rate limiting:** Wikipedia API allows reasonable requests; no auth needed for read. Use `User-Agent` header (e.g. `IsItAOneHitWonder/1.0`) per API etiquette.
- **Wikitext format:** List entries typically `* [[Artist]] – "[[Song]]" (YEAR)`; some use `[Artist](external)` or plain text. Parser must handle `[[...]]`, `"..."`, `(YEAR)` patterns.

### Previous Story Intelligence (1-1)

- **Project state:** Astro minimal + TypeScript + Tailwind initialized. `scripts/` and `src/data/` do NOT exist yet; this story creates them.
- **package.json:** Has placeholder `"fetch-data": "echo \"Fetch step added in Story 1.4\""`; this story replaces it with actual script invocation.
- **Deploy workflow:** `.github/workflows/deploy.yml` already runs `npm run fetch-data` with `continue-on-error: true`; no workflow changes needed in this story.
- **Pattern:** Story 1-1 used exact architecture paths; follow same discipline for scripts and data.

### Project Context Reference

- **PRD:** [Source: _bmad-output/planning-artifacts/prd.md] — FR15, FR16, FR17; MediaWiki API ingest.
- **Architecture:** [Source: _bmad-output/planning-artifacts/architecture.md] — ADR-1, Data Model & Build Pipeline Summary, Project Structure.
- **Epics:** [Source: _bmad-output/planning-artifacts/epics.md] — Epic 1 Story 1.2.

### Project Structure Notes

- **New directories:** `scripts/` (root), `src/data/` (inside src).
- **Existing:** `.github/workflows/deploy.yml` will use `npm run fetch-data`; Story 1.4 wires full CI; this story only implements the script and updates the npm script.

### References

- MediaWiki API Get contents: https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page
- Wikipedia list: https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States
- Architecture ADR-1: _bmad-output/planning-artifacts/architecture.md#adr-1-data-pipeline

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented fetch script at `scripts/fetch-one-hit-wonders.js` using MediaWiki Action API (`action=query`, `prop=revisions`, `rvprop=content`, `rvslots=*`, `titles=List_of_one-hit_wonders_in_the_United_States`, `formatversion=2`, `format=json`). Extracts wikitext from `query.pages[0].revisions[0].slots.main.content`; handles API/network errors with exit code 1.
- Parser: regex-based parsing for `* [[Artist]] – "[[Song]]" (YEAR)` and variants; strips wikilinks `[[...]]` and external links `[url text]`; skips section headers `== ... ==`; tolerates citations `[47]`. Output: 1774 entries.
- Slug: lowercase, alphanumeric + hyphens; uniqueness via numeric suffix when duplicate. JSON written to `src/data/one-hit-wonders.json`; `src/data/` created if missing.
- `package.json` "fetch-data" script set to `node scripts/fetch-one-hit-wonders.js`. Manual validation: script and `npm run fetch-data` run successfully; JSON has hundreds of entries with `artist`, `song`, `year`, `slug`. No automated tests per story.
- Post-review fixes (2026-02-01): Added fetch timeout (AbortController, 30s); Content-Type check and try/catch around res.json(); try/catch around mkdirSync/writeFileSync with EXIT_FILE; distinct exit codes (EXIT_NETWORK=1, EXIT_API=2, EXIT_FILE=3); full User-Agent URL; global citation strip; sanity check that response content includes "one-hit" or "List of". Script re-validated (1774 entries).

### File List

- scripts/fetch-one-hit-wonders.js (new)
- src/data/one-hit-wonders.json (new)
- src/data/ (new directory)
- package.json (modified: fetch-data script)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modified: story 1.2 status)
- _bmad-output/implementation-artifacts/1-2-code-review-findings.md (new: code review)

## Change Log

- 2026-02-01: Implemented fetch script (MediaWiki API), wikitext parser, slug generation, JSON output to `src/data/one-hit-wonders.json`; wired `npm run fetch-data`. All tasks complete; status → review.
- 2026-02-01: Code review (AI). AC and tasks validated. 3 MEDIUM, 4 LOW issues. Review follow-ups added; status → in-progress. Findings: _bmad-output/implementation-artifacts/1-2-code-review-findings.md.
- 2026-02-01: All review follow-ups fixed in scripts/fetch-one-hit-wonders.js (timeout, non-JSON handling, file write try/catch, exit codes, User-Agent, citation strip, sanity check). Status → done.

## Senior Developer Review (AI)

**Review date:** 2026-02-01  
**Outcome:** Changes requested (non-blocking)

**Summary:** Acceptance criteria and all tasks verified as implemented. No false claims. Seven issues found: 3 MEDIUM (fetch timeout, non-JSON response handling, sync write not in try/catch), 4 LOW (User-Agent URL, citation stripping, exit codes, response sanity check). See Review Follow-ups (AI) in Tasks and full findings in `1-2-code-review-findings.md`.
