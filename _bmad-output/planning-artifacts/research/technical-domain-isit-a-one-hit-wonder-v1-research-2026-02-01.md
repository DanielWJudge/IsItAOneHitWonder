# Research Report: Technical & Domain — IsItAOneHitWonder.com v1

**Date:** 2026-02-01  
**Author:** DJ  
**Research Type:** Technical & Domain (combined)  
**Source:** Brainstorming session 2026-02-01

---

## Executive Summary

This report supports shipping **IsItAOneHitWonder.com v1**: a US-only site where users search by song or artist to learn if it’s a one-hit wonder, using Wikipedia’s US one-hit wonder list as the source of truth. v1 is a static Astro site on GitHub Pages with HTTPS. The research covers:

1. **Data/Technical** — Wikipedia list access (API vs scraping), structure, update frequency, rate limits, and licensing  
2. **Domain** — Definition of “one-hit wonder,” Wikipedia vs Billboard criteria, and product caveats  
3. **Technical** — Astro static sites, build-time vs client-side search, GitHub Actions for periodic refresh, and GitHub Pages + HTTPS

**Key conclusions:**
- Use the **Wikipedia MediaWiki API** (`action=query` with `prop=revisions&rvprop=content`) to fetch raw wikitext; a single request returns the full page. Prefer the API over scraping.
- Rate limits: 500 req/hr anonymous, 5,000 req/hr with API token; v1’s weekly refresh is well within limits.
- Wikipedia content is **CC BY-SA 4.0**; attribution and source transparency are required and align with product goals.
- The Wikipedia list is contested; explicit definition + source (“one top-40 hit in the US”) in the UI is recommended.
- Astro + build-time JSON index + Fuse.js/MiniSearch is a proven pattern for client-side search on static sites.
- GitHub Actions + scheduled cron (e.g. weekly) + GitHub Pages + Enforce HTTPS is a standard, low-friction deployment setup.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Wikipedia US One-Hit Wonder List — Data & Technical](#2-wikipedia-us-one-hit-wonder-list--data--technical)
3. [Domain: “One-Hit Wonder” Definition & Caveats](#3-domain-one-hit-wonder-definition--caveats)
4. [Technical: Astro, Search, GitHub Actions, GitHub Pages](#4-technical-astro-search-github-actions-github-pages)
5. [Conclusions & Recommendations](#5-conclusions--recommendations)
6. [References](#6-references)

---

## 1. Introduction

IsItAOneHitWonder.com v1 is a minimal lookup tool: search by song or artist → Yes/No + “the one hit” + a one-line Wikipedia definition always visible. The US list from Wikipedia is the single source of truth. This research answers how to ingest that list, what caveats to surface, and how to implement the stack (Astro, search, deploy) for v1.

---

## 2. Wikipedia US One-Hit Wonder List — Data & Technical

### 2.1 Source and Structure

**Page:** [List of one-hit wonders in the United States](https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States)

The list includes artists who are “regarded as one-hit wonders by at least two sources in media,” even if they had hits elsewhere. Entries are grouped by decade (1950s, 1960s, etc.) and follow a consistent wikitext pattern, for example:

```
* [[Artist Name]] – "[[Song Title]]" (YEAR)
* [[Band Name]] – "[[Song Title]]" (YEAR)
```

The page uses `{{Div col}}` and `{{div col end}}` templates for layout. Entries may include alternate artist names (e.g. `[[The Chords (American band)|The Chords]]`), references, and occasional formatting variations.

**Size:** The wikitext is large (on the order of 6,000+ lines). The page includes a “too long” notice and suggestions for splitting; structure has been stable for years. [*Medium Confidence*]

### 2.2 API vs Scraping

**Recommendation: Use the Wikipedia API.** Scraping HTML is brittle; the API is stable and intended for programmatic access.

**MediaWiki Action API (recommended):**

- **Endpoint:** `https://en.wikipedia.org/w/api.php`
- **Method:** `action=query` with `prop=revisions`, `rvprop=content`, `rvslots=main`, `titles=List_of_one-hit_wonders_in_the_United_States`
- **Example:**  
  `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=main&titles=List_of_one-hit_wonders_in_the_United_States&format=json`
- **Result:** Raw wikitext in `query.pages[pageid].revisions[0].slots.main["*"]`

A single request returns the full page content; no pagination is needed for v1. [*High Confidence*]

**Alternative — REST API:** `https://en.wikipedia.org/w/rest.php/v1/page/List_of_one-hit_wonders_in_the_United_States` returns page source. The older Core REST API (`/core/v1/...`) is scheduled for deprecation from July 2026, so prefer the current REST API or the Action API. [*High Confidence*]

Sources: [MediaWiki API documentation](https://www.mediawiki.org/wiki/API:Parsing_wikitext), [Wikipedia REST API reference](https://api.wikimedia.org/wiki/Core_REST_API/Reference/Pages/Get_page_source)

### 2.3 Rate Limits

Wikimedia API limits (api.wikimedia.org base URL):

| Request Type | Limit |
|--------------|-------|
| Anonymous | 500 requests/hour per IP |
| Personal API token | 5,000 requests/hour |
| OAuth (app or user) | 5,000 requests/hour |

A 429 response indicates the limit is exceeded. For v1, one fetch per build (e.g. weekly via GitHub Actions) is trivial. Anonymous or token-based access is sufficient. [*High Confidence*]

Sources: [Wikimedia Rate limits](https://api.wikimedia.org/wiki/Rate_limits), [API Usage Guidelines](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines)

### 2.4 Update Frequency and List Changes

- Wikipedia is edited continuously; the US one-hit wonder list changes at a moderate pace (new entries, occasional removals or edits).
- Recommended refresh: **weekly** (e.g. Sunday midnight UTC). Matches the existing deploy schedule in `.github/workflows/deploy.yml`.
- Handling changes: Run fetch during build; if the fetch fails, `continue-on-error: true` allows the build to proceed with existing data. Add retries and/or monitoring for production robustness. [*Medium Confidence*]

### 2.5 Licensing and Attribution

- Most Wikipedia content is under **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**.
- Requirements when reusing content:
  1. Check the specific license (e.g. via page footer).
  2. Provide attribution (title, author/source, license).
  3. Link to the license.
  4. If you modify content, state that and comply with ShareAlike (license derivatives under CC BY-SA or compatible).

For v1, attribution can be satisfied by a visible line such as: *“We use the Wikipedia US one-hit wonder list: one top-40 hit in the US. [Source](link) · [CC BY-SA 4.0](link).”* This aligns with product transparency goals. [*High Confidence*]

Sources: [Reusing free content](https://api.wikimedia.org/wiki/Reusing_free_content), [Wikipedia: Reusing Wikipedia content](https://en.wikipedia.org/wiki/Wikipedia:Reusing_Wikipedia_content), [API: Licensing](https://www.mediawiki.org/wiki/API:Licensing)

### 2.6 Parsing the Wikitext

The raw wikitext must be parsed to extract artist–song–year tuples. Options:

1. **Custom regex/parser** — Match patterns like `* [[Artist]] – "[[Song]]" (YEAR)` and `{{div col end}}` boundaries. Feasible for v1 given the stable structure.
2. **MediaWiki parse API** — `action=parse` with `prop=text` returns HTML. Parsing HTML adds complexity; wikitext parsing is likely simpler for this use case.
3. **Existing datasets** — A [CSV derived from the Wikipedia list](https://github.com/devinbrady/one-hit-wonders/blob/master/One%20Hit%20Wonders%20(Wikipedia).csv) exists but may be outdated; API fetch ensures freshness.

**Recommendation:** Use the API to fetch wikitext and implement a focused parser for the list sections. Normalize artist and song names (strip wikilinks, handle disambiguation) for search.

---

## 3. Domain: “One-Hit Wonder” Definition & Caveats

### 3.1 Definitions

**Wikipedia (general):** A one-hit wonder is “a musical artist who is successful with one hit song, but without a comparable subsequent hit,” or “an artist who is remembered for only one hit despite other successes.” [*High Confidence*]

**Billboard (chart-based):** “An artist that cracks the top 40 on the Billboard Hot 100 and never makes it back to that position.” [*High Confidence*]

**Other criteria cited on the Wikipedia list:**
- **Wayne Jancik (2008):** One Top 40 hit on *Billboard*; distinguishes solo vs group; some artists appear multiple times.
- **Fred Bronson:** Ineligible if they have a second song on the Hot 100.
- **Chris Molanphy (Slate/Village Voice):** No second top-10 hit; subsequent top-40 singles within six months of first hit; no three+ top-10 or Platinum albums.
- **Brent Mann:** “Signature song” overshadows other charting work (e.g. Simple Minds, Albert Hammond).

Sources: [One-hit wonder (Wikipedia)](https://en.wikipedia.org/wiki/One-hit_wonder), [List of one-hit wonders in the United States](https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States), [Molanphy, Village Voice](https://www.villagevoice.com/100-single-three-rules-to-define-the-term-one-hit-wonder-in-2012/)

### 3.2 Tension: Wikipedia vs Billboard

- **Billboard:** Strictly chart-based (one Top 40 hit, no return).
- **Wikipedia list:** Combines chart data with “regarded by at least two media sources” — more interpretive. It can include artists with multiple chart hits if one song dominates public memory (e.g. Simple Minds, Beck, Grateful Dead).
- Some artists are disputed (e.g. Dave Brubeck Quartet). The list is curated, not mechanically derived from charts.

**Product implication:** Be explicit that the product uses the Wikipedia US list and its definition. A suggested one-line definition: *“One top-40 hit in the US (Wikipedia US list).”* [*High Confidence*]

### 3.3 Norms and Caveats to Surface

1. **Source** — “We use the Wikipedia US one-hit wonder list.”
2. **Definition** — “Artists with one US Top 40 hit (or regarded that way by media sources).”
3. **Edge cases:**
   - Solo vs band (e.g. Roger Daltrey vs the Who).
   - Same person, multiple acts (e.g. Ron Dante).
   - Artists with many hits elsewhere but one US hit (e.g. Smokie).
   - “Signature song” vs chart data (e.g. Simple Minds).
4. **Disputes** — Some entries are debated; the list reflects consensus, not an official chart rule.
5. **Updates** — List changes over time; show data freshness if feasible.

These can be surfaced via a short “How we define it” section and/or inline microcopy. [*Medium Confidence*]

---

## 4. Technical: Astro, Search, GitHub Actions, GitHub Pages

### 4.1 Astro Static Sites

Astro produces static HTML by default. It supports:
- Build-time data fetching.
- Zero or minimal client-side JS.
- Multiple UI frameworks (React, Vue, Svelte, etc.) for islands.
- Static output suitable for GitHub Pages.

For v1, the Wikipedia list is fetched at build time, processed into JSON, and baked into the site. [*High Confidence*]

Source: [Astro documentation](https://docs.astro.build)

### 4.2 Build-Time vs Client-Side Search

**Build-time approach (recommended for v1):**
1. Fetch Wikipedia list during build.
2. Parse into structured data (artist, song, year).
3. Generate `search.json` (or equivalent) in the build output.
4. Deploy JSON with the static site.
5. Use client-side search (Fuse.js, MiniSearch, etc.) against that file.

**Benefits:**
- No external search service.
- No runtime API calls.
- Works fully offline after load.
- Privacy-friendly (no third-party crawlers).

**Alternatives:**
- **Pagefind** — Indexes site at build time; loads chunks on demand. Add via `npx pagefind --site dist` after Astro build.
- **Fuse.js** — Fuzzy search; good for typo tolerance.
- **MiniSearch** — Full-text search; can be used with pre-built index.

For v1, a JSON array of `{ artist, song, year }` plus Fuse.js or MiniSearch is sufficient. [*High Confidence*]

Sources: [Evil Martians — client-side search in Astro](https://evilmartians.com/chronicles/how-to-add-fast-client-side-search-to-astro-static-sites), [CSS-Tricks — Astro Actions + Fuse.js](https://css-tricks.com/powering-search-with-astro-actions-and-fuse-js/), [Pagefind + Astro](https://syntackle.com/blog/pagefind-search-in-astro-site/)

### 4.3 GitHub Actions for Periodic List Refresh

**Current workflow** (`.github/workflows/deploy.yml`):
- Triggers: `push` to `main`, `schedule` (weekly Sunday midnight UTC), `workflow_dispatch`.
- Steps: checkout, Node setup, `npm ci`, `npm run fetch-data` (placeholder), `npm run build`, deploy to GitHub Pages via `peaceiris/actions-gh-pages@v4`.

**Scheduled runs:**
- Use `schedule` with cron, e.g. `'0 0 * * 0'` (Sunday 00:00 UTC).
- Schedules can drift slightly under load.
- Avoid running exactly on the hour if possible.
- Multiple cron expressions are allowed.

**Fetch step:** Implement `fetch-data` to call the Wikipedia API, parse the response, and write `src/data/one-hit-wonders.json` (or similar) before `npm run build`. Use `continue-on-error: true` so builds can succeed with cached data if the fetch fails. [*High Confidence*]

Sources: [GitHub Actions workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions), [Future Studio — cron triggers](https://futurestud.io/tutorials/github-actions-trigger-builds-on-schedule-cron)

### 4.4 GitHub Pages + HTTPS

**HTTPS:**
- All GitHub Pages sites support HTTPS.
- `*.github.io` sites default to HTTPS (for sites created after June 2016).
- Custom domains: GitHub requests a Let’s Encrypt certificate after DNS is configured; enable “Enforce HTTPS” in repository Settings → Pages.

**Gotchas:**
- Domain length must be under 64 characters for certificate issuance (RFC 3280).
- `www` vs apex redirects may need DNS configuration; GitHub does not auto-redirect between them when Enforce HTTPS is on.
- Certificate provisioning can take a few minutes after domain changes.
- Repository must be public for free GitHub Pages (private repos require a paid plan).

**Recommendation:** Use Enforce HTTPS and, for custom domains, configure DNS per GitHub’s docs. [*High Confidence*]

Sources: [Securing GitHub Pages with HTTPS](https://docs.github.com/articles/securing-your-github-pages-site-with-https), [Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain)

### 4.5 Astro + GitHub Pages Deployment

**Setup:**
1. Repository Settings → Pages → Source: **GitHub Actions**.
2. Workflow builds the site and deploys `./dist` with `actions/deploy-pages@v4` or `peaceiris/actions-gh-pages@v4`.
3. `site` in `astro.config` must match the Pages URL (e.g. `https://<user>.github.io/<repo>/` for project sites).
4. Commit the lockfile (`package-lock.json`, etc.) for reproducible builds.

The existing workflow already uses this pattern. [*High Confidence*]

Source: [Deploy Astro to GitHub Pages](https://docs.astro.build/en/guides/deploy/github)

---

## 5. Conclusions & Recommendations

### 5.1 Data Pipeline

| Decision | Recommendation |
|----------|----------------|
| Source | Wikipedia US one-hit wonder list |
| Access | MediaWiki Action API (`action=query`, `prop=revisions`, `rvprop=content`) |
| Parsing | Custom wikitext parser for list entries |
| Refresh | Weekly (e.g. Sunday midnight UTC) via GitHub Actions |
| Fallback | `continue-on-error` on fetch; use cached data if fetch fails |

### 5.2 Licensing & Transparency

- Provide attribution: title, source URL, CC BY-SA 4.0 link.
- Show a one-line definition: “We use the Wikipedia US one-hit wonder list: one top-40 hit in the US.”
- Keep definition and source visible on result and share views.

### 5.3 Domain Caveats

- Surface that the list is curated, not strictly chart-derived.
- Briefly explain edge cases (solo vs band, multiple acts, signature song).
- Consider a short “How we define it” section.

### 5.4 Technical Stack

| Component | Recommendation |
|-----------|----------------|
| Framework | Astro (static) |
| Data | Build-time fetch → JSON → baked into build |
| Search | Client-side (Fuse.js or MiniSearch) on JSON |
| Deploy | GitHub Actions → GitHub Pages |
| HTTPS | Enforce HTTPS in repo settings |

### 5.5 v1 Scope

- US list only.
- Search by artist or song.
- Output: Yes/No + “the one hit” + one-line definition.
- No quiz, playlists, regions, or extra features at launch.

---

## 6. References

### Wikipedia & Wikimedia

- [List of one-hit wonders in the United States](https://en.wikipedia.org/wiki/List_of_one-hit_wonders_in_the_United_States)
- [One-hit wonder (concept)](https://en.wikipedia.org/wiki/One-hit_wonder)
- [Wikimedia API Rate limits](https://api.wikimedia.org/wiki/Rate_limits)
- [Reusing free content / Attribution](https://api.wikimedia.org/wiki/Reusing_free_content)
- [Wikimedia Foundation API Usage Guidelines](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines)
- [MediaWiki API: Parsing wikitext](https://www.mediawiki.org/wiki/API:Parsing_wikitext)
- [API: Licensing](https://www.mediawiki.org/wiki/API:Licensing)
- [Wikipedia REST API — Get page source](https://api.wikimedia.org/wiki/Core_REST_API/Reference/Pages/Get_page_source)

### Domain

- [Chris Molanphy — Three Rules To Define One-Hit Wonder (Village Voice, 2012)](https://www.villagevoice.com/100-single-three-rules-to-define-the-term-one-hit-wonder-in-2012/)
- [One Hit Wonder Center — Criteria](https://www.onehitwondercenter.com/criteria.htm)

### Technical

- [Evil Martians — Client-side search in Astro](https://evilmartians.com/chronicles/how-to-add-fast-client-side-search-to-astro-static-sites)
- [CSS-Tricks — Astro Actions + Fuse.js](https://css-tricks.com/powering-search-with-astro-actions-and-fuse-js/)
- [Pagefind + Astro integration](https://syntackle.com/blog/pagefind-search-in-astro-site/)
- [Deploy Astro to GitHub Pages](https://docs.astro.build/en/guides/deploy/github)
- [GitHub Actions — Workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [Securing GitHub Pages with HTTPS](https://docs.github.com/articles/securing-your-github-pages-site-with-https)
- [GitHub — Scheduled workflows (cron)](https://futurestud.io/tutorials/github-actions-trigger-builds-on-schedule-cron)

---

*Research completed 2026-02-01. All factual claims cited to sources above. Confidence levels noted where applicable.*
