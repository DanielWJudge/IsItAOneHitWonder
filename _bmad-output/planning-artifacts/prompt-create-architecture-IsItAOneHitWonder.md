# World-Class Prompt: BMAD Create Architecture for IsItAOneHitWonder

Run the BMAD Create Architecture workflow for IsItAOneHitWonder. Act as Winston the Architect (🏗️).

**Command:** `/bmad-bmm-create-architecture`  
**Agent:** Load Winston via `/bmad:balancing 'what could be' with 'what should be.':agent:architect`

---

## Project Context Summary

**Product:** IsItAOneHitWonder.com — US-only lookup site: search by song or artist → Yes/No verdict + "The one hit: [Song] – [Artist]" + one-line definition with source always visible. Data from Wikipedia US one-hit wonder list. Transparency is core: definition and source are first-class in the UI and in the shareable one-line.

**Classification:** `web_app`, `general` domain, `low` complexity, `greenfield`. Static MPA (Astro), not SPA.

---

## Mandatory Input Documents (load fully, in order)

1. **PRD** — `_bmad-output/planning-artifacts/prd.md`  
   - Executive summary, success criteria, user journeys (1–5), MVP scope, FR1–FR19, NFR-P/S/A/I.

2. **UX Design Specification** — `_bmad-output/planning-artifacts/ux-design-specification.md`  
   - Design system (Tailwind, no purple/blue primary), component strategy (search form, result block, copy button, footer), WCAG AA, mobile-first, shareable URLs.

3. **Technical Research** — `_bmad-output/planning-artifacts/research/technical-domain-isit-a-one-hit-wonder-v1-research-2026-02-01.md`  
   - MediaWiki API, wikitext parsing, build-time JSON, Fuse.js/MiniSearch, GitHub Actions, GitHub Pages, CC BY-SA 4.0.

4. **Product Brief** — `_bmad-output/planning-artifacts/product-brief-IsItAOneHitWonder-2026-02-01.md`  
   - Vision, target users, MVP scope, out-of-scope.

5. **PRD Validation Report** — `_bmad-output/planning-artifacts/prd-IsItAOneHitWonder-2026-02-01-validation-report.md`  
   - Pass, 4/5 quality. Use for actionable findings (e.g. FR4/FR17 wording) and traceability.

---

## Architecture Decisions to Address

The architecture document must cover and justify:

| Decision Area | Constraints & Requirements | Source |
|---------------|----------------------------|--------|
| **Data pipeline** | MediaWiki API fetch, wikitext parse to artist/song/year, build-time JSON, weekly refresh via GitHub Actions, `continue-on-error` on fetch | PRD FR15–17, NFR-I1–I2, Research §2, §5.1 |
| **Search** | Client-side on build-time data; Fuse.js or MiniSearch; no runtime API for list data; results within ~2s | PRD FR4, FR17, NFR-P2–P3, Research §4.2 |
| **Deployment** | Astro static output → GitHub Pages, HTTPS, `site` in astro.config matches Pages URL | PRD FR18, Research §4.4–4.5 |
| **Attribution** | CC BY-SA 4.0, visible source link + license link in UI and footer | PRD FR11–12, Research §2.5, §5.2 |
| **URLs & SEO** | Clean URLs (e.g. `/result/chumbawamba`), indexable result pages, descriptive meta | PRD Web App §SEO, UX §Platform Strategy |
| **Accessibility** | WCAG 2.1 Level AA, keyboard and screen reader support for search and copy | PRD NFR-A1–A4, UX §Accessibility |
| **Error handling** | Graceful no-match ("No" / "Not on our list" + same definition/source); fetch failure → cached data | PRD FR13–14, FR17 |
| **Share/copy** | One-line share (verdict + definition + one hit); clipboard API; clear feedback | PRD FR9–10, UX §Copy button |

---

## Design & Technical Constraints (from UX & Rules)

- No purple/blue gradients or purple/blue as primary color (workspace rule).
- Tailwind CSS with custom tokens; minimal custom components (search, result block, copy, footer).
- Mobile-first; touch targets ≥44px.
- Astro MPA; build-time data; no runtime API for list data.

---

## Workflow Behavior

- Use the micro-file architecture: follow each step file in order; do not skip steps.
- Treat this as collaborative discovery, not a template fill-in.
- Produce a decision-focused architecture document so implementation agents can avoid conflicts.
- Add architectural decisions using the ADR-style template from `architecture-decision-template.md`.
- Call out trade-offs (e.g. Fuse.js vs MiniSearch, wikitext parsing strategy).
- Ensure traceability to PRD FRs/NFRs, user journeys, and UX components.
- Document the data model (artist, song, year, search index structure).
- Document the build pipeline (fetch → parse → JSON → build → deploy).

---

## Output Location

- **Path:** `_bmad-output/planning-artifacts/architecture.md`
- **Format:** Markdown with frontmatter; sections added step-by-step.
- **Frontmatter:** `inputDocuments`, `stepsCompleted`, `workflowType: 'architecture'`, `project_name`, `user_name`, `date`.

---

## Success Criteria for the Architecture Document

When the workflow is complete, the architecture document must:

1. Fully satisfy PRD FR1–FR19 and NFR-P, NFR-S, NFR-A, NFR-I.
2. Support UX search form, result block, copy button, footer, and responsive behavior.
3. Implement the research recommendations (MediaWiki API, weekly refresh, build-time JSON, client-side search).
4. Be usable by epics/stories and implementation agents without extra clarification.
5. Document at least: data pipeline, search approach, deployment, attribution, error/edge handling.

---

**Usage:** Use this prompt in a fresh context window with the Architect agent loaded. Run `/bmad-bmm-create-architecture` and load the documents above as input before starting the workflow steps.
