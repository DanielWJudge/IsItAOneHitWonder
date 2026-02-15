/**
 * Single source for one-hit-wonders list at build time.
 * Import this module from pages/layouts to avoid duplicate JSON imports and drift.
 */
import raw from './one-hit-wonders.json';

export type OneHitWonderEntry = {
	artist: string;
	song: string;
	year: string | number;
	slug: string;
};

function isOneHitWonderEntry(obj: unknown): obj is OneHitWonderEntry {
	if (!obj || typeof obj !== 'object') return false;
	const o = obj as Record<string, unknown>;
	return (
		typeof o.artist === 'string' &&
		typeof o.song === 'string' &&
		(typeof o.year === 'string' || typeof o.year === 'number') &&
		typeof o.slug === 'string'
	);
}

function validateList(data: unknown): OneHitWonderEntry[] {
	if (!Array.isArray(data)) {
		throw new Error('one-hit-wonders.json must be an array');
	}
	const invalid = data.findIndex((item, i) => {
		if (!isOneHitWonderEntry(item)) return true;
		return false;
	});
	if (invalid >= 0) {
		throw new Error(
			`one-hit-wonders.json: entry at index ${invalid} has invalid schema (expected { artist, song, year, slug })`
		);
	}
	return data as OneHitWonderEntry[];
}

const listData = validateList(raw);

export default listData;
