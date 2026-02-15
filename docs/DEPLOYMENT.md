# Deployment

This site is deployed to GitHub Pages via GitHub Actions.

## First-Time Setup

Ensure `src/data/one-hit-wonders.json` exists before the first deploy. It is committed as a fallback so that:

- Fresh clones can build without running the fetch script first
- When the Wikipedia API fetch fails in CI, the build proceeds with the last known data

To regenerate the data locally, run `npm run fetch-data` before committing.

## GitHub Pages Setup

**Important:** In the repository Settings → Pages, set the **Source** to **"GitHub Actions"** (not "Deploy from a branch"). The workflow uses `peaceiris/actions-gh-pages`, which pushes to the `gh-pages` branch via Actions.

### Enforce HTTPS

Enable **"Enforce HTTPS"** in Settings → Pages. This is a one-time manual setting that:

- Redirects HTTP requests to HTTPS
- Ensures the site is served only over HTTPS (required for NFR-S1)
- Prevents mixed content issues

**Note:** Enforce HTTPS cannot be set via workflow or API; it must be enabled manually in the repository Settings.

## Workflow

The `.github/workflows/deploy.yml` workflow:

1. **Fetch** – Runs `npm run fetch-data` to update Wikipedia one-hit-wonders data. Uses `continue-on-error: true` so a failed fetch does not block the build; the build proceeds with cached `src/data/one-hit-wonders.json`.
2. **Build** – Runs `npm run build` (Astro build).
3. **Deploy** – Publishes `./dist` to GitHub Pages.

## Triggers

- **Push to main** – Deploys on every merge to `main`
- **Weekly schedule** – Runs every Sunday at 00:00 UTC (`0 0 * * 0`)
- **Manual** – Use the "Run workflow" button in the Actions tab (`workflow_dispatch`)

## Post-Deploy Verification (HTTPS and Mixed Content)

After deploying, verify the site meets AC1:

1. **Base URL:** Confirm the site loads at the correct URL (e.g. `https://<owner>.github.io/<repo>/` for a project site). Check that in-page links and assets resolve under that path.
2. **HTTPS:** Confirm the site loads over `https://` (not `http://`). GitHub Pages should redirect HTTP to HTTPS when Enforce HTTPS is enabled.
3. **Mixed content:** Open DevTools → Console and check for mixed content warnings (HTTP resources on an HTTPS page). There should be none.
4. **Asset URLs:** In DevTools → Network, ensure all requests (CSS, JS, images) use HTTPS or relative paths. No `http://` requests should appear.
