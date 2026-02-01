---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-IsItAOneHitWonder-2026-02-01.md
  - _bmad-output/planning-artifacts/research/technical-domain-isit-a-one-hit-wonder-v1-research-2026-02-01.md
  - _bmad-output/brainstorming/brainstorming-session-2026-02-01.md
documentCounts:
  briefCount: 1
  researchCount: 1
  brainstormingCount: 1
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - IsItAOneHitWonder

**Author:** DJ
**Date:** 2026-02-01

## Executive Summary

**Vision:** IsItAOneHitWonder.com does one job: search by song or artist → Yes/No verdict, "The one hit: [Song] – [Artist]," and a one-line definition with source always visible. Data comes from the Wikipedia US one-hit wonder list. v1 is US-only, static (Astro on GitHub Pages, HTTPS), with build-time data and client-side search.

**Differentiator:** Transparency is product—definition and source (Wikipedia US list) are first-class in the UI and in the shareable one-line, not behind a link. Share/copy produces one compact line that includes the definition.

**Target users:** Music fans and trivia buffs (search → answer → share); Wikipedia editors and attribution-minded users (visible source and CC BY-SA 4.0); one-hit wonder artists or fans (straight, neutral answer).

---

## Success Criteria

### User Success

- **Core job:** User can search by song or artist and get a **correct Yes/No verdict**.
- **Answer completeness:** When the answer is Yes, user sees **"The one hit: [Song] – [Artist]"** clearly on the result page.
- **Transparency:** User sees the **one-line definition and source** (Wikipedia US list) **always visible** on the result page—no "click to see how we define it."
- **Shareability:** User can **copy or share one compact line** that includes the definition (e.g. *"Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping."*).

**Success moment:** User completes search → result → (optional) share with definition in one line.

### Business Success

- **v1 (ship fast, then validate):**
  - Site is **live on GitHub Pages with HTTPS**.
  - Data pipeline runs (Wikipedia API fetch, parse, build-time JSON); **weekly refresh** succeeds or fails gracefully (no site break).
  - **No critical errors** blocking search or result display.
  - Optional: evidence that the product is used (e.g. traffic, shares) to **inform v2 prioritization**.
- v1 has **no revenue or growth targets**; success is delivery of the one job and a stable, transparent experience.

### Technical Success

- **Data pipeline:** MediaWiki API ingest (no scraping), wikitext parse to artist/song/year, build-time JSON, weekly refresh via GitHub Actions with graceful fallback on fetch failure.
- **Search:** Client-side search on build-time data; correct verdict for all list entries.
- **Deploy:** Static site on GitHub Pages with HTTPS; CC BY-SA 4.0 attribution visible.

### Measurable Outcomes

| Outcome | Target (v1) |
|--------|-------------|
| Search returns correct Yes/No for entries on the Wikipedia US list | 100% for list coverage |
| Result page shows verdict + one hit + one-line definition; share/copy includes definition | Always |
| Build/deploy and weekly data refresh | Complete, or fail with cached data and no site break |
| Optional: track visits or shares if analytics added | Used to inform v2 scope |

---

## Product Scope

### MVP – Minimum Viable Product (v1)

- **Data pipeline:** MediaWiki API fetch, wikitext parse, build-time JSON, weekly GitHub Actions refresh, graceful fallback on fetch failure.
- **Single search → result page:** Artist or song search; verdict (Yes/No); hero line "The one hit: [Song] – [Artist]"; one short line with definition and source always visible (e.g. *"We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."*).
- **Share:** Copy/share produces one compact line that includes the definition.
- **Deploy:** Astro static site on GitHub Pages with HTTPS; CC BY-SA 4.0 attribution visible.
- **Optional:** Short "How we define it" (or equivalent) for edge cases (solo vs band, multiple acts, "signature song") and list caveats.

**MVP success:** User can search, get correct Yes/No + one hit + definition, and share one compact line with definition; site is live with pipeline and weekly refresh (or graceful fallback); no critical errors.

### Growth Features (Post-MVP / v2+)

- **Quiz:** "One-hit or not?" or "Name the one-hit wonder" by decade.
- **Regions:** UK (and other) lists; optional IP/locale detection and "Using the [US/UK] list."
- **Paste link:** Spotify/Apple/YouTube URL → parse, fetch, answer.
- **Playlist builder:** Pick from list (decade, vibe, random N) → export/open in Spotify/Apple.
- **Song of the week:** Curated one-hit wonder on front page or sidebar.
- **Newsletter:** "This week in one-hit wonder history" (chart dates + artist/song).
- **API / bots:** Same core "Is X a one-hit wonder?" as a service (Slack/Discord bot, Alexa skill).
- **Richer context:** Song summary, artist details, related artists; optional "Also on these playlists" or other sources.

### Vision (Future)

- Multiple definitions (e.g. Wikipedia vs Billboard) for power users; optional "Why this list?"
- Shazam-style identify-then-answer if paste-link validates demand.
- Recurring engagement (newsletter, song of the week, quiz) to build habit and backlog for v2+.

---

## User Journeys

### Journey 1: Music fan / party goer (primary – success path)

**Opening:** Someone at a party names a song or artist and asks, "Is that a one-hit wonder?" The user wants a quick, clear answer and "the one hit" so they can share it.

**Rising action:** They open IsItAOneHitWonder.com on their phone, see a single search box, and type the artist or song (e.g. "Chumbawamba"). They get a result page with a big **Yes** or **No**, the line **"The one hit: Tubthumping – Chumbawamba,"** and a short line: *"We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."*

**Climax:** They have the answer and the definition in one place. They tap Copy (or Share) and get one compact line they can paste into the group chat: *"Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping."*

**Resolution:** The bet is settled; the definition travels with the answer so no one has to ask "how do you define it?" They might return next time the same question comes up.

---

### Journey 2: Trivia buff (primary – success path)

**Opening:** Someone is settling a bet or answering a trivia question and needs a fast, citable answer: "Is [artist] a one-hit wonder, and what's the one hit?"

**Rising action:** They land on the site, search by artist or song, and get the verdict plus "The one hit" and the one-line definition. The source (Wikipedia US list) is always visible—no "click to see how we define it"—so they can cite it.

**Climax:** They have Yes/No + the one hit + a clear, visible definition and source. They copy the shareable line (which includes the definition) to paste into Discord, a doc, or a message.

**Resolution:** The answer is authoritative and attributable; the definition is part of the shareable line so others see the same source.

---

### Journey 3: Primary user – edge case (no match / typo)

**Opening:** A user searches for an artist or song that isn't on the Wikipedia US list (e.g. a UK-only act) or types a misspelling.

**Rising action:** They type the query; client-side search runs against the build-time list. No match (or no confident match) is found.

**Climax:** The result page shows **No** (or "Not on our list") with the same one-line definition and source visible: *"We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."* So they understand: "Not a one-hit wonder by this definition" or "Not on the US list we use," not "we don't know."

**Resolution:** They get a clear, honest answer and see the definition and source. They can still share that line. No dead end; no broken experience.

---

### Journey 4: Wikipedia editor / attribution-minded user (secondary)

**Opening:** Someone cares how the list is used and whether it's attributed correctly. They want to see source and license without digging.

**Rising action:** They open the site (or a shared result). On the result page they see the one-line definition and source. In the footer or attribution area they see the Wikipedia source link and the CC BY-SA 4.0 license link.

**Climax:** Source and license are visible by default—no extra click. The shareable line also includes the definition (and implicitly the source), so shared answers carry attribution.

**Resolution:** They're satisfied that reuse is transparent and compliant. No extra "About" or "How we define it" required for basic trust.

---

### Journey 5: One-hit wonder artist (or fan of one) (secondary)

**Opening:** Someone looks up an artist they love—or themselves—and wants a straight, non-dismissive answer.

**Rising action:** They search by artist or song. The result page shows the verdict and "The one hit: [Song] – [Artist]" in clear, neutral language.

**Climax:** The framing is factual and positive ("the one hit" is prominent), not "only one hit." The definition and source are visible so it's clear this is one definition (Wikipedia US list), not a universal judgment.

**Resolution:** They get a clear answer and can share the same compact line. Later (v2+) "artist's other work" or discovery could add more context; v1 delivers the single lookup and share.

---

### Journey Requirements Summary

| Journey | Capabilities revealed |
|--------|------------------------|
| Music fan / Trivia buff (success) | Single search (artist or song); result page with verdict, "The one hit," one-line definition and source always visible; copy/share one compact line that includes definition. |
| Edge case (no match / typo) | Graceful "No" or "Not on our list" with same definition and source visible; no broken or empty state. |
| Wikipedia editor | Visible source + CC BY-SA 4.0 in UI and in shareable line; no hidden attribution. |
| One-hit wonder artist/fan | Same search and result flow; neutral, positive framing; definition and source visible. |

**Cross-cutting:** One search flow for all user types; definition and source first-class in UI and share; no accounts; static site so no "admin" or "support" journeys in v1.

---

## Web App Specific Requirements

### Project-Type Overview

IsItAOneHitWonder.com v1 is a **static web app**: multiple pages (MPA) built with Astro, not a single-page app (SPA). The site has a home/search page and result pages. Data is fetched at build time and baked into the site; search runs client-side (e.g. Fuse.js or MiniSearch) against build-time JSON. No real-time data or server-side search. Deployed as static files to GitHub Pages with HTTPS.

### Technical Architecture Considerations

- **MPA (not SPA):** Astro generates static HTML per route (e.g. `/`, `/search`, `/result/[slug]` or query-based). Client-side JS is limited to search and copy/share; no heavy client-side routing.
- **Build-time data:** Wikipedia list is fetched during build (GitHub Actions), parsed to JSON, and included in the build output. No runtime API calls for list data.
- **Client-side search:** Search index (JSON or pre-built index) is loaded in the browser; search is local. No external search service.
- **Hosting:** GitHub Pages; Enforce HTTPS in repo settings. Optional custom domain (e.g. IsItAOneHitWonder.com) with DNS per GitHub docs.

### Browser Support

- **Target:** Modern browsers that support the JS used for search and copy/share (ES modules or the bundle produced by Astro). No IE11.
- **Graceful degradation:** If JS is disabled, core content (e.g. search UI and result content) should still be usable or show a clear fallback (e.g. "Enable JavaScript to search" or server-rendered result pages for direct links).
- **Recommendation:** Define a browser matrix (e.g. last 2 versions of Chrome, Firefox, Safari, Edge) and test search and share on those.

### Responsive Design

- **Mobile-first:** Primary use (party, trivia) is often on phone. Single search box and result page must work well on small screens.
- **Touch:** Tap targets for search, copy, and share must be large enough and spaced appropriately.
- **Layout:** Readable typography and clear hierarchy for verdict, "The one hit," and definition/source on all viewport sizes.

### Performance Targets

- **Fast load:** Static HTML and minimal JS; list data loaded as JSON or pre-built index. Target: first contentful paint and interactive search within a few seconds on typical mobile.
- **No runtime API dependency:** No blocking calls to Wikipedia at request time; all list data is in the build.
- **Lighthouse:** Aim for strong performance scores (e.g. 90+ where applicable) for the main pages.

### SEO Strategy

- **Public lookup:** Users may land via search (e.g. "is [artist] a one-hit wonder"). Result pages should be indexable and have descriptive titles and meta (e.g. "[Artist] – One-Hit Wonder? | IsItAOneHitWonder").
- **URLs:** Clean, shareable URLs for results (e.g. `/result/chumbawamba` or query-based) so shared links are meaningful and indexable.
- **Content:** Verdict and "the one hit" in the page content; definition and source visible in HTML for clarity and attribution.

### Accessibility

- **WCAG:** Meet Level AA where feasible: contrast, focus order, keyboard access to search and copy/share, and readable text for definition and source.
- **Semantics:** Use headings, landmarks, and labels so screen readers can navigate search and result.
- **Copy/share:** Ensure the "copy one line" action is keyboard-accessible and has a clear label.

### Implementation Considerations

- **Astro:** Use Astro's build-time data loading and static output; add client-side search (Fuse.js or MiniSearch) as an island or script. Ensure `site` in `astro.config` matches the GitHub Pages URL (e.g. `https://<user>.github.io/<repo>/` or custom domain).
- **GitHub Actions:** Run fetch (Wikipedia API) then build; use `continue-on-error: true` on the fetch step so build succeeds with cached data if the API fails. Schedule weekly (e.g. Sunday midnight UTC).
- **HTTPS:** Rely on GitHub Pages HTTPS; enable "Enforce HTTPS" in repository Settings → Pages (and configure custom domain DNS if used).

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP approach:** Problem-solving MVP — the smallest set that lets users complete the core job: search by song or artist → get a correct Yes/No + "the one hit" + one-line definition (always visible) + copy/share one compact line that includes the definition. Success = "this is useful" and "we can learn from usage."

**Resource expectations:** Solo or very small team. Static site (Astro), build-time data, client-side search, GitHub Actions + GitHub Pages — no backend or ops beyond the workflow. No revenue or growth targets in v1; goal is delivery and validation.

### MVP Feature Set (Phase 1)

**Core user journeys supported:** Music fan / party goer, trivia buff (success path); primary user edge case (no match / typo); Wikipedia editor / attribution-minded; one-hit wonder artist or fan. All via one search flow.

**Must-have capabilities:**

- **Data pipeline:** Ingest Wikipedia US one-hit wonder list via MediaWiki API (no scraping). Parse wikitext into artist/song/year; normalize for search. Build-time fetch → JSON baked into site. Weekly refresh via GitHub Actions (e.g. Sunday midnight UTC). If fetch fails, build proceeds with cached data; no site break.
- **Single search → result page:** User types artist or song; client-side search (e.g. Fuse.js or MiniSearch) on build-time JSON. Result page: verdict (Yes/No), hero line "The one hit: [Song] – [Artist]," one short line with definition and source always visible (e.g. "We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."). No "click to see how we define it."
- **Share:** Copy or share produces one compact line that includes the definition (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.").
- **Deploy:** Static site (Astro) on GitHub Pages with HTTPS. CC BY-SA 4.0 attribution visible (source link + license link).
- **Graceful "no match":** When search finds nothing or low confidence, show "No" or "Not on our list" with the same definition and source visible.

**Optional for MVP:** Short "How we define it" (or equivalent) for edge cases (solo vs band, multiple acts, "signature song") and list caveats.

### Post-MVP Features

**Phase 2 (growth):** Quiz ("One-hit or not?", "Name the one-hit wonder" by decade). Regions (e.g. UK list; optional IP/locale and "Using the [US/UK] list"). Paste link (Spotify/Apple/YouTube URL → answer). Playlist builder (pick from list → export/open in Spotify/Apple). Song of the week (curated one-hit on front page or sidebar). Newsletter ("This week in one-hit wonder history"). API / bots (Slack/Discord, Alexa) — same core "Is X a one-hit wonder?" as a service.

**Phase 3 (expansion):** Song summary, artist details, related artists; optional "Also on these playlists" or other sources. Multiple definitions (e.g. Wikipedia vs Billboard) for power users. Shazam-style identify-then-answer if paste-link validates demand.

### Risk Mitigation Strategy

**Technical:** Wikipedia API or list structure changes. *Mitigation:* Use MediaWiki API (stable); custom parser for known wikitext patterns; fetch step `continue-on-error: true` so build succeeds with cached data; weekly refresh to pick up list changes.

**Market:** Unclear whether the single job is enough. *Mitigation:* Ship v1, measure usage/shares if feasible, use learnings to prioritize v2 (quiz, regions, paste link, etc.).

**Resource:** Fewer resources than planned. *Mitigation:* MVP is scoped to static site + one list + one flow; no backend, no accounts; can be built and maintained by a very small team.

---

## Functional Requirements

### Search & Lookup

- **FR1:** User can search by artist name to determine whether the artist is on the Wikipedia US one-hit wonder list.
- **FR2:** User can search by song title to determine whether the song (and its artist) is on the Wikipedia US one-hit wonder list.
- **FR3:** User can trigger search from a single, prominent search control on the main page.
- **FR4:** System performs lookup against the Wikipedia US one-hit wonder dataset (no runtime API call for list data).

### Result Presentation

- **FR5:** User sees a clear Yes or No verdict indicating whether the searched artist/song is on the list.
- **FR6:** When the answer is Yes, user sees the exact "one hit" in the form "The one hit: [Song] – [Artist]" on the result view.
- **FR7:** User sees a one-line definition of "one-hit wonder" and the source (Wikipedia US list) on every result view, without having to open another page or control.
- **FR8:** User sees the verdict, the one hit (when Yes), and the definition/source in a single, coherent result view.

### Share & Copy

- **FR9:** User can copy or share one compact text line that includes the verdict, the definition/source reference, and (when Yes) the one hit (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.").
- **FR10:** The shareable/copyable line is available from the result view (e.g. via a copy or share action).

### Attribution & Transparency

- **FR11:** User can see the data source (Wikipedia US one-hit wonder list) and a short definition (e.g. one top-40 hit in the US) in the UI on result views.
- **FR12:** User can see CC BY-SA 4.0 attribution (source link and license link) on the site (e.g. in footer or dedicated attribution area).

### Graceful Degradation & No Match

- **FR13:** When no match (or no confident match) is found for the search, user sees a clear "No" or "Not on our list" outcome, with the same one-line definition and source visible so the meaning of "not on list" is clear.
- **FR14:** When the Wikipedia list cannot be fetched during build, the system builds and deploys using the last successfully cached list data so the site remains usable.

### Data Pipeline (System)

- **FR15:** System ingests the Wikipedia US one-hit wonder list via the MediaWiki API (no scraping) and parses it into structured artist/song/year (or equivalent) for lookup.
- **FR16:** System refreshes the list on a defined schedule (e.g. weekly via GitHub Actions) and rebuilds the site with the updated data when fetch succeeds.
- **FR17:** System makes the parsed list available for client-side lookup without a server round-trip for list data.

### Access & Reach

- **FR18:** User can access the site over HTTPS.
- **FR19:** User can use the core search and result experience on common mobile and desktop browsers (with a defined browser support policy); optional: graceful degradation or message when JS is disabled.

### FR–Journey Traceability

| FR | Journeys |
|----|----------|
| FR1–FR4 | J1, J2, J3, J5 |
| FR5–FR8 | J1, J2, J5 |
| FR9–FR10 | J1, J2, J4, J5 |
| FR11–FR12 | J1, J2, J3, J4, J5 (J4 primary for attribution) |
| FR13 | J3 |
| FR14–FR17 | System (all journeys) |
| FR18–FR19 | J1, J2, J3, J4, J5 |

*J1 = Music fan / party goer, J2 = Trivia buff, J3 = Edge case (no match / typo), J4 = Wikipedia editor, J5 = One-hit wonder artist/fan*

---

## Non-Functional Requirements

### Performance

- **NFR-P1:** The main page (search) reaches first contentful paint within 3 seconds on a typical 4G mobile connection.
- **NFR-P2:** After the page has loaded, search results are shown within 2 seconds of the user submitting a query (client-side search).
- **NFR-P3:** List data is available at load time (embedded or fetched once with the page); no blocking runtime call to an external API for list data during a user search.

### Security

- **NFR-S1:** The site is served only over HTTPS (no mixed content, no HTTP fallback for the main experience).
- **NFR-S2:** The site does not collect, store, or transmit user account data or payment data; no authentication or payment flows in v1.

### Accessibility

- **NFR-A1:** The site meets WCAG 2.1 Level AA where feasible for the search flow and result view (contrast, focus order, text alternatives, and keyboard access).
- **NFR-A2:** Search input and the primary action that triggers search are keyboard-operable and have visible focus indicators.
- **NFR-A3:** The action that copies or shares the one-line result is keyboard-operable and has an accessible name (e.g. label or aria-label).
- **NFR-A4:** Heading structure and landmarks allow screen-reader users to navigate to search, result content (verdict, one hit, definition/source), and copy/share.

### Integration

- **NFR-I1:** The build pipeline fetches the Wikipedia US one-hit wonder list via the MediaWiki API; on fetch failure, the build uses the last successfully cached list so the site still builds and deploys.
- **NFR-I2:** List refresh runs on a defined schedule (e.g. weekly); the deployed site reflects the most recently successful fetch or the cached dataset.
