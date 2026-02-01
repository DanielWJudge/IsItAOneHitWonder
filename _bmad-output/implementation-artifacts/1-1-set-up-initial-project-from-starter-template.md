# Story 1.1: Set up initial project from starter template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the project initialized from the Astro minimal starter with TypeScript and Tailwind,
So that the codebase has a standard structure, build, and styling foundation for the static site.

## Acceptance Criteria

1. **Given** the project root is empty or ready for init  
   **When** I run `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm install`, then `npx astro add tailwind`  
   **Then** the project has `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `src/pages/`, `src/components/`, and `src/layouts/` (or equivalent)  
   **And** `astro dev` and `astro build` run successfully  
   **And** Tailwind utilities are available for styling

## Tasks / Subtasks

- [x] Task 1: Run Astro create command (AC: #1)
  - [x] Execute `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git` in project root
  - [x] Verify the command completes without overwriting existing `.github/`, `.gitignore`, or `_bmad/` directories
- [x] Task 2: Install dependencies (AC: #1)
  - [x] Run `npm install`
  - [x] Run `npx astro add tailwind` and accept defaults
- [x] Task 3: Verify build artifacts and config files (AC: #1)
  - [x] Confirm `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json` exist at root
  - [x] Confirm `src/pages/`, `src/components/`, `src/layouts/` exist
- [x] Task 4: Validate dev and build (AC: #1)
  - [x] Run `astro dev` and confirm server starts
  - [x] Run `astro build` and confirm successful static output
  - [x] Verify Tailwind classes work in a test component or page

## Dev Notes

### Architecture Compliance

- **Starter template (Architecture § Starter Template Evaluation):** Use the exact initialization command. Astro minimal + TypeScript strict + Tailwind. No install or git during create so we control those steps.
- **Project structure (Architecture § Project Structure & Boundaries):** After init, expect `src/pages/`, `src/components/`, `src/layouts/`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`. `scripts/` and `src/data/` will be added in later stories.
- **Workspace rule:** No purple/blue gradients or primary color. When adding custom theme tokens later, avoid purple/blue dominance.

### Technical Requirements

- **Node.js:** v18.20+, v20.3+, or v22+ (v19 and v21 not supported by Astro)
- **Astro:** Use `npm create astro@latest` — latest stable (v5.x as of 2025). The `--template minimal` produces a clean scaffold.
- **TypeScript:** Strict mode enabled via `--typescript strict`
- **Tailwind:** Added via `npx astro add tailwind`; integrates with Astro's build pipeline
- **Init target:** Current directory (`.`) — project root. Existing non-conflicting files (e.g. `.github/workflows/deploy.yml`, `.gitignore`, `_bmad/`) should remain; Astro create will add new files and may prompt if `package.json` exists. This project has no `package.json` yet, so init should proceed cleanly.

### File Structure Requirements

After initialization, the project MUST have:

| Path | Purpose |
|------|---------|
| `astro.config.mjs` | Astro configuration; `site` will be set in Story 1.5 |
| `tailwind.config.mjs` | Tailwind config; design tokens (no purple/blue primary) added in later stories |
| `tsconfig.json` | TypeScript strict config |
| `src/pages/` | Route pages; `index.astro` (home) added in Epic 2 |
| `src/components/` | Reusable components; empty initially |
| `src/layouts/` | Layout components; optional `BaseLayout.astro` in later stories |
| `public/` | Static assets |
| `package.json` | Dependencies; created by `npm install` |

Do NOT remove or overwrite:

- `.github/workflows/deploy.yml` (will be updated in Story 1.4)
- `.gitignore` (merge Astro's ignores if needed)
- `_bmad/`, `_bmad-output/`, `.cursor/`, `.ralph/`

### Library / Framework Versions

| Package | Version | Notes |
|---------|---------|-------|
| astro | latest (v5.x) | From `npm create astro@latest` |
| tailwindcss | latest | Via `npx astro add tailwind` |
| TypeScript | strict | From create command |

No manual version pinning required for this story; accept Astro and Tailwind defaults.

### Testing Requirements

- **Manual verification:** `astro dev` starts; `astro build` completes; no errors in console.
- **Tailwind check:** Add a simple Tailwind class (e.g. `class="text-lg"`) to the default page and confirm styling applies.
- No automated tests for this story; project setup validation is manual.

### Latest Tech Information

- **Astro v5.x:** Current stable. Create command: `npm create astro@latest`. Non-interactive: use `--template`, `--typescript`, `--no-install`, `--no-git` to avoid prompts.
- **Tailwind + Astro:** `npx astro add tailwind` installs `@astrojs/tailwind` and configures `tailwind.config.mjs`; no manual config needed.
- **Static output:** Astro defaults to `output: 'static'` for the minimal template; no change needed.

### Project Context Reference

- **PRD:** [Source: _bmad-output/planning-artifacts/prd.md] — Astro static site, build-time data, GitHub Pages, HTTPS.
- **Architecture:** [Source: _bmad-output/planning-artifacts/architecture.md] — Starter Template Evaluation, ADR-3 Deployment, Project Structure & Boundaries.
- **Epics:** [Source: _bmad-output/planning-artifacts/epics.md] — Epic 1 Story 1.1.
- **UX:** [Source: _bmad-output/planning-artifacts/ux-design-specification.md] — Tailwind with custom tokens; no purple/blue as primary.

### Project Structure Notes

- **Unified structure:** This story establishes the base. Later stories add: `scripts/`, `src/data/`, `src/pages/result/[slug].astro`, and component files per Architecture § Project Structure & Boundaries.
- **Conflicts:** None expected. Root has no `package.json`; Astro create adds new files. If prompts appear (e.g. overwrite), choose options that preserve `.github/` and `.gitignore`.

### References

- Astro install: https://docs.astro.build/en/install-and-setup/
- Architecture Starter Template: _bmad-output/planning-artifacts/architecture.md#starter-template-evaluation
- Epics Story 1.1: _bmad-output/planning-artifacts/epics.md#story-11-set-up-initial-project-from-starter-template

---

## Dev Agent Record

### Agent Model Used

Cursor / dev-story workflow (2026-02-01)

### Debug Log References

- Astro create was run in non-empty dir; create-astro scaffolded to subdir (cyan-crater) then files moved to root to preserve .github/, .gitignore, _bmad/.
- Tailwind v4 uses @tailwindcss/vite and CSS-first config (global.css); tailwind.config.mjs added for AC compliance; design tokens added in later stories.

### Completion Notes List

- Initialized Astro minimal template with TypeScript strict via npx create-astro@latest.
- Preserved existing .github/, .gitignore, _bmad/, _bmad-output/, .cursor/, .ralph/.
- npm install and npx astro add tailwind completed successfully.
- astro.config.mjs, tailwind.config.mjs, tsconfig.json, src/pages/, src/components/, src/layouts/, public/ created.
- astro dev and astro build run successfully; Tailwind utilities verified via text-lg on index page.

### Change Log

- 2026-02-01: Story 1-1 completed — Astro minimal template with TypeScript strict and Tailwind initialized; astro dev and astro build verified.
- 2026-02-01: Code review — Removed RALPH_TASK.md; added package.json engines, fetch-data placeholder script; updated index.astro title; clarified deploy workflow comment.

### Senior Developer Review (AI)

**Reviewer:** DJ on 2026-02-01

**Outcome:** Approve (after fixes applied)

**Findings addressed:**
- **RALPH_TASK.md removed** — Unrelated CLI todo app file removed from project root.
- **package.json engines** — Added `"engines": { "node": ">=18.20.0" }` per Dev Notes.
- **fetch-data script** — Added placeholder `"fetch-data": "echo \"Fetch step added in Story 1.4\""` for deploy workflow until Story 1.4.
- **index.astro title** — Updated from "Astro" to "Is It A One Hit Wonder".
- **Deploy workflow** — Comment clarified: "placeholder - full impl in Story 1.4".

**Outstanding (low / deferred):**
- Tailwind v4 build warning ("file" unknown CSS property) — Known upstream quirk; build succeeds; revisit if Tailwind releases fix.

### File List

- astro.config.mjs (new)
- tailwind.config.mjs (new)
- tsconfig.json (new)
- package.json (new)
- package-lock.json (new)
- .gitignore (modified - merged Astro/Tailwind ignores)
- src/pages/index.astro (new)
- src/components/.gitkeep (new)
- src/layouts/.gitkeep (new)
- src/styles/global.css (new)
- public/favicon.svg (new)
- public/favicon.ico (new)
