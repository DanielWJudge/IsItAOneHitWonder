# Code Review: Story 1.2 — Fetch and parse script for Wikipedia one-hit wonder list

**Story:** 1-2-implement-fetch-and-parse-script-for-wikipedia-one-hit-wonder-list  
**Reviewer:** AI (adversarial senior developer)  
**Date:** 2026-02-01  
**Git vs Story Discrepancies:** 0 (working tree clean; story File List matches committed scope)

---

## Summary

| Severity | Count |
|----------|--------|
| High     | 0     |
| Medium   | 3     |
| Low      | 4     |

**Total issues:** 7

---

## Acceptance criteria validation

- **AC #1:** Script uses MediaWiki Action API (`action=query`, `prop=revisions`, `rvprop=content`, `titles=List_of_one-hit_wonders_in_the_United_States`), parses wikitext to artist/song/year, assigns URL-safe slug, outputs JSON to `src/data/one-hit-wonders.json`, API only (no scraping).  
  **Verdict:** IMPLEMENTED. API URL, extraction path, parser, slug uniqueness, and output path match story and ADR-1.

---

## Task completion audit

- All tasks marked [x] were verified against the codebase. No tasks are falsely marked complete.

---

## CRITICAL ISSUES

- None. No tasks claimed done but missing; no ACs unimplemented.

---

## MEDIUM ISSUES

1. **No timeout on `fetch()`** [scripts/fetch-one-hit-wonders.js:23]  
   The script can hang indefinitely if the network or Wikipedia is slow or unresponsive. Add `AbortController` + `setTimeout` (e.g. 30s) and pass `signal` to `fetch()` so the script fails with a clear error instead of hanging.

2. **`res.json()` can throw on non-JSON response** [scripts/fetch-one-hit-wonders.js:32]  
   If the API returns 200 with HTML (e.g. error page or redirect), `res.json()` throws. The rejection is caught by `main().catch()`, but the error message is opaque (e.g. "SyntaxError: Unexpected token <"). Either wrap `res.json()` in try/catch and exit with a clear message, or check `Content-Type` and fail explicitly when not JSON.

3. **`writeFileSync` not in try/catch** [scripts/fetch-one-hit-wonders.js:141]  
   Sync write can throw (e.g. disk full, permission denied). That throw is not in the async `main()` chain, so it is not caught by `main().catch()`. Wrap the write (and optional `mkdirSync`) in try/catch and exit with a clear message and non-zero exit code.

---

## LOW ISSUES

4. **Incomplete User-Agent URL** [scripts/fetch-one-hit-wonders.js:24]  
   User-Agent is `IsItAOneHitWonder/1.0 (https://github.com/)`. MediaWiki etiquette recommends a full project/repo URL. Use the actual repo URL (e.g. `https://github.com/<user>/IsItAOneHitWonder`) when known.

5. **Citations only stripped at end of string** [scripts/fetch-one-hit-wonders.js:76]  
   Parser strips `[47]`-style citations only with `\s*\[\d+\]\s*$`. Citations in the middle of artist or song text are left in. Consider a global citation strip (e.g. replace `\[\d+\]` with empty string) if the Wikipedia list uses mid-string citations.

6. **Single exit code for all errors**  
   Story says "Handle API errors (network, 404, invalid response) with clear exit codes." The script uses only `process.exit(1)`. For better scriptability, consider distinct exit codes (e.g. 1 = network, 2 = API/404, 3 = parse/file).

7. **No sanity check that response is the expected list**  
   If the API returns a different page (e.g. wrong title or redirect), the script still parses and writes. A quick check (e.g. content includes "one-hit wonder" or expected section header) could avoid writing misleading data.

---

## What should I do with these issues?

1. **Fix them automatically** — I'll update the script (and tests if any) and update the story File List / Dev Agent Record if needed.  
2. **Create action items** — Add a "Review Follow-ups (AI)" subsection to the story Tasks with `- [ ] [AI-Review][Severity] Description [file:line]`.  
3. **Show me details** — Deep dive into specific issues.

Choose **[1]**, **[2]**, or specify which issue to examine.
