/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,

	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	/*
	 * The `eslint` key is gone in Next 16 — `next lint` was removed and the build
	 * no longer runs ESLint at all. Linting is now `npm run lint`, which calls
	 * the eslint binary against eslint.config.mjs.
	 *
	 * This previously carried `ignoreDuringBuilds: true`, which had been hiding
	 * real warnings. That flag is no longer needed: lint passes clean, and the
	 * right place to enforce it is CI (roadmap item 34) rather than the build.
	 */

	poweredByHeader: false,

	images: {
		// AVIF first, WebP second, original as the final fallback. Next only ever
		// serves a format the requesting browser advertises in Accept, so this is
		// a pure win: AVIF typically lands 30-50% under the WebP equivalent, and
		// the hero photographs are the heaviest thing on the page.
		formats: ["image/avif", "image/webp"],
		/*
		 * Next 16 only honours `quality` values listed here — anything else is
		 * silently ignored and re-served at 75, and a direct request for an
		 * unlisted value returns 400. That is a behaviour change from Next 14,
		 * where any value worked, so the `quality={70}` and `quality={65}` props
		 * written before the upgrade had quietly stopped having any effect.
		 *
		 * 40 is for heavily-scrimmed decorative art where detail is invisible.
		 * 75 is Next's default and covers everything else.
		 */
		qualities: [40, 75],
		// Optimised variants are content-addressed by URL, so they can be cached
		// hard. The default is 60 seconds, which makes repeat visitors re-fetch.
		minimumCacheTTL: 31536000,
	},

	async redirects() {
		return [
			{
				/*
				 * The colour generator was live, indexed and listed in the sitemap.
				 * Deleting the route without this would hand Google a 404 on a URL
				 * it already knows about. A 301 passes whatever link equity exists
				 * to the home page and keeps the crawl clean.
				 *
				 * When the replacement tool ships, point this at the new path
				 * instead of the home page.
				 */
				source: "/tools/color-generator",
				destination: "/",
				permanent: true,
			},
		];
	},

	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					// Was listed twice in this array.
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
					},
					// HSTS is set by the host today; declaring it here keeps the
					// guarantee if the site ever moves off Vercel.
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
			{
				// Static media in /public is never revalidated by the framework, so
				// without an explicit rule every visit re-validates each file.
				// Filenames here are stable; change the name when the art changes.
				source: "/:path*.(jpg|jpeg|png|svg|webp|avif|ico|woff2)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

export default nextConfig;
