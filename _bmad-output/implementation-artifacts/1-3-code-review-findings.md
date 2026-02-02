# Code Review: Story 1.3 — Wire build-time JSON into Astro and static output

**Story:** 1-3-wire-build-time-json-into-astro-and-static-output  
**Reviewer:** AI (adversarial senior developer)  
**Date:** 2026-02-01  
**Git vs Story Discrepancies:** 1 (sprint-status.yaml modified but not in story File List; _bmad-output excluded from source review, noted for transparency)

---

## Summary

| Severity | Count |
|----------|-------|
| High     | 0     |
| Medium   | 4     |
| Low      | 3     |

**Total issues:** 7

---

## Acceptance Criteria Validation

- **AC #1:** Given `src/data/one-hit-wonders.json` exists, When `astro build` runs, Then Astro reads the JSON, build completes without runtime API for list data (FR17), built output includes list data for client-side search.  
  **Verdict:** IMPLEMENTED. index.astro and result/[slug].astro import JSON at build; Vite bundles it; no fetch to MediaWiki during build. List data inlined in `dist/index.html` via `window.__ONE_HIT_WONDERS__`; 1534 result pages generated under `dist/result/<slug>/index.html`.

---

## Task Completion Audit

- **Task 1:** Astro reads JSON at build — ✓ Verified in index.astro:4 and [slug].astro:6.
- **Task 2:** List data in built output for client-side search — ✓ Verified in dist/index.html via `window.__ONE_HIT_WONDERS__`.
- **Task 3:** result/[slug].astro with getStaticPaths — ✓ Verified; one HTML per slug.

All tasks marked [x] are implemented. No false claims.

---

## CRITICAL ISSUES

- None. No tasks claimed done but missing; no ACs unimplemented.

---

## MEDIUM ISSUES

1. **Result page has no styles** [src/pages/result/[slug].astro]  
   The result page does not import `../styles/global.css` and uses no shared layout. The built `dist/result/chumbawamba/index.html` contains no `<link rel="stylesheet">`. Result pages render with raw HTML and no Tailwind/project styles, while the index page has Tailwind. Inconsistent UX and violates architecture’s expectation of shared layout/styling across pages.

2. **Type annotation mismatch for `year`** [src/pages/result/[slug].astro:9]  
   The inline type `{ year: number }` does not match the JSON schema. `one-hit-wonders.json` stores `year` as a string (e.g. `"1951"`). Architecture allows "string or number," but the type annotation is incorrect and could mislead future code (e.g. numeric operations). Use `year: string | number` or align the fetch script to output numbers.

3. **No shared layout or head consistency** [src/pages/result/[slug].astro]  
   index.astro includes favicon links, generator meta, and global.css. The result page omits favicon links and generator meta. Architecture mentions `BaseLayout.astro`; layouts/ exists but BaseLayout is not used. Result pages will diverge in structure and assets, increasing maintenance burden.

4. **Duplicate JSON imports without deduplication guarantee** [src/pages/index.astro:4, src/pages/result/[slug].astro:6]  
   Both pages import `one-hit-wonders.json`. Vite may dedupe at build, but the pattern encourages drift (e.g. one page importing a different path later). Consider a shared data module (e.g. `src/data/load-list.ts`) that imports once and re-exports, or document the single-source contract explicitly.

---

## LOW ISSUES

5. **sprint-status.yaml modified but not in story File List**  
   Git shows `_bmad-output/implementation-artifacts/sprint-status.yaml` modified. Story File List only documents `src/pages/index.astro` and `src/pages/result/[slug].astro`. Sprint tracking changes are implementation artifacts; document them in the story if the workflow expects it.

6. **Large inline payload in index.html**  
   The full list (~1534 entries) is inlined in `dist/index.html` via `define:vars`, producing a large HTML file. PRD NFR-P1 targets FCP within 3s on typical 4G; may be acceptable. Consider documenting or future-optimizing with a static JSON asset (`/one-hit-wonders.json`) if bundle size becomes a concern.

7. **No duplicate-slug guard in getStaticPaths** [src/pages/result/[slug].astro:8–12]  
   `getStaticPaths()` maps over JSON entries as-is. Duplicate slugs in the data would produce duplicate params; Astro behavior is undefined. The fetch script (Story 1.2) should enforce uniqueness; adding a runtime check (e.g. `new Set(slugs).size === slugs.length`) would harden the build.

---

## What should I do with these issues?

1. **Fix them automatically** — I'll update the code (and story File List / Dev Agent Record if needed).
2. **Create action items** — Add a "Review Follow-ups (AI)" subsection to the story Tasks with `- [ ] [AI-Review][Severity] Description [file:line]`.
3. **Show me details** — Deep dive into specific issues.

Choose **[1]**, **[2]**, or specify which issue to examine.
