import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";

import {
	HOME_TITLE,
	HOME_URL,
	LEGAL_NAME,
	OG_IMAGE,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
} from "@/lib/site";

import { ClickTracker } from "@/components/analytics/click-tracker";

import "./globals.css";

/**
 * Only the weights the design actually uses. All nine were being requested,
 * which is five extra woff2 files (~70 KB) fetched on every cold load for
 * weights no class in the codebase ever references.
 */
const poppins = Poppins({
	// 400 body · 500 nav · 600 headings and eyebrows · 700 display.
	// 800 went with the old design's `font-extrabold` headings and is no longer
	// referenced anywhere. Each weight is a separate preloaded WOFF2 competing
	// with the hero image for early bandwidth, so unused ones are not free.
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
	adjustFontFallback: true,
});

export const metadata: Metadata = {
	/**
	 * Required for Next to resolve every relative metadata URL (canonical, OG,
	 * Twitter) to an absolute one. Without it Next warns at build time and OG
	 * images can resolve against the deployment preview host instead of the
	 * canonical domain.
	 */
	metadataBase: new URL(SITE_URL),

	/**
	 * Home page title as specified; every other page closes with the short
	 * brand. The title is a supporting site-name signal rather than the primary
	 * one — `WebSite.name` and `og:site_name` carry that — so a keyword-led home
	 * title is fine as long as the brand still appears in it, which it does.
	 */
	title: {
		default: HOME_TITLE,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	authors: [{ name: LEGAL_NAME, url: HOME_URL }],
	creator: LEGAL_NAME,
	publisher: LEGAL_NAME,

	alternates: {
		canonical: "/",
	},

	openGraph: {
		type: "website",
		locale: "en_US",
		url: HOME_URL,
		/**
		 * Must be byte-identical to WebSite.name in the JSON-LD. Google reads
		 * og:site_name as a site-name signal, so a second variant here
		 * ("Trajectra Technologies") competing with the structured data is
		 * exactly the disagreement that lowers Google's confidence.
		 */
		siteName: SITE_NAME,
		title: HOME_TITLE,
		description: SITE_DESCRIPTION,
		images: [OG_IMAGE],
	},

	twitter: {
		card: "summary_large_image",
		site: "@trajectra",
		creator: "@trajectra",
		title: HOME_TITLE,
		description: SITE_DESCRIPTION,
		images: [OG_IMAGE.url],
	},

	/**
	 * Object form rather than the `"index, follow"` string, so the Google-specific
	 * directives are emitted too. `max-image-preview: large` is what allows a
	 * full-width thumbnail next to brand results.
	 */
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	manifest: "/manifest.webmanifest",

	icons: {
		icon: [
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/trajectra-closeup.svg", type: "image/svg+xml" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
	},

	category: "technology",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#34C759",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<head>
				{/*
				 * Runs before React hydrates so any outside actor (the Turbopack dev
				 * overlay, a browser extension, a cookie banner shim) that
				 * toggles `html.hydrated` does not create an attribute diff on
				 * the very first element React compares. Paired with
				 * `suppressHydrationWarning` on the host element itself, this
				 * keeps the initial hydration overlay silent on the exact element the
				 * error hit, not anywhere further down the tree.
				 */}
				<Script
					id="prehydrate-html-class"
					strategy="beforeInteractive"
				>
					{`
						(function () {
							try {
								document.documentElement.classList.add('hydrated');
							} catch (_) {}
						})();
					`}
				</Script>
			</head>
			<body className={`${poppins.variable} antialiased`}>
				{children}
				<ClickTracker />

				{/*
				 * Google Analytics 4.
				 *
				 * `lazyOnload` rather than `afterInteractive`: gtag.js is 68 KB of
				 * which Lighthouse measures ~100% unused during load, and nothing on
				 * this site depends on it being ready early. Deferring it past the
				 * load event keeps it off the critical path and out of the main
				 * thread while the hero is still painting.
				 *
				 * Trade-off: a visitor who bounces before `load` fires may not be
				 * counted. For a marketing site measuring enquiries rather than
				 * raw sessions, that is the right side of the trade.
				 */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-R4DRJDDZSD"
					strategy="lazyOnload"
				/>
				<Script id="ga4-init" strategy="lazyOnload">
					{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'G-R4DRJDDZSD');
          			`}
				</Script>
			</body>
		</html>
	);
}
