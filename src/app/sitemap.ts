import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * `lastModified` used to be `new Date()` with `revalidate = 3600`, so every URL
 * claimed it had changed within the last hour, forever. Google explicitly
 * ignores `lastmod` on sites where it is not accurate, which throws away the
 * one field in a sitemap it actually still uses. These are hand-maintained
 * dates: bump the entry when the page's content genuinely changes.
 *
 * `changefreq` and `priority` are omitted — Google has stated for years that it
 * ignores both.
 */
const routes: { path: string; lastModified: string }[] = [
	{ path: "/", lastModified: "2026-08-01" },
	{ path: "/privacy-policy", lastModified: "2025-05-21" },
	{ path: "/terms-of-service", lastModified: "2025-05-21" },
];

export default function sitemap(): MetadataRoute.Sitemap {
	return routes.map(({ path, lastModified }) => ({
		// Matches the canonical exactly: the home page keeps its trailing slash,
		// sub-pages have none. A sitemap URL that differs from the canonical is a
		// contradictory signal.
		url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
		lastModified,
	}));
}
