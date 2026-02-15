# Story 2.1: Home page with single prominent search control

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want a single, prominent search control on the main page,
so that I can quickly enter an artist or song and trigger a search.

## Acceptance Criteria

1. **Given** I am on the home page (e.g. `/`)  
   **When** the page has loaded  
   **Then** I see one primary search control (input + submit or equivalent) above the fold  
   **And** the control is labeled or has an accessible name (e.g. "Search by artist or song") (FR3, NFR-A2)  
   **And** the search input and submit are keyboard-operable with visible focus indicators (NFR-A2)  
   **And** touch targets for the input and submit are at least 44px (UX)

## Tasks / Subtasks

- [x] Task 1: Create SearchForm component (AC: #1)
  - [x] Subtask 1.1: Create `src/components/SearchForm.astro` with text input and submit button
  - [x] Subtask 1.2: Add label "Search by artist or song" (visible or sr-only, associated with input)
  - [x] Subtask 1.3: Ensure submit button has accessible name "Search"
  - [x] Subtask 1.4: Apply touch target min 44px (height/width) for input and submit
  - [x] Subtask 1.5: Add visible focus indicators (ring/outline) for keyboard users
- [x] Task 2: Integrate SearchForm into home page (AC: #1)
  - [x] Subtask 2.1: Import SearchForm in `src/pages/index.astro`
  - [x] Subtask 2.2: Place SearchForm above the fold (below h1, within main viewport)
  - [x] Subtask 2.3: Use semantic HTML: `<main>`, `<form>`, `<label>`, `<input>`, `<button>`
- [x] Task 3: Verify accessibility and layout (AC: #1)
  - [x] Subtask 3.1: Test keyboard: Tab to input, type, Enter to submit
  - [x] Subtask 3.2: Verify focus indicators visible on all focusable elements
  - [x] Subtask 3.3: Verify touch targets ≥44px on mobile viewport

## Dev Notes

### Architecture Compliance

- **ADR-6 Accessibility (Architecture § ADR-6):** Search input and submit: keyboard-operable, visible focus indicators, associated label (e.g. "Search by artist or song").
- **Project structure (Architecture § Implementation Patterns):** `src/components/SearchForm.astro` — input + submit; triggers client-side search and navigation. For this story, **only the UI** (input + submit) is required; search logic and navigation are Story 2.2.
- **Component boundaries:** SearchForm is the single entry point for the core task; one per page; above the fold on mobile.

### Technical Requirements

- **SearchForm:** Input + submit button; no search logic yet (submit can do nothing or `preventDefault` for now; Story 2.2 wires search).
- **Form semantics:** Use `<form>` with `action` and `method` or client-side; `<label for="input-id">` for accessibility.
- **Placeholder:** "Artist or song" (e.g. `placeholder="Artist or song"`).
- **Touch targets:** Min 44×44px per UX spec; use Tailwind `min-h-[44px]` or equivalent.

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Astro | ^5.17.1 — Astro components; no client directive needed for static form (submit handler in Story 2.2) |
| Tailwind CSS | ^4.1.18 — Use utilities for layout, spacing, focus ring. **No purple/blue as primary** (workspace rule). |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `src/components/SearchForm.astro` | **Create.** Search form component: input + submit. |
| `src/pages/index.astro` | **Modify.** Add SearchForm; keep existing `BaseLayout`, h1, list data script. |

### Testing Requirements

- **Visual:** Home page shows search control above the fold; input and submit visible and sized correctly.
- **Keyboard:** Tab to input, type, Enter to submit; focus indicators visible.
- **Touch:** Tap targets ≥44px on mobile viewport (e.g. 375px width).
- **Accessibility:** Run axe or Lighthouse; fix critical/serious issues. Label associated with input; submit has accessible name.
- No automated unit tests required for this story; manual verification sufficient.

### Previous Story Intelligence (Epic 1 – 1-5)

- **index.astro:** Already has `BaseLayout`, h1, and list data inlined via `window.__ONE_HIT_WONDERS__`. List data is in `src/data/load-list.ts` → `one-hit-wonders.json`. Do not remove or change the list data script.
- **BaseLayout:** Uses `import.meta.env.BASE_URL` for favicons; do not modify layout for this story.
- **Tailwind:** `@tailwindcss/vite` and `tailwindcss` v4; `global.css` has `@import "tailwindcss"`. Use `ring-2`, `ring-offset-2`, or `focus:ring-*` for focus indicators.
- **Design constraint:** No purple/blue gradients or primary color (workspace rule).

### Git Intelligence Summary

- **Recent commits:** Story 1-5 (site URL, HTTPS), 1-4 (CI workflow), 1-3 (wire JSON, BaseLayout, load-list).
- **Patterns:** Components in `src/components/`; pages in `src/pages/`; Astro + Tailwind. No SearchForm exists yet.
- **Conventions:** PascalCase for component files (e.g. `SearchForm.astro`).

### Latest Tech Information (Astro, Tailwind)

- **Astro forms:** Use standard HTML `<form>`, `<input>`, `<button>`. For client-side submit (Story 2.2), add `client:load` or `client:visible` script.
- **Tailwind focus ring:** `focus:ring-2 focus:ring-offset-2 focus:ring-amber-500` (or equivalent non-purple/blue accent) for visible focus.
- **WCAG focus:** 2px outline or ring sufficient; ensure contrast with background.

### Project Structure Notes

- **Alignment:** Architecture specifies `SearchForm.astro` in `src/components/`. Project structure matches.
- **No conflicts:** This story adds SearchForm and integrates it into index.astro; does not change layout, data, or scripts.

### References

- [Astro Components](https://docs.astro.build/en/core-concepts/astro-components/)
- [WCAG 2.1 Level AA - Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [UX Design - Search form component](_bmad-output/planning-artifacts/ux-design-specification.md)
- Architecture ADR-6: _bmad-output/planning-artifacts/architecture.md

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Created SearchForm.astro with semantic form, label (sr-only), input, and submit button; placeholder "Artist or song"; min-h-[44px]/min-w-[44px] for touch targets; focus:ring-2 focus:ring-amber-500 for keyboard focus indicators (ADR-6).
- Integrated SearchForm into index.astro within `<main>` above the fold; preserved list data script.
- Build passes; manual verification: keyboard operable, focus indicators, 44px touch targets per AC.
- Code review (2026-02-15): Fixed submit handler to use `getElementById('search-form')`; removed redundant aria-labels on input and button; added form id and improved h1 hierarchy (text-2xl); File List updated to include sprint-status.yaml.

### File List

- src/components/SearchForm.astro (created)
- src/pages/index.astro (modified)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modified; tracking)

## Change Log

- 2026-02-15: Implemented SearchForm component and integrated into home page; all AC satisfied.
- 2026-02-15: Code review fixes: component-scoped form id and submit handler, removed redundant a11y attributes, h1 hierarchy; File List and Dev Agent Record updated.
