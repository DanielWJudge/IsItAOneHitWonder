---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_active: false
workflow_completed: true
session_topic: 'IsItAOneHitWonder.com - A website where users search by song or artist to discover if it qualifies as a one-hit wonder, using Wikipedia one-hit wonder lists as the source of truth. Publish on GitHub and serve over HTTPS.'
session_goals: 'Ideas across: user problems/features (who uses it, edge cases like bands vs solo artists), Wikipedia data usage (which lists, APIs vs scraping, keeping current), UX/flows (search, results presentation), technical approach (stack, GitHub Pages hosting, HTTPS), risks and gotchas (Wikipedia changes, licensing, performance), and what could make it distinctive or fun beyond a simple lookup tool'
selected_approach: 'ai-recommended'
techniques_used: ['Role Playing', 'What If Scenarios', 'Failure Analysis', 'Alien Anthropologist', 'SCAMPER']
ideas_generated: 40
context_file: ''
session_continued: true
continuation_date: '2026-02-01'
---

# Brainstorming Session Results

**Facilitator:** DJ
**Date:** 2026-02-01

## Session Overview

**Topic:** IsItAOneHitWonder.com - A website where users search by song or artist to discover if it qualifies as a one-hit wonder, using Wikipedia's one-hit wonder list(s) as the source of truth. Publish on GitHub and serve over HTTPS.

**Goals:** Generate ideas across:
- User problems and features (who uses it, what they need, edge cases like bands vs solo artists)
- How to use Wikipedia data (which list(s), APIs or scraping, keeping it current)
- UX and flows (search, results, "one hit" vs "not" presentation)
- Technical approach (stack, hosting on GitHub Pages or similar, HTTPS)
- Risks and gotchas (Wikipedia changes, licensing, performance)
- What could make it distinctive or fun so it's not just a lookup tool

### Context Guidance

_No context file provided_

### Session Setup

_Session parameters captured from facilitator discovery. AI-recommended approach selected._

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** IsItAOneHitWonder.com with focus on user problems, Wikipedia data, UX, tech approach, risks, and differentiation

**Recommended Techniques:**

- **Role Playing:** Embody different user personas (music fan, trivia buff, Wikipedia editor, band member, radio DJ) to uncover who uses the product, what they need, and edge cases like bands vs solo artists.
- **What If Scenarios:** Break constraints around Wikipedia APIs, hosting, and product scope to surface technical possibilities and distinctive/fun ideas.
- **Failure Analysis:** Study what goes wrong—Wikipedia list changes, licensing, performance—and learn from similar projects that failed.

**AI Rationale:** Sequence moves from understanding users → imagining possibilities → anticipating failures, covering all six goal areas with complementary creative energies.

## Technique Execution Results

**Role Playing:** Party fan, trivia buff, Wikipedia editor, one-hit wonder artist. Key insights: single flow (answer → definition → actions → similar → artist's other work), expandable reasoning for trivia buff, positive framing for artists, discovery focus.

**What If Scenarios:** Perfect Wikipedia API (no scraping), unlimited hosting (more integrations), opposite angle (quiz), static site (client-side search, build-time data).

**Failure Analysis:** Editor accuracy, better sources, Wikipedia unavailable on deploy, list structure changes, licensing, rate limits, performance.

**Extended Exploration:** Stack choice (Astro selected), UX/flows, search/autocomplete, data schema, GitHub Actions workflow. Project scaffolded with Astro.

---

## Session Continuation (2026-02-01)

**Status at continuation:** Steps 1–2 complete. Three techniques executed (Role Playing, What If Scenarios, Failure Analysis) with summarized insights; formal idea list not yet populated. Resuming with additional techniques to push past obvious ideas and broaden the idea set before organization.

### Alien Anthropologist

**What we discovered:**
- **Strange goal:** Why do people care if something is a one-hit wonder, and what does it mean to be one? Product implication: surface “why this matters” and “what we mean by it” (copy, microcopy, optional “About this”).
- **Strange source:** Using an “official” list with a standard definition—we’re canonizing something contested. Implication: be explicit (“We use the Wikipedia list; here’s what that means”) so it’s a feature, not a hidden assumption.
- **Meaning in the UI:** One-line definition under the result; “How we define it” link; inline “by this definition” next to Yes/No; optional “Why this list?”; later, contrast multiple definitions (e.g. Wikipedia vs Billboard) for power users.
- **Strange ritual:** Why this one question? Why type → one word? Why share? Why a website vs book/bot? Implications: own the narrowness; keep primary answer simple but add one clear “what next?”; make shareable unit include definition; lean into instant, linkable, up-to-date as the reason it’s a site.

**Key breakthrough:** Treating “definition + source” as first-class UI (visible at answer time) turns transparency into differentiation and makes sharing carry the meaning.

### SCAMPER

**S — Substitute (documented):**
- **Source of truth:** Playlists (Spotify, Apple Music "one-hit wonder" lists) or other websites. Playlists = discovery + "listen now"; other sites = multiple definitions / cross-check. Wikipedia stays primary; playlists/sites as add-ons ("Also on these playlists," "Other lists that include them").
- **Input:** Voice (hands-free, party use; breaks on name disambiguation). Link (Spotify/Apple/YouTube URL → parse, fetch, answer). "Paste a link, get the answer" as distinct use case.
- **Output:** Summary of song, details on artist, related artists. Phased: v1 = answer + definition; v2 = song summary + artist details; v3 = related artists or "Also on these playlists."
- **Medium:** Slack bot, Discord bot, API-only, Alexa skill. Same backend; website is one front-end; API + bots + skill make the core "Is X a one-hit wonder?" a service.

**C — Combine (documented):**
- **Shazam-style:** Identify song (or paste Shazam/Spotify/Apple link) → then "Is it a one-hit wonder?" Real-world use (party, radio); bridge = "paste link" if no full integration.
- **Song of the week:** Curated one-hit wonder highlight (front page / sidebar). Recurring reason to visit, shareable; someone picks or rotates from list.
- **Lyrics site:** Answer + "The one hit: [song]" + link to lyrics (Genius, etc.). Answer + sing-along; we link out, don't host lyrics.
- **One-hit wonder playlist builder:** User picks from list (decade, vibe, random N) → export/open in Spotify/Apple. Lookup + "Build my party playlist"; needs playlist API or "open in Spotify" with track IDs.
- **Quizzes by decade:** "One-hit or not?" or "Name the one-hit wonder" by 80s/90s/2000s. Lookup + game; same data, different format.

**A — Adapt (documented):**
- **Different regions + automatic detection:** "One-hit wonder" by country (US vs UK vs others). Detect via IP geolocation and/or browser locale; show "Using the [US/UK] list" and optional override ("Use US list" / "Use UK list"). One site works globally; need at least one non-US list (e.g. UK) and fallback when we only have one list. Privacy: use geo at request time only, no need to store IP.

**M — Modify (documented):**
- **Magnify the one hit + minify the rest for sharing:** Make the song title and verdict the hero on the result page (e.g. "Yes. The one hit: **Tubthumping** – Chumbawamba."). Default share/copy = one compact line: verdict + artist + "the one hit: [song]" + definition. Optimized for answer + sharing.
- **Wikipedia transparency always visible:** Don't hide definition/source behind a link. One short line always visible under the result (e.g. "We use the Wikipedia US one-hit wonder list: one top-40 hit in the US."). Transparency as default, not optional.

**P — Put to other uses (documented):**
- **Newsletter: "This week in one-hit wonder history":** Weekly email: "This week in [year], [Song] by [Artist] was in the top 40." More on artist, song, chart position, why it hit, "listen now," link to site. Same list (+ chart dates if available) put to recurring engagement; builds list and habit. Needs "when did it peak?" (Wikipedia or chart source). Extensions: RSS, "Add to calendar," or "Today in one-hit wonder history" on-site/social.

**E — Eliminate (documented):**
- **v1 super simple, US only:** Strip v1 to core: search → answer (Yes/No) + one hit + one-line Wikipedia definition always visible. No lyrics, related artists, quiz, playlist builder, song of the week, newsletter, or region detection at launch. US list only; add UK/other later. Ship fast, validate, then add "fluff" in v2+.

**R — Reverse (documented):**
- **Reverse the question for v2+:** Instead of "you ask, we answer," add quiz mode: "Name the one-hit wonder" (we show the song, you guess the artist) or "One-hit or not?" (we show artist + song, you guess). Quiz as secondary experience; same data, different format. Fits after v1 validates the core lookup.

---

## Idea Organization and Prioritization

**Thematic Organization:**

**Theme 1: Core product (v1)**  
_Focus: Minimal viable lookup—answer, definition, US only._

- Search → Yes/No + “the one hit” (song + artist) + one-line Wikipedia definition always visible.
- Wikipedia transparency always visible (no “How we define it” link; one short line under result).
- Magnify the one hit + minify the rest for sharing (hero = verdict + song title; share = one compact line with definition).
- v1 super simple, US only: no lyrics, related artists, quiz, playlist, song of the week, newsletter, region detection.
- Single flow: answer → definition → optional “what next?” (later).

_Pattern:_ Ship one clear job (is X a one-hit wonder?) with transparent source; add nothing else at launch.

**Theme 2: Transparency and trust**  
_Focus: Definition and source as product._

- Surface “why this matters” and “what we mean by it” (copy, microcopy, optional “About this”).
- Be explicit: “We use the Wikipedia list; here’s what that means.”
- Meaning in the UI: one-line definition, inline “by this definition,” optional “Why this list?”; later, multiple definitions (e.g. Wikipedia vs Billboard) for power users.
- Shareable unit includes definition so sharing carries the meaning.

_Pattern:_ Transparency as differentiator; definition + source are first-class UI.

**Theme 3: Inputs and outputs (v2+)**  
_Focus: How users ask and what they get beyond Yes/No._

- Input: voice (e.g. Alexa), paste link (Spotify/Apple/YouTube) → parse, fetch, answer.
- Output: song summary, artist details, related artists (phased after v1).
- Medium: same backend; website + API + Slack/Discord bot + Alexa skill.

_Pattern:_ Same core “is X a one-hit wonder?”; more ways in and more context out later.

**Theme 4: Discovery and engagement (v2+)**  
_Focus: Recurring use and fun beyond lookup._

- Song of the week (curated one-hit wonder on front page/sidebar).
- Quizzes by decade: “One-hit or not?” or “Name the one-hit wonder” (80s/90s/2000s).
- One-hit wonder playlist builder (pick from list → Spotify/Apple).
- Newsletter: “This week in one-hit wonder history” (when it was in top 40 + artist/song info); needs chart dates.
- Combine with Shazam-style (identify → answer), lyrics link, “random one-hit wonder.”

_Pattern:_ Same list and data; different formats (quiz, playlist, newsletter, discovery).

**Theme 5: Data and scope (v2+)**  
_Focus: Sources and regions._

- Wikipedia primary; playlists (Spotify, Apple “one-hit wonder” lists) or other sites as add-ons (“Also on these playlists,” “Other lists that include them”).
- Regions + automatic detection: US vs UK (and others); detect via IP/locale; “Using the [US/UK] list” + override; US only at launch.

_Pattern:_ One definition (v1); multiple sources/regions later.

**Cross-cutting / breakthroughs**

- **Definition + source as first-class UI:** Transparency at answer time and in shareable unit; not hidden behind a link.
- **v1 = one job, one list, one region:** Simplification as a product decision; validate before adding fluff.

---

**Prioritization Results**

- **v1 (ship first):** Core product (Theme 1) + transparency (Theme 2): search → answer + one hit + one-line definition always visible, US only, share = one compact line with definition. No quiz, playlist, newsletter, regions, lyrics, or related artists.
- **Quick win:** Wikipedia transparency always visible + magnify the one hit in result and share—implement with v1.
- **v2+ (after validate):** Reverse the question (quiz); regions + auto-detect; paste link; playlist builder; song of the week; newsletter “this week in history”; API/bots; song summary + artist details + related artists; optional playlists/other sources.

---

**Action planning: v1**

**Goal:** IsItAOneHitWonder.com v1 = search by song or artist → Yes/No + “the one hit” + one-line Wikipedia definition (always visible), US list only, shareable one-line. Publish on GitHub, serve over HTTPS.

**Next steps**

1. **Data:** Ingest Wikipedia US one-hit wonder list (API or scrape); normalize artist/song; store for client-side or build-time search (Astro).
2. **UI:** Single search (type artist or song) → result page: big verdict (Yes/No), hero line “The one hit: [Song] – [Artist],” one short line “We use the Wikipedia US one-hit wonder list: one top-40 hit in the US.” No extra links for definition.
3. **Share:** “Copy” or share produces one compact line: e.g. “Yes – Chumbawamba is a one-hit wonder (Wikipedia US list). The one hit: Tubthumping.”
4. **Deploy:** Static site (e.g. Astro) on GitHub Pages, HTTPS. Build/revalidate list on schedule (e.g. GitHub Actions) if list changes.

**Resources:** Wikipedia list source, Astro (or chosen stack), GitHub repo + Pages.  
**Success:** User can search, get correct Yes/No + one hit + definition, and share one line that includes definition. No scope beyond that for v1.

---

## Session Summary and Insights

**Key achievements**

- **40+ ideas** across five techniques (Role Playing, What If, Failure Analysis, Alien Anthropologist, SCAMPER).
- **Clear v1 vs v2+** from Eliminate and user choice: v1 = super simple, US only; v2+ = quiz, regions, playlist, newsletter, paste link, API/bots.
- **Transparency as product:** Definition + source always visible and in shareable unit; “why care” and “what we mean” surfaced in UI.
- **Structured backlog:** Themes (core, transparency, inputs/outputs, discovery, data/scope) with v1 action plan.

**Session reflections**

- Alien Anthropologist surfaced “why care” and “official list” as product opportunities (transparency, meaning in UI).
- SCAMPER produced concrete substitutes, combinations, adaptations, and the v1 simplification (E) and quiz-for-later (R).
- User preference for simple v1 and US-only focus gave a clear prioritization filter.

**Next steps**

1. Review this document and confirm v1 scope.
2. Start with data pipeline (Wikipedia US list) and result page (verdict + one hit + definition).
3. Add transparency line and share format from day one.
4. Park v2+ ideas (quiz, regions, playlist, newsletter, etc.) in backlog until v1 is live and validated.
