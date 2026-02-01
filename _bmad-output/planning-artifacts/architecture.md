---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: complete
completedAt: '2026-02-01'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/research/technical-domain-isit-a-one-hit-wonder-v1-research-2026-02-01.md
  - _bmad-output/planning-artifacts/product-brief-IsItAOneHitWonder-2026-02-01.md
  - _bmad-output/planning-artifacts/prd-IsItAOneHitWonder-2026-02-01-validation-report.md
workflowType: 'architecture'
project_name: IsItAOneHitWonder
user_name: DJ
date: '2026-02-01'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (FR1–FR19):**

- **Search & Lookup (FR1–FR4):** Single search by artist or song against Wikipedia US one-hit wonder dataset; no runtime API for list data. Drives: client-side search on build-time data, single search control.
- **Result Presentation (FR5–FR8):** Yes/No verdict; "The one hit: [Song] – [Artist]" when Yes; one-line definition and source always visible; single coherent result view. Drives: result block component, definition/source copy.
- **Share & Copy (FR9–FR10):** One compact shareable line (verdict + definition ref + one hit); copy/share from result view. Drives: clipboard API, copy button, shareable line format.
- **Attribution & Transparency (FR11–FR12):** Visible data source (Wikipedia US list) and short definition; CC BY-SA 4.0 (source link + license link) in UI/footer. Drives: footer, result block attribution.
- **Graceful Degradation & No Match (FR13–FR14):** No match → "No" or "Not on our list" with same definition/source; fetch failure → build with cached data. Drives: no-match result state, fetch step continue-on-error.
- **Data Pipeline (FR15–FR17):** MediaWiki API ingest, parse to artist/song/year, refresh on schedule, list available for client-side lookup without server round-trip. Drives: build pipeline, JSON output, client-side search.
- **Access & Reach (FR18–FR19):** HTTPS; core experience on common mobile/desktop browsers; optional JS-off fallback. Drives: GitHub Pages HTTPS, browser matrix, optional fallback.

**Non-Functional Requirements:**

- **Performance (NFR-P1–P3):** FCP within 3s on typical 4G; search results within 2s; list data at load time (no blocking runtime API).
- **Security (NFR-S1–S2):** HTTPS only; no user account or payment data.
- **Accessibility (NFR-A1–A4):** WCAG 2.1 Level AA; keyboard-operable search and copy; accessible names and landmarks.
- **Integration (NFR-I1–I2):** Build pipeline fetches via MediaWiki API; on fetch failure use cached list; scheduled refresh; deployed site reflects latest successful fetch or cache.

**Scale & Complexity:**

- **Primary domain:** Static web app (MPA).
- **Complexity level:** Low (greenfield, single list, client-side search, no auth/backend).
- **Estimated components:** Data pipeline script, Astro pages (home, result), search form, result block, copy button, footer; build-time JSON; client-side search (Fuse.js or MiniSearch).

### Technical Constraints & Dependencies

- **From PRD/Research:** MediaWiki API (no scraping); build-time data only; client-side search; Astro static output; GitHub Pages + HTTPS; weekly refresh via GitHub Actions; `continue-on-error` on fetch.
- **From UX:** Tailwind CSS with custom tokens; no purple/blue as primary; mobile-first; touch targets ≥44px; WCAG AA; shareable URLs (e.g. `/result/chumbawamba`).
- **From workspace rule:** No purple/blue gradients or primary color.

### Cross-Cutting Concerns Identified

- **Data pipeline ↔ Build ↔ Deploy:** Fetch → parse → JSON must run before Astro build; deploy must use same `site` as GitHub Pages URL.
- **Search ↔ Result page ↔ URLs:** Client-side search must resolve to same slug/URL scheme as static result pages for direct links and SEO.
- **Attribution:** Source and license must appear in result block and footer and in the shareable one-line.
- **Error/edge:** No-match and fetch-failure paths must preserve definition/source and avoid breaking the site.

---

## Starter Template Evaluation

### Primary Technology Domain

**Static web app (MPA)** — Astro with static output, build-time data, client-side search. No SPA; no runtime API for list data.

### Starter Options Considered

- **Astro (official):** PRD and Research mandate Astro for static MPA, build-time data, GitHub Pages. No alternative framework in scope.
- **Create command:** `npm create astro@latest` with options: template `minimal` or `basics`, TypeScript strict, no install (user runs `npm install`), Git yes. Tailwind added via `npx astro add tailwind`.

### Selected Starter: Astro (official)

**Rationale for Selection:**

- PRD Web App § Implementation: "Use Astro's build-time data loading and static output."
- Research §4.1, §4.5: Astro static sites, deploy to GitHub Pages; `site` in astro.config must match Pages URL.
- UX: Tailwind with custom tokens; minimal client-side JS (search, copy).

**Initialization Command:**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
npm install
npx astro add tailwind
```

(Or use `--template basics` if a small sample page is preferred; then remove sample content.)

**Architectural Decisions Provided by Starter:**

- **Language & Runtime:** TypeScript (strict); Node for build; static output (no server).
- **Styling:** Tailwind added via Astro integration; design tokens in `tailwind.config` (no purple/blue primary).
- **Build:** Astro Vite-based build; output to `dist/`; `site` in `astro.config.mjs` set to GitHub Pages URL (e.g. `https://<user>.github.io/<repo>/` or custom domain).
- **Code organization:** `src/pages/` for routes; `src/components/` for Astro/UI components; `src/layouts/` for layout; `public/` for static assets.
- **Development:** `astro dev`; `astro build`; no backend or API routes for list data.

**Note:** Project initialization using the above command (or equivalent) should be the first implementation step.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):** Data pipeline (fetch, parse, JSON), search approach (client-side library), deployment (GitHub Pages, `site`), URL scheme for result pages.

**Important Decisions (Shape Architecture):** Attribution placement, error/no-match handling, share/copy format, accessibility (WCAG AA, keyboard, labels).

**Deferred (Post-MVP):** Quiz, regions, paste link, playlist, newsletter, API/bots.

---

### ADR-1: Data Pipeline

| Field | Content |
|-------|---------|
| **Title** | Data pipeline: MediaWiki API → parse → build-time JSON |
| **Status** | Accepted |
| **Context** | List data must be ingested without scraping; available at build time for client-side lookup; weekly refresh; site must not break if fetch fails. |
| **Decision** | Fetch Wikipedia US one-hit wonder list via MediaWiki Action API (`action=query`, `prop=revisions`, `rvprop=content`, `titles=List_of_one-hit_wonders_in_the_United_States`). Parse raw wikitext with a custom parser (regex/pattern match for `* [[Artist]] – "[[Song]]" (YEAR)` and section boundaries). Output structured JSON (artist, song, year, slug) to a file consumed at Astro build (e.g. `src/data/one-hit-wonders.json`). Run fetch in CI (GitHub Actions) before `npm run build`; use `continue-on-error: true` on the fetch step so build proceeds with cached data if API fails. Schedule weekly (e.g. `0 0 * * 0` UTC). |
| **Rationale** | Research §2.2–2.6: API over scraping; single request returns full page; custom parser feasible for known wikitext structure. PRD FR15–FR17, NFR-I1–I2. |
| **Consequences** | Parser must be maintained if Wikipedia list format changes; cached JSON ensures site stays up on fetch failure. |
| **Traceability** | PRD FR15–FR17, NFR-I1–I2; Research §2, §5.1. |

---

### ADR-2: Search (Client-Side)

| Field | Content |
|-------|---------|
| **Title** | Client-side search: Fuse.js or MiniSearch on build-time JSON |
| **Status** | Accepted |
| **Context** | No runtime API for list data; results within ~2s (NFR-P2); search by artist or song; typo tolerance desirable. |
| **Decision** | Use client-side search only. Load build-time JSON (or pre-built index) in the browser; run search with **Fuse.js** or **MiniSearch**. No server round-trip for list data. Index/search runs in main thread or worker; result page shown by navigation to `/result/[slug]` or equivalent. |
| **Rationale** | PRD FR4, FR17; NFR-P2, NFR-P3; Research §4.2. Fuse.js: fuzzy, good for typos; small bundle. MiniSearch: full-text, can pre-build index. Either satisfies "no runtime API" and "results within ~2s." |
| **Trade-offs** | **Fuse.js:** Simple API, fuzzy matching; search over raw JSON each time unless cached in memory. **MiniSearch:** Can serialize index for faster subsequent search; slightly more setup. Choose one and document in implementation. |
| **Consequences** | All list data shipped in (or derived from) one JSON payload; search logic is client-only; direct URLs to result pages must match slug from data. |
| **Traceability** | PRD FR4, FR17, NFR-P2–P3; Research §4.2. |

---

### ADR-3: Deployment

| Field | Content |
|-------|---------|
| **Title** | Deployment: Astro static output → GitHub Pages, HTTPS |
| **Status** | Accepted |
| **Decision** | Build Astro with static output (`output: 'static'`). Deploy `dist/` to GitHub Pages via GitHub Actions (e.g. `peaceiris/actions-gh-pages` or `actions/deploy-pages`). Set `site` in `astro.config.mjs` to the final site URL (e.g. `https://<user>.github.io/<repo>/` or custom domain). Enable "Enforce HTTPS" in repository Settings → Pages. |
| **Rationale** | PRD FR18; Research §4.4–4.5. |
| **Consequences** | All routes are pre-rendered; result pages exist as static HTML at `/result/[slug]` for each list entry if we generate them at build, or result is rendered client-side after search with shareable URL. Clean URLs and `site` are required for canonical and social meta. |
| **Traceability** | PRD FR18; Research §4.4–4.5. |

---

### ADR-4: Attribution (CC BY-SA 4.0)

| Field | Content |
|-------|---------|
| **Title** | Attribution: source link + license link in UI and footer |
| **Status** | Accepted |
| **Decision** | Show one-line definition and source on every result view (e.g. "We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."). Provide visible links: (1) source = Wikipedia US list page URL, (2) license = CC BY-SA 4.0 URL. Place in result block and in footer on all pages. Include definition (and implicitly source) in the shareable/copyable one-line. |
| **Rationale** | PRD FR11–FR12; Research §2.5, §5.2; UX §Attribution. |
| **Consequences** | Footer and result block components must each include source + license links; copy text must include definition. |
| **Traceability** | PRD FR11–FR12; Research §2.5, §5.2. |

---

### ADR-5: URLs & SEO

| Field | Content |
|-------|---------|
| **Title** | Clean URLs and SEO for result pages |
| **Status** | Accepted |
| **Decision** | Result pages use clean URLs: `/result/[slug]` (e.g. `/result/chumbawamba`). Slug is URL-safe identifier derived from artist (or primary key) in the data model. Each result page is indexable static HTML with descriptive title and meta (e.g. "[Artist] – One-Hit Wonder? | IsItAOneHitWonder"). Generate static pages at build for each list entry so direct and shared links work without client-side search. |
| **Rationale** | PRD Web App § SEO; UX § Platform Strategy, shareable URLs. |
| **Consequences** | Build must generate one HTML page per list entry (or use dynamic route with static prerender). Search flow: submit → resolve slug from client search → navigate to `/result/[slug]`. |
| **Traceability** | PRD Web App § SEO; UX § Platform Strategy. |

---

### ADR-6: Accessibility

| Field | Content |
|-------|---------|
| **Title** | WCAG 2.1 Level AA; keyboard and screen reader support |
| **Status** | Accepted |
| **Decision** | Meet WCAG 2.1 Level AA where feasible. Search input and submit button: keyboard-operable, visible focus indicators, associated label (e.g. "Search by artist or song"). Copy button: keyboard-operable, accessible name (e.g. "Copy one line"), clear feedback (e.g. "Copied") visible and/or announced (aria-live). Heading structure and landmarks (main, footer) so screen readers can navigate to search, result content (verdict, one hit, definition, source), and copy. Touch targets ≥44px. No reliance on color alone. |
| **Rationale** | PRD NFR-A1–A4; UX § Accessibility. |
| **Traceability** | PRD NFR-A1–A4; UX § Accessibility. |

---

### ADR-7: Error Handling & No Match

| Field | Content |
|-------|---------|
| **Title** | Graceful no-match and fetch failure |
| **Status** | Accepted |
| **Decision** | **No match:** When client-side search finds no (or low-confidence) match, show result page with verdict "No" or "Not on our list," same one-line definition and source as for "Yes," and no "one hit" line. **Fetch failure:** In CI, fetch step uses `continue-on-error: true`; on failure, build uses last successfully cached JSON so site deploys unchanged. No site break; optional logging/monitoring for failed fetches. |
| **Rationale** | PRD FR13–FR14, FR17; Research §2.4. |
| **Traceability** | PRD FR13–FR14, FR17. |

---

### ADR-8: Share / Copy

| Field | Content |
|-------|---------|
| **Title** | One-line share: verdict + definition + one hit; clipboard API |
| **Status** | Accepted |
| **Decision** | Shareable one-line format: `"{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist]."}` Example: "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping." Provide a "Copy one line" (or equivalent) button on result page that writes this string to clipboard via Clipboard API; show clear feedback (e.g. "Copied") for a few seconds. Optional: Web Share API where available. |
| **Rationale** | PRD FR9–FR10; UX § Copy button. |
| **Traceability** | PRD FR9–FR10; UX § Copy button. |

---

### Data Model & Build Pipeline Summary

**Data model (per entry):**

- `artist` (string), `song` (string), `year` (string or number), `slug` (string, URL-safe, unique). Optional: normalized fields for search (e.g. lowercase artist/song).

**Search index structure:**

- Either: single JSON array of `{ artist, song, year, slug }` (and any normalized fields) loaded at runtime and searched with Fuse.js/MiniSearch; or pre-built MiniSearch index serialized and loaded. Slug is used for navigation to `/result/[slug]`.

**Build pipeline (order):**

1. Fetch: call MediaWiki API, get raw wikitext.
2. Parse: extract artist–song–year rows; assign slug per entry; output JSON to `src/data/one-hit-wonders.json` (or path consumed by Astro).
3. Build: Astro build reads JSON, generates static pages for `/` and `/result/[slug]` for each entry (or equivalent).
4. Deploy: upload `dist/` to GitHub Pages.
5. Scheduled: workflow runs weekly; fetch → parse → build → deploy; fetch step has `continue-on-error: true`.

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical conflict points:** Naming (routes, components, data fields), structure (where data/scripts/components live), formats (JSON, shareable line), process (loading, no-match, copy feedback).

### Naming Patterns

**Route / URL naming:**

- Result pages: `/result/[slug]`; slug is URL-safe, lowercase, derived from artist (e.g. `chumbawamba`). Use consistent slug generation (e.g. slugify artist name) so search and direct links match.

**Code / file naming:**

- Components: PascalCase (e.g. `SearchForm.astro`, `ResultBlock.astro`, `CopyButton.astro`, `Footer.astro`). Files match component name.
- Data: `one-hit-wonders.json` (or equivalent) in `src/data/`; JSON fields: `artist`, `song`, `year`, `slug` (camelCase or snake_case—pick one and use consistently).
- Scripts: fetch/parse script (e.g. `scripts/fetch-list.js` or `scripts/build-data.js`) can be Node or Astro-integrated; name clearly.

**API / data:**

- No runtime API for list data; JSON is the contract. Field names in JSON must match what the client/search expects (e.g. `artist`, `song`, `year`, `slug`).

### Structure Patterns

**Project organization:**

- `src/pages/`: `index.astro` (home/search), `result/[slug].astro` (or `result/[...slug].astro` if needed).
- `src/components/`: search form, result block, copy button, footer (and shared layout if any).
- `src/data/`: build-time JSON (e.g. `one-hit-wonders.json`); consumed by Astro at build.
- `src/layouts/`: base layout (optional).
- `scripts/` or `scripts/`: fetch/parse script run in CI before build (outside `src/` if not part of Astro).
- `public/`: static assets; design tokens or global CSS as needed.

**File structure:**

- Config: `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json` at root.
- CI: `.github/workflows/deploy.yml` (or equivalent) runs fetch → build → deploy.

### Format Patterns

**JSON (list data):**

- One format for the list file: array of objects with `artist`, `song`, `year`, `slug` (and any normalized fields). Use one convention (camelCase or snake_case) and stick to it.

**Shareable one-line:**

- Format: `"{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist]."}`  
- Example Yes: `"Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping."`  
- Example No: `"No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US)."`  
- Definition reference must be present in both Yes and No cases.

### Process Patterns

**Loading state (search):**

- On submit: show loading/transition (e.g. disabled submit + "Searching…" or spinner) until result page or result content appears. Result within ~2s (NFR-P2).

**No-match:**

- Not an error. Same result layout: verdict "No" or "Not on our list"; same definition and source; no "one hit" line. No error tone.

**Copy feedback:**

- After copy: show "Copied" (or equivalent) for 2–3 seconds, then revert. Prefer visible text and/or aria-live for screen readers.

**Error (rare):**

- If client-side search fails unexpectedly: short message + "Try again" and focus back to search. Do not break layout.

### Enforcement Guidelines

**All implementation agents MUST:**

- Use the same slug scheme for result URLs and for resolving from search (so `/result/chumbawamba` is the canonical result for Chumbawamba).
- Include definition and source in the shareable one-line and in the result block and footer.
- Use `continue-on-error: true` on the fetch step in CI so build succeeds with cached data on API failure.
- Respect UX: no purple/blue as primary; touch targets ≥44px; WCAG AA for search and copy.

**Pattern enforcement:**

- Verify: slug generation in data pipeline matches route param; shareable line includes definition; footer and result block both show source + license links.
- Document any deviation in implementation notes or ADR follow-ups.

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
IsItAOneHitWonder/
├── README.md
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml
├── scripts/
│   └── fetch-one-hit-wonders.js
├── src/
│   ├── data/
│   │   └── one-hit-wonders.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── result/
│   │       └── [slug].astro
│   ├── components/
│   │   ├── SearchForm.astro
│   │   ├── ResultBlock.astro
│   │   ├── CopyButton.astro
│   │   └── Footer.astro
│   └── styles/
│       └── global.css
├── public/
│   └── (static assets if any)
└── dist/
    └── (build output; do not commit)
```

**Notes:**

- `src/data/one-hit-wonders.json` is produced by `scripts/fetch-one-hit-wonders.js` (or equivalent) before `astro build`; can be committed as fallback or generated only in CI.
- `result/[slug].astro` uses `getStaticPaths()` to generate one static page per list entry from the JSON.
- Search can be implemented as client-side script (e.g. Fuse.js/MiniSearch) in `index.astro` or a small island; on match, navigate to `/result/[slug]`.

### Architectural Boundaries

**API boundaries:**

- No runtime API for list data. External: MediaWiki API (fetch script only, in CI).

**Component boundaries:**

- **SearchForm:** Input + submit; triggers client-side search and navigation to `/result/[slug]` or no-match result.
- **ResultBlock:** Displays verdict, one hit (when Yes), definition, source; read-only.
- **CopyButton:** Reads shareable line (from result context or page); writes to clipboard; shows feedback.
- **Footer:** Source link + license link (and optional "How we define it"); site-wide.

**Data boundaries:**

- List data: single JSON file; produced at build (or in CI); consumed by Astro at build for static paths and by client for search.
- No database; no runtime server for list data.

### Requirements to Structure Mapping

| Requirement area | Location |
|------------------|----------|
| FR1–FR4 (search) | `SearchForm.astro`, client search script, `src/data/one-hit-wonders.json` |
| FR5–FR8 (result) | `ResultBlock.astro`, `result/[slug].astro` |
| FR9–FR10 (copy/share) | `CopyButton.astro`, shareable line format |
| FR11–FR12 (attribution) | `ResultBlock.astro`, `Footer.astro` |
| FR13 (no match) | `result/[slug].astro` (no-match state or dedicated no-match route), `ResultBlock.astro` |
| FR14–FR17 (pipeline) | `scripts/fetch-one-hit-wonders.js`, `src/data/one-hit-wonders.json`, `.github/workflows/deploy.yml` |
| FR18–FR19 (HTTPS, browsers) | GitHub Pages config, `astro.config.mjs` `site`, browser matrix |

### Integration Points

**Internal:**

- Home page: SearchForm submits → client search over JSON → navigate to `/result/[slug]` or show no-match.
- Result page: loads static HTML for slug; CopyButton uses verdict + definition + one hit from page context.

**External:**

- MediaWiki API: called only by fetch script in CI (or local pre-build).
- GitHub Pages: receives `dist/` from workflow.

**Data flow:**

- CI: fetch → parse → write JSON → `astro build` reads JSON → static pages + JSON in `dist/` (or inlined). Client: load page → load JSON (or index) → search on user input → navigate or show no-match.

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision compatibility:** Data pipeline (MediaWiki API → JSON) feeds build; build produces static pages and JSON for client search. Search (Fuse.js or MiniSearch) uses same JSON/slug scheme as result routes. Deployment (GitHub Pages, `site`) matches URL scheme. Attribution, URLs/SEO, accessibility, error handling, and share/copy are aligned with PRD and UX.

**Pattern consistency:** Naming (slug, components, JSON fields) and structure (src/pages, src/components, src/data, scripts) support the decisions. Shareable line format and process patterns (loading, no-match, copy feedback) are consistent.

**Structure alignment:** Project tree supports Astro static output, fetch script, build-time JSON, and client-side search; boundaries between components and data are clear.

### Requirements Coverage Validation ✅

**Functional requirements (FR1–FR19):**

- FR1–FR4: Search by artist/song, single search control, lookup against dataset without runtime API → client-side search on build-time JSON; SearchForm; ResultBlock/result page.
- FR5–FR8: Verdict, one hit, definition/source always visible, single coherent view → ResultBlock, result page layout.
- FR9–FR10: One-line share/copy from result view → CopyButton, shareable line format.
- FR11–FR12: Source and definition in UI; CC BY-SA 4.0 in footer → ResultBlock, Footer.
- FR13–FR14: No-match with same definition/source; fetch failure → cached data → no-match result state; fetch step continue-on-error.
- FR15–FR17: MediaWiki API ingest, parse, schedule refresh, client-side lookup → scripts/fetch, JSON, CI, client search.
- FR18–FR19: HTTPS, browsers → GitHub Pages, astro.config `site`, browser matrix.

**Non-functional requirements:**

- NFR-P1–P3: FCP, search within 2s, list at load time → static HTML, client search on loaded JSON.
- NFR-S1–S2: HTTPS only; no user/payment data → GitHub Pages HTTPS; no auth.
- NFR-A1–A4: WCAG AA, keyboard, labels, landmarks → ADR-6, UX patterns.
- NFR-I1–I2: Fetch in pipeline, continue-on-error, scheduled refresh → CI workflow, fetch script.

### Implementation Readiness Validation ✅

**Decision completeness:** All eight decision areas (data pipeline, search, deployment, attribution, URLs/SEO, accessibility, error handling, share/copy) are documented with ADR-style context, decision, rationale, and traceability.

**Structure completeness:** Project tree and requirements-to-structure mapping are specific; component and data boundaries are defined.

**Pattern completeness:** Naming, structure, format, and process patterns are defined; enforcement guidelines and conflict points are stated.

### Gap Analysis Results

- **Critical gaps:** None. All FRs and NFRs are covered; data pipeline, search, deployment, attribution, error handling, and share/copy are specified.
- **Important:** Fuse.js vs MiniSearch is a deliberate trade-off; implementation chooses one and documents it. Wikitext parsing details (regex/patterns) are implementation-specific; architecture requires custom parser for known list structure.
- **Nice-to-have:** Optional "How we define it" page/link (PRD optional); Web Share API (UX optional).

### Architecture Completeness Checklist

**✅ Requirements analysis**

- [x] Project context analyzed (FRs, NFRs, UX, Research)
- [x] Scale and complexity assessed (low, static MPA)
- [x] Technical constraints and cross-cutting concerns mapped

**✅ Architectural decisions**

- [x] Data pipeline, search, deployment, attribution, URLs/SEO, accessibility, error handling, share/copy documented (ADR-1–ADR-8)
- [x] Data model and build pipeline summarized
- [x] Traceability to PRD, UX, Research

**✅ Implementation patterns**

- [x] Naming, structure, format, process patterns defined
- [x] Enforcement guidelines and conflict points stated

**✅ Project structure**

- [x] Directory structure and boundaries defined
- [x] Requirements-to-structure mapping complete
- [x] Integration points and data flow described

### Architecture Readiness Assessment

**Overall status:** READY FOR IMPLEMENTATION

**Confidence level:** High — PRD FR1–FR19 and NFRs are satisfied; UX components (search form, result block, copy button, footer) and research recommendations (MediaWiki API, weekly refresh, build-time JSON, client-side search) are reflected in decisions and structure.

**Key strengths:**

- Single source of truth for data pipeline, search, deployment, attribution, error handling, and share/copy.
- Clear slug/URL scheme and shareable one-line format for epics/stories and implementation agents.
- Traceability from ADRs to PRD, UX, and Research.

**Areas for future enhancement:**

- Optional "How we define it" page; Web Share API; monitoring/alerting for fetch failures.

### Implementation Handoff

**AI agent guidelines:**

- Follow ADR-1–ADR-8 and the implementation patterns; respect project structure and boundaries.
- Use this document for all architectural questions; do not introduce runtime API for list data or change shareable line format without updating this doc.

**First implementation priority:**

1. Initialize Astro project (see Starter Template Evaluation).
2. Implement fetch/parse script and produce `src/data/one-hit-wonders.json`.
3. Add CI workflow: fetch (continue-on-error) → build → deploy to GitHub Pages.
4. Implement home page (SearchForm) and client-side search; result page (`result/[slug].astro`) and ResultBlock, CopyButton, Footer.
