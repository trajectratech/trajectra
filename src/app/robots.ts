import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Replaces the static `public/robots.txt` so the sitemap URL and the canonical
 * host come from the same constant as everything else, and so the host is
 * correct automatically in preview deployments.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				// The email endpoint has nothing to index and should not be crawled.
				disallow: ["/api/"],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
