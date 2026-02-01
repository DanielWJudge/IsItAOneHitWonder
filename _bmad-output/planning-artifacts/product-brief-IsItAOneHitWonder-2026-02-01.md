---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-02-01.md
  - _bmad-output/planning-artifacts/research/technical-domain-isit-a-one-hit-wonder-v1-research-2026-02-01.md
date: 2026-02-01
author: DJ
---

# Product Brief: IsItAOneHitWonder

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

IsItAOneHitWonder.com is a US-only lookup site with one job: **search by song or artist → get Yes/No + "the one hit" + a one-line Wikipedia definition.** The product uses the Wikipedia US one-hit wonder list as the single source of truth. v1 ships as a minimal static site (Astro on GitHub Pages, HTTPS): build-time data from the Wikipedia MediaWiki API, client-side search (e.g. Fuse.js or MiniSearch), and weekly refresh via GitHub Actions. Transparency is part of the product: definition and source are always visible in the UI and in the shareable one-line; there is no "click to see how we define it." Scope is deliberately narrow: no quiz, playlist, newsletter, regions, lyrics, or related artists at launch. Success is measured by the user being able to search, get a correct verdict plus the one hit and definition, and share one compact line that includes the definition.

---

## Core Vision

### Problem Statement

People often wonder whether an artist or song is a "one-hit wonder" and want a quick, authoritative answer plus the actual hit and a clear definition. Existing options are either scattered (Wikipedia list, articles, forums) or opaque about how "one-hit wonder" is defined, so the answer and the definition are not in one place and are hard to share.

### Problem Impact

Without a focused tool, answering "is X a one-hit wonder?" and "what's the one hit?" requires manual searching and reading. Sharing a clear, sourced answer (including the definition) is awkward. The ambiguity of "one-hit wonder" (chart-only vs. "signature song," solo vs. band, etc.) is usually hidden, which can make answers feel arbitrary.

### Why Existing Solutions Fall Short

Wikipedia's list is the closest to a canonical US list but is a long page, not a lookup. Other sites rarely state their definition or source, and none combine a single search, a clear Yes/No, "the one hit," and a visible one-line definition in a shareable format.

### Proposed Solution

IsItAOneHitWonder.com does one thing: search by song or artist → result page with verdict (Yes/No), "The one hit: [Song] – [Artist]," and a one-line definition with source always visible (e.g. "We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."). Share/copy produces one compact line that includes the definition. Data comes from the Wikipedia MediaWiki API (no scraping); the list is fetched at build time, parsed, and served as static JSON with client-side search. The site is static (Astro), deployed on GitHub Pages with HTTPS, refreshed weekly via GitHub Actions, with proper CC BY-SA 4.0 attribution. v1 is US-only; no quiz, playlist, newsletter, regions, lyrics, or related artists at launch. Ship fast, then validate before adding more.

### Key Differentiators

- **One job, one list, one region (US)** — Simple scope and clear boundaries.
- **Transparency as product** — Definition and source (Wikipedia US list) are first-class in the UI and in the shareable line, not behind a link.
- **Research-backed implementation** — MediaWiki API, build-time data, client-side search, Astro, GitHub Actions, GitHub Pages, and explicit licensing.
- **Honest about caveats** — The list is curated/interpretive (not strict chart-only); edge cases (solo vs. band, multiple acts, "signature song") are acknowledged, with an optional short "How we define it" (or equivalent) so users know what they're getting.

---

## Target Users

### Primary Users

**Music fan / party goer**  
Someone who hears a song or thinks of an artist and wants a quick answer: “Is that a one-hit wonder?” They want the verdict (Yes/No), “the one hit” (song + artist), and a clear definition—all in one place. They often want to share the answer in one compact line (e.g. in a chat or social post) so the definition travels with it. Success is: search → get answer + one hit + definition → copy or share one line. v1 is built for this flow.

**Trivia buff**  
Someone who settles bets or answers trivia questions and needs a fast, authoritative lookup. Same core need as the music fan: search by song or artist → Yes/No + the one hit + definition. They benefit from the definition being always visible (no “click to see how we define it”) so they can cite the source. Later (v2+), expandable reasoning or “Why this list?” could add value; for v1 they get the same single flow and shareable one-line.

### Secondary Users

**Wikipedia editor / attribution-minded user**  
Someone who cares how the list is used and whether it’s attributed correctly. They expect visible source (Wikipedia US list) and licensing (CC BY-SA 4.0). The product’s transparency—definition and source always visible in the UI and in the shareable line—serves them without extra features.

**One-hit wonder artist (or fan of one)**  
Someone who looks up an artist (themselves or a favorite) and wants a straight answer. Positive framing matters for this segment; the result page should state the verdict and the one hit clearly without sounding dismissive. v1 gives them the same lookup and shareable line; later, “artist’s other work” or discovery could be added.

### User Journey

- **Discovery:** Search, word of mouth, or a shared link/one-line (e.g. “Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.”). The shareable unit is a natural entry point.
- **Onboarding:** Land on IsItAOneHitWonder.com, see a single search (artist or song). No account; no setup.
- **Core usage:** Type artist or song → result page with verdict (Yes/No), hero line “The one hit: [Song] – [Artist],” and one short line with definition and source. Optional “Copy” or share produces one compact line that includes the definition.
- **Success moment:** Get the answer, see the one hit and definition in one place, and share one line that carries the meaning so others don’t have to ask “how do you define it?”
- **Long-term:** Return when they hear a new song or need to settle a bet; share the link or one-line when the topic comes up. The product stays in the loop because the job is narrow and the share format is clear.

---

## Success Metrics

**User success (v1)**  
- User can search by song or artist and get a correct Yes/No verdict.  
- User sees "the one hit" (song + artist) when the answer is Yes.  
- User sees the one-line definition and source (Wikipedia US list) always visible on the result page.  
- User can copy or share one compact line that includes the definition (e.g. "Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.").  

**Outcome:** The core job is done when a user completes search → result → (optional) share with definition in one line.

### Business Objectives

**v1 (ship fast, then validate)**  
- Site is live on GitHub Pages with HTTPS.  
- Data pipeline runs (Wikipedia API fetch, parse, build-time JSON) and weekly refresh succeeds or fails gracefully.  
- No critical errors blocking search or result display.  
- Optional: Evidence that the product is used (e.g. traffic, shares) to inform v2 prioritization.

v1 has no revenue or growth targets; success is delivery of the one job and a stable, transparent experience.

### Key Performance Indicators

**Functional (must-have for v1)**  
- Search returns correct verdict (Yes/No) for artists/songs on the Wikipedia US list.  
- Result page shows verdict + one hit + one-line definition; share/copy produces one compact line with definition.  
- Build/deploy and weekly data refresh complete (or fail with cached data and no site break).

**Validation (optional for v1)**  
- Visits or shares (if measured) indicate that the shareable one-line and lookup are used; used to decide v2 scope (quiz, regions, etc.).

---

## MVP Scope

### Core Features

**Data pipeline**  
- Ingest Wikipedia US one-hit wonder list via MediaWiki API (no scraping).  
- Parse wikitext into artist/song/year; normalize for search.  
- Build-time fetch → JSON baked into site; weekly refresh via GitHub Actions (e.g. Sunday midnight UTC).  
- Fallback: if fetch fails, build proceeds with cached data; no site break.

**Single search → result page**  
- User types artist or song; client-side search (e.g. Fuse.js or MiniSearch) on build-time JSON.  
- Result page: verdict (Yes/No), hero line “The one hit: [Song] – [Artist],” one short line with definition and source always visible (e.g. “We use the Wikipedia US one-hit wonder list: one top-40 hit in the US.”).  
- No “click to see how we define it”—definition and source are first-class in the UI.

**Share**  
- Copy or share produces one compact line that includes the definition (e.g. “Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.”).

**Deploy**  
- Static site (Astro) on GitHub Pages with HTTPS.  
- CC BY-SA 4.0 attribution visible (source link + license link).

**Optional**  
- Short “How we define it” (or equivalent) for edge cases (solo vs band, multiple acts, “signature song”) and list caveats (curated/interpretive, not strict chart-only).

### Out of Scope for MVP

- **Quiz** — “One-hit or not?” or “Name the one-hit wonder” by decade; deferred to v2+.  
- **Playlist builder** — Pick from list → Spotify/Apple; deferred to v2+.  
- **Newsletter** — “This week in one-hit wonder history”; deferred to v2+.  
- **Regions** — UK or other lists; region detection; US only at launch.  
- **Lyrics** — Link to lyrics (Genius, etc.); deferred to v2+.  
- **Related artists / song summary / artist details** — Deferred to v2+.  
- **Song of the week** — Curated highlight on front page; deferred to v2+.  
- **Paste link** — Spotify/Apple/YouTube URL → parse, fetch, answer; deferred to v2+.  
- **API / bots / Alexa** — Same backend, API or Slack/Discord/Alexa front-ends; deferred to v2+.

### MVP Success Criteria

- User can search by song or artist and get correct Yes/No + one hit + definition; share one compact line with definition.  
- Site is live on GitHub Pages with HTTPS; data pipeline and weekly refresh run (or fail gracefully).  
- No critical errors blocking search or result display.  
- Optional: traffic or share usage to inform v2 prioritization.  
- See [Success Metrics](#success-metrics) for full KPIs.

### Future Vision

**v2+ (after validate)**  
- Quiz mode (“One-hit or not?”, “Name the one-hit wonder” by decade).  
- Regions: UK and others; optional IP/locale detection and “Using the [US/UK] list.”  
- Paste link: Spotify/Apple/YouTube URL → answer.  
- Playlist builder: pick from list (decade, vibe, random N) → export/open in Spotify/Apple.  
- Song of the week: curated one-hit wonder on front page or sidebar.  
- Newsletter: “This week in one-hit wonder history” (chart dates + artist/song).  
- API, Slack/Discord bot, Alexa skill: same core “Is X a one-hit wonder?” as a service.  
- Song summary, artist details, related artists; optional “Also on these playlists” or other sources.
