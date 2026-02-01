/**
 * Fetch Wikipedia US one-hit wonder list via MediaWiki API and output structured JSON.
 * Uses API only (no scraping). Output: src/data/one-hit-wonders.json
 * Run: node scripts/fetch-one-hit-wonders.js
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_PATH = join(ROOT, "src", "data", "one-hit-wonders.json");

const API_URL =
  "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&titles=List_of_one-hit_wonders_in_the_United_States&formatversion=2&format=json";

/**
 * Fetch wikitext from MediaWiki API.
 * @returns {Promise<string>} Raw wikitext content
 */
async function fetchWikitext() {
  const res = await fetch(API_URL, {
    headers: { "User-Agent": "IsItAOneHitWonder/1.0 (https://github.com/)" },
  });

  if (!res.ok) {
    console.error(`API request failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  if (data.error) {
    console.error("API error:", data.error.info || data.error);
    process.exit(1);
  }

  const pages = data?.query?.pages;
  if (!pages?.length) {
    console.error("No pages in API response");
    process.exit(1);
  }

  const revisions = pages[0]?.revisions;
  if (!revisions?.length) {
    console.error("No revisions in API response");
    process.exit(1);
  }

  const content = revisions[0]?.slots?.main?.content;
  if (content == null) {
    console.error("No wikitext content in API response");
    process.exit(1);
  }

  return content;
}

/**
 * Parse one line of wikitext into { artist, song, year } or null.
 * Handles: * [[Artist]] – "[[Song]]" (YEAR), * Artist – "Song" (YEAR), citations [47].
 * @param {string} line
 * @returns {{ artist: string, song: string, year: string } | null}
 */
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("*")) return null;
  const rest = trimmed.slice(1).trim();
  // Match – or - between artist and "Song", then (YEAR)
  const match = rest.match(/^(.+?)\s*[–\-]\s*["'](.+?)["']\s*\((\d{4})\)/);
  if (!match) return null;
  let [, artistPart, songPart, year] = match;
  // Strip wikilinks [[x]] or [[x|y]] and external links [url text]
  const stripLinks = (s) =>
    s
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => (b || a).trim())
      .replace(/\[https?:\/[^\]\s]+\s+([^\]]+)\]/g, "$1")
      .replace(/\s*\[\d+\]\s*$/g, "")
      .trim();
  artistPart = stripLinks(artistPart);
  songPart = stripLinks(songPart);
  if (!artistPart || !songPart || !year) return null;
  return { artist: artistPart, song: songPart, year };
}

/**
 * Parse full wikitext into array of { artist, song, year }.
 * Skips section headers (== ... ==) and non-entry lines.
 * @param {string} wikitext
 * @returns {{ artist: string, song: string, year: string }[]}
 */
function parseWikitext(wikitext) {
  const entries = [];
  const lines = wikitext.split(/\r?\n/);
  for (const line of lines) {
    if (/^=+[^=]+=+$/.test(line.trim())) continue;
    const parsed = parseLine(line);
    if (parsed) entries.push(parsed);
  }
  return entries;
}

/**
 * Generate URL-safe slug from artist: lowercase, alphanumeric + hyphens.
 * @param {string} artist
 * @returns {string}
 */
function slugify(artist) {
  return artist
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Ensure unique slugs by appending -2, -3, ... when duplicate.
 * @param {{ artist: string, song: string, year: string }[]} entries
 * @returns {{ artist: string, song: string, year: string, slug: string }[]}
 */
function assignSlugs(entries) {
  const used = new Set();
  return entries.map((e) => {
    let slug = slugify(e.artist) || "unknown";
    if (used.has(slug)) {
      let n = 2;
      while (used.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    used.add(slug);
    return { ...e, slug };
  });
}

async function main() {
  console.log("Fetching list from Wikipedia API...");
  const wikitext = await fetchWikitext();
  const entries = parseWikitext(wikitext);
  const withSlugs = assignSlugs(entries);
  const outDir = dirname(OUTPUT_PATH);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(withSlugs, null, 2), "utf8");
  console.log(`Wrote ${withSlugs.length} entries to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
