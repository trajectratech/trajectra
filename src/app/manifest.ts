import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/**
 * Replaces `public/site.webmanifest`, which shipped with empty `name` and
 * `short_name` and — worse — was never linked from the HTML at all, so browsers
 * and app-install surfaces had no brand name to show.
 *
 * Generating it from the app router means Next emits the
 * `<link rel="manifest">` automatically and the name stays tied to the same
 * SITE_NAME constant as the title, og:site_name and WebSite structured data.
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: `${SITE_NAME} — ${SITE_TAGLINE}`,
		short_name: SITE_NAME,
		description: SITE_DESCRIPTION,
		start_url: "/",
		id: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#34C759",
		icons: [
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
		],
	};
}
