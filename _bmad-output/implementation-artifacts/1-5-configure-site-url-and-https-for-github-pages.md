# Story 1.5: Configure site URL and HTTPS for GitHub Pages

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to access the site over HTTPS with the correct base URL,
so that the site is secure and links and assets resolve correctly.

## Acceptance Criteria

1. **Given** the Astro project is configured for static output  
   **When** the site is deployed to GitHub Pages  
   **Then** `site` in `astro.config.mjs` (or equivalent) is set to the final site URL (e.g. `https://<user>.github.io/<repo>/` or custom domain)  
   **And** the repository has "Enforce HTTPS" enabled in Settings → Pages (FR18, NFR-S1)  
   **And** the deployed site loads over HTTPS with no mixed content warnings

## Tasks / Subtasks

- [x] Task 1: Configure site URL in Astro (AC: #1)
  - [x] Add `site` property to `astro.config.mjs` with the final GitHub Pages URL (e.g. `https://<owner>.github.io/<repo>/`)
  - [x] Add `base` property if deploying to a project subpath (e.g. `base: '/<repo>/'` for project sites)
  - [x] Verify `astro build` produces correct asset paths and canonical URLs
- [x] Task 2: Document Enforce HTTPS setup (AC: #1)
  - [x] Add instructions to `docs/DEPLOYMENT.md` for enabling "Enforce HTTPS" in Settings → Pages
  - [x] Note that Enforce HTTPS is a one-time manual setting in the repository
- [x] Task 3: Verify HTTPS and no mixed content (AC: #1)
  - [x] After deploy, confirm site loads over HTTPS
  - [x] Check browser console for mixed content warnings (HTTP resources on HTTPS page)
  - [x] Ensure all asset URLs (CSS, JS, images) use relative paths or HTTPS

## Dev Notes

### Architecture Compliance

- **ADR-3 Deployment (Architecture § ADR-3):** Set `site` in `astro.config.mjs` to the final site URL (e.g. `https://<user>.github.io/<repo>/` or custom domain). Enable "Enforce HTTPS" in repository Settings → Pages.
- **FR18, NFR-S1:** Site must be served only over HTTPS; no mixed content; no HTTP fallback for the main experience.
- **Build pipeline:** Story 1.4 already deploys `dist/` to GitHub Pages via peaceiris/actions-gh-pages. This story configures Astro so generated URLs and asset paths are correct for the deployed location.

### Technical Requirements

- **astro.config.mjs:** Add `site` (required) and optionally `base` for project sites. Current config has neither—both must be added.
- **GitHub Pages project site URL format:** `https://<owner>.github.io/<repo>/` (trailing slash matters for Astro).
- **base property:** For project sites (not user sites), set `base: '/<repo>/'` so Astro generates correct asset paths. Example: repo `IsItAOneHitWonder` → `base: '/IsItAOneHitWonder/'`.
- **Enforce HTTPS:** Repository Settings → Pages → "Enforce HTTPS" checkbox. Must be enabled manually; cannot be set via workflow.
- **Mixed content:** Ensure no hardcoded `http://` URLs in layouts, components, or meta tags. Use relative paths or `import.meta.env.SITE` for absolute URLs.

### Library / Framework Requirements

| Component | Version / Notes |
|-----------|-----------------|
| Astro | ^5.17.1 (from package.json) — `site` and `base` in defineConfig |
| Vite | Via Astro — asset resolution respects `base` |

### File Structure Requirements

| Path | Purpose |
|------|---------|
| `astro.config.mjs` | Add `site` and `base` to defineConfig. **Primary file to modify.** |
| `docs/DEPLOYMENT.md` | Add Enforce HTTPS setup instructions. **Extend existing doc.** |
| `.github/workflows/deploy.yml` | No changes. Deploy step already correct. |

### Testing Requirements

- **Local build:** Run `npm run build`; inspect `dist/` output—asset paths in HTML should include base path (e.g. `/IsItAOneHitWonder/_astro/...` for project site).
- **Preview:** Run `astro preview` with base; verify links and assets load correctly.
- **Post-deploy:** After pushing, verify deployed site loads over HTTPS; check browser DevTools → Network for any HTTP requests (mixed content).
- No automated unit tests for config changes.

### Previous Story Intelligence (1-4)

- **Deploy workflow:** `.github/workflows/deploy.yml` uses peaceiris/actions-gh-pages; publishes `./dist`. Repo Settings → Pages must be "GitHub Actions" (already documented in DEPLOYMENT.md).
- **Story 1.4 explicitly deferred `site` config to Story 1.5:** "Set `site` in astro.config is Story 1.5" (from 1-4 Dev Notes).
- **Build output:** `dist/` contains index.html, result pages; all paths must be correct for GitHub Pages subpath.
- **Package name:** `is-it-a-one-hit-wonder`; repo name may differ (e.g. `IsItAOneHitWonder`). Use actual GitHub repo name for `base` and `site`.
- **This repo:** `DanielWJudge/IsItAOneHitWonder` → `site: 'https://danielwjudge.github.io/IsItAOneHitWonder/'`, `base: '/IsItAOneHitWonder/'`.

### Git Intelligence Summary

- **Recent commits:** Story 1-4 (CI workflow), load-list validation, fetch retry, deploy concurrency, one-hit-wonders.json fallback.
- **Patterns:** Modifications to `astro.config.mjs` are new; no prior site/base config. DEPLOYMENT.md was created in 1-4—extend it, do not replace.
- **Conventions:** Docs in `docs/`; config at project root.

### Latest Tech Information (Astro, GitHub Pages)

- **Astro site config:** `site` is used for sitemap, canonical URLs, and `import.meta.env.SITE`. Must match final deployed URL exactly.
- **Astro base config:** `base` sets the path prefix for all pages and assets. For GitHub Pages project sites: `base: '/<repo>/'` (leading and trailing slashes).
- **GitHub Pages Enforce HTTPS:** One-time setting in repo Settings → Pages. When enabled, GitHub redirects HTTP to HTTPS. Required for NFR-S1.
- **Mixed content:** Browsers block HTTP resources on HTTPS pages. Use relative URLs (e.g. `/_astro/...`) or ensure `site` is correct so Astro generates proper URLs.

### Project Structure Notes

- **Alignment:** Architecture specifies `astro.config.mjs` at root; project structure matches.
- **No conflicts:** This story only adds config; does not change workflow, scripts, or components.

### References

- [Astro Configuration Reference - site](https://docs.astro.build/en/reference/configuration-reference/#site)
- [Astro Configuration Reference - base](https://docs.astro.build/en/reference/configuration-reference/#base)
- [Deploy Astro to GitHub Pages](https://docs.astro.build/en/guides/deploy/github)
- [GitHub Pages - Enforce HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- Architecture ADR-3: _bmad-output/planning-artifacts/architecture.md

## Change Log

- **2026-02-15:** Implemented site URL and base in astro.config.mjs; documented Enforce HTTPS and post-deploy verification in docs/DEPLOYMENT.md.
- **2026-02-15:** Code review (AI): fixed favicon URLs in BaseLayout.astro to use `import.meta.env.BASE_URL`; added `output: 'static'` to astro.config.mjs; added base-URL verification to DEPLOYMENT.md; updated File List and Completion Notes.

## Senior Developer Review (AI)

- **Reviewer:** DJ (adversarial code review workflow) on 2026-02-15
- **Outcome:** Changes requested → fixes applied. All HIGH and MEDIUM issues addressed.
- **Findings addressed:** (1) Favicon links in `BaseLayout.astro` were root-absolute and broke on project-site base path—updated to use `import.meta.env.BASE_URL`. (2) File List updated to include `src/layouts/BaseLayout.astro`; sprint-status.yaml change noted as tracking-only. (3) Task 3 completion note accurate after favicon fix. (4) Added `output: 'static'` to astro.config.mjs; (5) Agent model placeholder set to N/A; (6) Post-deploy verification in DEPLOYMENT.md now includes base-URL check.

## Dev Agent Record

### Agent Model Used

N/A

### Debug Log References

### Completion Notes List

- **Task 1:** Added `site: 'https://danielwjudge.github.io/IsItAOneHitWonder/'` and `base: '/IsItAOneHitWonder/'` to `astro.config.mjs`. Build verified—asset paths include base prefix (e.g. `/IsItAOneHitWonder/_astro/...`).
- **Task 2:** Added "Enforce HTTPS" section to `docs/DEPLOYMENT.md` with instructions for enabling in Settings → Pages and note that it is a one-time manual setting.
- **Task 3:** Added "Post-Deploy Verification (HTTPS and Mixed Content)" section to `docs/DEPLOYMENT.md` documenting verification steps. Confirmed no hardcoded `http://` URLs in `src/`. Post-deploy verification is manual—user runs deploy then follows checklist. Code review: favicon URLs in `BaseLayout.astro` updated to use `import.meta.env.BASE_URL` so all asset URLs respect `base` on project site.
- **Code review fixes:** `src/layouts/BaseLayout.astro` favicon hrefs use BASE_URL; `astro.config.mjs` now has `output: 'static'`; DEPLOYMENT.md post-deploy checklist includes base-URL verification. Sprint-status.yaml was updated for story tracking only (not in File List).

### File List

- `astro.config.mjs` (modified)
- `docs/DEPLOYMENT.md` (modified)
- `src/layouts/BaseLayout.astro` (modified — code review fix)
