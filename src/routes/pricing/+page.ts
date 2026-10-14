// The pricing page was merged into /pro (2026-10-14). Keep this route as a
// permanent redirect so old links, bookmarks, and search results don't 404.
import { redirect } from '@sveltejs/kit';

export const load = () => {
	throw redirect(308, '/pro');
};
