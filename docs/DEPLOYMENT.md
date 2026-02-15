# Deployment

This site is deployed to GitHub Pages via GitHub Actions.

## First-Time Setup

Ensure `src/data/one-hit-wonders.json` exists before the first deploy. It is committed as a fallback so that:

- Fresh clones can build without running the fetch script first
- When the Wikipedia API fetch fails in CI, the build proceeds with the last known data

To regenerate the data locally, run `npm run fetch-data` before committing.

## GitHub Pages Setup

**Important:** In the repository Settings → Pages, set the **Source** to **"GitHub Actions"** (not "Deploy from a branch"). The workflow uses `peaceiris/actions-gh-pages`, which pushes to the `gh-pages` branch via Actions.

## Workflow

The `.github/workflows/deploy.yml` workflow:

1. **Fetch** – Runs `npm run fetch-data` to update Wikipedia one-hit-wonders data. Uses `continue-on-error: true` so a failed fetch does not block the build; the build proceeds with cached `src/data/one-hit-wonders.json`.
2. **Build** – Runs `npm run build` (Astro build).
3. **Deploy** – Publishes `./dist` to GitHub Pages.

## Triggers

- **Push to main** – Deploys on every merge to `main`
- **Weekly schedule** – Runs every Sunday at 00:00 UTC (`0 0 * * 0`)
- **Manual** – Use the "Run workflow" button in the Actions tab (`workflow_dispatch`)
