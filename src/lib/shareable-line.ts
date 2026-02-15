/**
 * Shareable one-line format for copy/share (ADR-8).
 * Format: "{Verdict} – {Definition reference}. {When Yes: The one hit: [Song] – [Artist].}"
 */
import type { OneHitWonderEntry } from '../data/load-list';

/**
 * Build the shareable one-line string per ADR-8.
 * Yes: "Yes – {Artist} is a one-hit wonder (Wikipedia US list). The one hit: {Song}."
 * No: "No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US)."
 */
export function buildShareableLine(
	verdict: 'Yes' | 'No',
	entry?: OneHitWonderEntry
): string {
	if (verdict === 'No') {
		return 'No – Not on our list (Wikipedia US one-hit wonder list: one top-40 hit in the US).';
	}
	if (verdict === 'Yes' && entry?.artist && entry?.song) {
		return `Yes – ${entry.artist} is a one-hit wonder (Wikipedia US list). The one hit: ${entry.song}.`;
	}
	// Intentional fallback when entry is missing/invalid; does not include "The one hit: [Song] – [Artist]." per ADR-8.
	return 'Yes – One-hit wonder (Wikipedia US list).';
}
