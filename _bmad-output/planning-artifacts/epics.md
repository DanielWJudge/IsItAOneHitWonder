---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# IsItAOneHitWonder - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for IsItAOneHitWonder, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User can search by artist name to determine whether the artist is on the Wikipedia US one-hit wonder list.

FR2: User can search by song title to determine whether the song (and its artist) is on the Wikipedia US one-hit wonder list.

FR3: User can trigger search from a single, prominent search control on the main page.

FR4: System performs lookup against the Wikipedia US one-hit wonder dataset (no runtime API call for list data).

FR5: User sees a clear Yes or No verdict indicating whether the searched artist/song is on the list.

FR6: When the answer is Yes, user sees the exact "one hit" in the form "The one hit: [Song] – [Artist]" on the result view.

FR7: User sees a one-line definition of "one-hit wonder" and the source (Wikipedia US list) on every result view, without having to open another page or control.

FR8: User sees the verdict, the one hit (when Yes), and the definition/source in a single, coherent result view.

FR9: User can copy or share one compact text line that includes the verdict, the definition/source reference, and (when Yes) the one hit (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.").

FR10: The shareable/copyable line is available from the result view (e.g. via a copy or share action).

FR11: User can see the data source (Wikipedia US one-hit wonder list) and a short definition (e.g. one top-40 hit in the US) in the UI on result views.

FR12: User can see CC BY-SA 4.0 attribution (source link and license link) on the site (e.g. in footer or dedicated attribution area).

FR13: When no match (or no confident match) is found for the search, user sees a clear "No" or "Not on our list" outcome, with the same one-line definition and source visible so the meaning of "not on list" is clear.

FR14: When the Wikipedia list cannot be fetched during build, the system builds and deploys using the last successfully cached list data so the site remains usable.

FR15: System ingests the Wikipedia US one-hit wonder list via the MediaWiki API (no scraping) and parses it into structured artist/song/year (or equivalent) for lookup.

FR16: System refreshes the list on a defined schedule (e.g. weekly via GitHub Actions) and rebuilds the site with the updated data when fetch succeeds.

FR17: System makes the parsed list available for client-side lookup without a server round-trip for list data.

FR18: User can access the site over HTTPS.

FR19: User can use the core search and result experience on common mobile and desktop browsers (with a defined browser support policy); optional: graceful degradation or message when JS is disabled.

### NonFunctional Requirements

**Performance**

NFR-P1: The main page (search) reaches first contentful paint within 3 seconds on a typical 4G mobile connection.

NFR-P2: After the page has loaded, search results are shown within 2 seconds of the user submitting a query (client-side search).

NFR-P3: List data is available at load time (embedded or fetched once with the page); no blocking runtime call to an external API for list data during a user search.

**Security**

NFR-S1: The site is served only over HTTPS (no mixed content, no HTTP fallback for the main experience).

NFR-S2: The site does not collect, store, or transmit user account data or payment data; no authentication or payment flows in v1.

**Accessibility**

NFR-A1: The site meets WCAG 2.1 Level AA where feasible for the search flow and result view (contrast, focus order, text alternatives, and keyboard access).

NFR-A2: Search input and the primary action that triggers search are keyboard-operable and have visible focus indicators.

NFR-A3: The action that copies or shares the one-line result is keyboard-operable and has an accessible name (e.g. label or aria-label).

NFR-A4: Heading structure and landmarks allow screen-reader users to navigate to search, result content (verdict, one hit, definition/source), and copy/share.

**Integration**

NFR-I1: The build pipeline fetches the Wikipedia US one-hit wonder list via the MediaWiki API; on fetch failure, the build uses the last successfully cached list so the site still builds and deploys.

NFR-I2: List refresh runs on a defined schedule (e.g. weekly); the deployed site reflects the most recently successful fetch or the cached dataset.

### Additional Requirements

**From Architecture**

- **Starter template:** Architecture specifies Astro starter: `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm install`, `npx astro add tailwind`. Epic 1 Story 1 must be "Set up initial project from starter template."
- Deploy Astro static output to GitHub Pages; set `site` in astro.config.mjs to the final site URL (e.g. GitHub Pages or custom domain); enable Enforce HTTPS in repository Settings.
- Data pipeline: Fetch via MediaWiki Action API, parse wikitext to artist/song/year/slug, output JSON to e.g. `src/data/one-hit-wonders.json`; run fetch in CI before build; use `continue-on-error: true` on the fetch step so build proceeds with cached data if API fails; schedule weekly (e.g. Sunday midnight UTC).
- Client-side search: Fuse.js or MiniSearch on build-time JSON; resolve to `/result/[slug]`; slug is URL-safe, derived from artist; same slug scheme for search and static result pages.
- Result pages: Clean URLs `/result/[slug]`; generate static pages at build for each list entry; descriptive title and meta (e.g. "[Artist] – One-Hit Wonder? | IsItAOneHitWonder").
- Attribution: One-line definition and source on every result view; source link + CC BY-SA 4.0 license link in result block and in footer; shareable one-line includes definition.
- No-match: Show verdict "No" or "Not on our list" with same one-line definition and source; no "one hit" line. Fetch failure: build with last cached JSON; no site break.
- Shareable one-line format: `"{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist]."}`; Copy button writes to clipboard via Clipboard API; show "Copied" feedback.
- Project structure: `src/pages/index.astro`, `src/pages/result/[slug].astro`, `src/components/` (SearchForm, ResultBlock, CopyButton, Footer), `src/data/one-hit-wonders.json`, `scripts/` for fetch/parse, `.github/workflows/deploy.yml`.

**From UX Design**

- Mobile-first layout; touch targets for search submit, copy, and share at least 44px; single-column layout; max-width for readability on desktop.
- WCAG 2.1 Level AA: contrast, visible focus indicators, keyboard-operable search and copy, accessible names (e.g. "Copy one line"), copy feedback visible and/or announced (e.g. aria-live).
- No purple/blue as primary color; use design tokens (e.g. Tailwind) for color, type scale, spacing; primary palette not purple/blue-dominated.
- Loading state on search submit (e.g. disabled + "Searching…" or spinner) until result page or content appears; result within ~2s.
- No-match: Same result layout as success—verdict "No" or "Not on our list," same definition and source; no error tone.
- Copy button: Primary action on result page; label "Copy one line"; feedback "Copied" for 2–3 seconds then revert; keyboard-operable.
- Shareable URLs: Result pages at `/result/[slug]`; direct links render same content; SEO-friendly titles/meta for shared links and search landers.
- Component patterns: Search form (one input + submit); result block (verdict, one hit when Yes, definition, source); footer (source link, license link, optional "How we define it").

### FR Coverage Map

FR1: Epic 2 - Search by artist name
FR2: Epic 2 - Search by song title
FR3: Epic 2 - Single prominent search control on main page
FR4: Epic 2 - Lookup against build-time dataset (no runtime API)
FR5: Epic 2 - Clear Yes/No verdict on result view
FR6: Epic 2 - "The one hit: [Song] – [Artist]" when Yes
FR7: Epic 2 - One-line definition and source on every result view
FR8: Epic 2 - Verdict, one hit, definition/source in single coherent view
FR9: Epic 3 - Copy or share one compact line including verdict and definition
FR10: Epic 3 - Copy/share action available from result view
FR11: Epic 2 - Data source and short definition visible in UI on result views
FR12: Epic 2 - CC BY-SA 4.0 (source + license links) in footer/attribution area
FR13: Epic 2 - No-match shows "No" or "Not on our list" with same definition/source
FR14: Epic 1 - Build/deploy with cached data when fetch fails
FR15: Epic 1 - Ingest list via MediaWiki API and parse to structured data
FR16: Epic 1 - Scheduled refresh and rebuild when fetch succeeds
FR17: Epic 1 - Parsed list available for client-side lookup (no server round-trip)
FR18: Epic 1 - Site accessible over HTTPS
FR19: Cross-cutting (browser support; applied across Epic 2/3 implementation)

## Epic List

### Epic 1: Data pipeline and deploy
Users (and the product) have a live site on GitHub Pages (HTTPS) with the Wikipedia US one-hit wonder data fetched, parsed, and available at build time; weekly refresh with graceful fallback when fetch fails.
**FRs covered:** FR14, FR15, FR16, FR17, FR18.

### Epic 2: Search and result experience
Users can search by artist or song from a single search control and see a result page with a clear Yes/No verdict, "The one hit: [Song] – [Artist]" when Yes, one-line definition and source always visible, and CC BY-SA 4.0 attribution in the result and footer; no-match shows "No" or "Not on our list" with the same definition and source.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR11, FR12, FR13.

### Epic 3: Share and copy
Users can copy or share one compact line from the result page that includes the verdict, definition/source reference, and (when Yes) the one hit.
**FRs covered:** FR9, FR10.

---

## Epic 1: Data pipeline and deploy

Users (and the product) have a live site on GitHub Pages (HTTPS) with the Wikipedia US one-hit wonder data fetched, parsed, and available at build time; weekly refresh with graceful fallback when fetch fails.

### Story 1.1: Set up initial project from starter template

As a developer,
I want the project initialized from the Astro minimal starter with TypeScript and Tailwind,
So that the codebase has a standard structure, build, and styling foundation for the static site.

**Acceptance Criteria:**

**Given** the project root is empty or ready for init  
**When** I run `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm install`, then `npx astro add tailwind`  
**Then** the project has `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `src/pages/`, `src/components/`, and `src/layouts/` (or equivalent)  
**And** `astro dev` and `astro build` run successfully  
**And** Tailwind utilities are available for styling

### Story 1.2: Implement fetch and parse script for Wikipedia one-hit wonder list

As a developer,
I want a script that fetches the Wikipedia US one-hit wonder list via the MediaWiki API and parses it into structured data,
So that the product has a single source of list data without scraping.

**Acceptance Criteria:**

**Given** the MediaWiki API is available  
**When** the fetch script runs (e.g. `node scripts/fetch-one-hit-wonders.js` or equivalent)  
**Then** it requests the list page via the Action API (`action=query`, `prop=revisions`, `rvprop=content`, `titles=List_of_one-hit_wonders_in_the_United_States`)  
**And** it parses the raw wikitext into rows with artist, song, and year (or equivalent)  
**And** it assigns a URL-safe slug per entry (e.g. derived from artist name)  
**And** it outputs structured JSON (e.g. array of `{ artist, song, year, slug }`) to a file (e.g. `src/data/one-hit-wonders.json`)  
**And** the script does not scrape; it uses the API only (FR15)

### Story 1.3: Wire build-time JSON into Astro and static output

As a developer,
I want the parsed list JSON to be consumed at Astro build time and available for static generation,
So that the site can generate result pages and the client can load list data without a server round-trip.

**Acceptance Criteria:**

**Given** `src/data/one-hit-wonders.json` exists (from Story 1.2 or committed fallback)  
**When** `astro build` runs  
**Then** Astro reads the JSON (e.g. from `src/data/one-hit-wonders.json`)  
**And** the build completes without requiring a runtime API call for list data (FR17)  
**And** the built output includes the list data (e.g. in `dist/` or inlined where consumed) so client-side search can use it

### Story 1.4: Add CI workflow with fetch, build, and deploy to GitHub Pages

As a developer,
I want a GitHub Actions workflow that runs the fetch script, then builds and deploys the site to GitHub Pages,
So that the site is updated on a schedule and remains usable when the API fetch fails.

**Acceptance Criteria:**

**Given** the repo has a workflow file (e.g. `.github/workflows/deploy.yml`)  
**When** the workflow runs (on push to main or on schedule)  
**Then** it runs the fetch script first  
**And** the fetch step uses `continue-on-error: true` so a failed fetch does not fail the job (FR14, NFR-I1)  
**And** the workflow runs `npm run build` (or equivalent) so the build uses cached JSON if fetch failed  
**And** the workflow deploys the build output (e.g. `dist/`) to GitHub Pages  
**And** the workflow is scheduled weekly (e.g. `0 0 * * 0` UTC) or documented for manual/scheduled runs (FR16, NFR-I2)

### Story 1.5: Configure site URL and HTTPS for GitHub Pages

As a visitor,
I want to access the site over HTTPS with the correct base URL,
So that the site is secure and links and assets resolve correctly.

**Acceptance Criteria:**

**Given** the Astro project is configured for static output  
**When** the site is deployed to GitHub Pages  
**Then** `site` in `astro.config.mjs` (or equivalent) is set to the final site URL (e.g. `https://<user>.github.io/<repo>/` or custom domain)  
**And** the repository has "Enforce HTTPS" enabled in Settings → Pages (FR18, NFR-S1)  
**And** the deployed site loads over HTTPS with no mixed content warnings

---

## Epic 2: Search and result experience

Users can search by artist or song from a single search control and see a result page with a clear Yes/No verdict, "The one hit: [Song] – [Artist]" when Yes, one-line definition and source always visible, and CC BY-SA 4.0 attribution in the result and footer; no-match shows "No" or "Not on our list" with the same definition and source.

**Implementation order:** Implement Stories 2.1 → 2.3 (Yes result) → 2.4 (no-match view) → 2.2 (search + routing to both) → 2.5. Story 2.4 delivers the no-match view to which Story 2.2 navigates when there is no match or no confident match.

**Browser support:** Last 2 versions of Chrome, Firefox, Safari, and Edge (per FR19). No IE11.

**JS-off behavior:** JS-off fallback is deferred for MVP; no explicit message or static fallback. Revisit post-launch if needed.

### Story 2.1: Home page with single prominent search control

As a user,
I want a single, prominent search control on the main page,
So that I can quickly enter an artist or song and trigger a search.

**Acceptance Criteria:**

**Given** I am on the home page (e.g. `/`)  
**When** the page has loaded  
**Then** I see one primary search control (input + submit or equivalent) above the fold  
**And** the control is labeled or has an accessible name (e.g. "Search by artist or song") (FR3, NFR-A2)  
**And** the search input and submit are keyboard-operable with visible focus indicators (NFR-A2)  
**And** touch targets for the input and submit are at least 44px (UX)

### Story 2.2: Client-side search by artist or song and navigation to result

As a user,
I want to search by artist name or song title and be taken to a result page or no-match state,
So that I can find out whether an artist/song is on the Wikipedia US one-hit wonder list.

**Acceptance Criteria:**

**Given** I am on the home page and the list data (or search index) is loaded  
**When** I enter an artist name or song title and submit (Enter or tap/click Search)  
**Then** the system performs lookup against the build-time dataset only (no runtime API call for list data) (FR1, FR2, FR4)  
**And** if there is a match, I am navigated to the result page for that entry (e.g. `/result/[slug]`)  
**And** if there is no match (or no confident match), I am navigated to the no-match view (delivered by Story 2.4; implement 2.4 before 2.2 per Epic 2 implementation order)  
**And** search results are shown within 2 seconds of submit on typical hardware (NFR-P2)  
**And** a loading state (e.g. "Searching…" or disabled submit) is shown until the result is shown (UX)

### Story 2.3: Result page with verdict, one hit, definition, and source

As a user,
I want the result page to show a clear Yes/No verdict, "The one hit: [Song] – [Artist]" when Yes, and the one-line definition and source in one view,
So that I have the full answer and its source without opening another page.

**Acceptance Criteria:**

**Given** I have navigated to a result page for a list entry (e.g. `/result/chumbawamba`)  
**When** the page is displayed  
**Then** I see a clear Yes verdict and the line "The one hit: [Song] – [Artist]" (e.g. "The one hit: Tubthumping – Chumbawamba") (FR5, FR6)  
**And** I see a one-line definition of "one-hit wonder" and the source (Wikipedia US list) on the same view without opening another page or control (FR7, FR11)  
**And** the verdict, one hit, definition, and source appear in a single, coherent result block (FR8)  
**And** the page has a descriptive title and meta suitable for SEO (e.g. "[Artist] – One-Hit Wonder? | IsItAOneHitWonder") (Architecture ADR-5)  
**And** heading structure and landmarks allow screen-reader users to navigate to verdict, one hit, definition, and source (NFR-A4)

### Story 2.4: No-match result state

As a user,
I want to see a clear "No" or "Not on our list" outcome with the same definition and source visible when my search does not match,
So that I understand the result is "not on this list" rather than an error.

*This view is the destination when Story 2.2's search finds no match; implement before Story 2.2 per Epic 2 implementation order.*

**Acceptance Criteria:**

**Given** I have submitted a search that has no match (or no confident match)  
**When** the no-match result is shown  
**Then** I see a verdict of "No" or "Not on our list" (FR13)  
**And** I see the same one-line definition and source as on a "Yes" result (FR13)  
**And** there is no "one hit" line (only for Yes results)  
**And** the tone is neutral and informative, not an error message (UX)

### Story 2.5: Footer and CC BY-SA 4.0 attribution

As a user,
I want to see the data source and CC BY-SA 4.0 license (source link and license link) on the site,
So that I can verify attribution and reuse terms.

**Acceptance Criteria:**

**Given** I am on any page (home or result)  
**When** I view the footer (or dedicated attribution area)  
**Then** I see a link to the Wikipedia US one-hit wonder list (source) and a link to the CC BY-SA 4.0 license (FR12)  
**And** the links have descriptive text (e.g. "Source: Wikipedia US list", "CC BY-SA 4.0") and are keyboard-operable with visible focus (NFR-A4, UX)

---

## Epic 3: Share and copy

Users can copy or share one compact line from the result page that includes the verdict, definition/source reference, and (when Yes) the one hit.

### Story 3.1: Copy one line button and shareable line format

As a user,
I want to copy (or share) one compact line from the result page that includes the verdict, definition reference, and when Yes the one hit,
So that I can paste or share the answer with its source in one line.

**Acceptance Criteria:**

**Given** I am on a result page (Yes or No)  
**When** the page is displayed  
**Then** I see a primary action to copy the shareable line (e.g. "Copy one line" button) (FR10)  
**When** I activate the copy action (click, tap, or keyboard)  
**Then** the system writes the shareable line to the clipboard via the Clipboard API (FR9)  
**And** the line format is: "{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist].}" (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.") (FR9, Architecture ADR-8)  
**And** for a No result, the line includes the verdict and definition reference (e.g. "No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US).")  
**And** clear feedback is shown after copy (e.g. "Copied" for 2–3 seconds then revert) (UX)  
**And** the copy action is keyboard-operable and has an accessible name (e.g. "Copy one line" or aria-label) (NFR-A3)  
**And** the copy button has a minimum touch target of 44px (UX)
