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

const listData = raw as OneHitWonderEntry[];

export default listData;
