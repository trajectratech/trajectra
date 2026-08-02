/**
 * Single source of truth for brand identity, canonical URLs and contact data.
 *
 * Google determines a site name from several signals (WebSite structured data,
 * og:site_name, <title>, headings, other on-page text). Those signals must agree
 * with each other or Google's confidence drops and it falls back to the bare
 * domain. Every one of those signals is derived from this file so they cannot
 * drift apart again.
 *
 * @see https://developers.google.com/search/docs/appearance/site-names
 */

/**
 * The site name we want Google (and every other consumer) to display.
 * Short, human, and identical everywhere. NOT "Trajectra Technologies" —
 * Google prefers concise names and mixing the two variants is what created
 * the low-confidence fallback to "trajectra.com".
 */
export const SITE_NAME = "Trajectra";

/**
 * Registered legal name. Used for the Organization entity only, never as the
 * site name, and surfaced to Google via `alternateName`.
 */
export const LEGAL_NAME = "Trajectra Technologies";

/**
 * Canonical origin. Must match the URL that actually serves the site after all
 * redirects (apex and http both 308 to https://www.trajectra.com/).
 */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL ??
	process.env.BASE_URL ??
	"https://www.trajectra.com"
).replace(/\/$/, "");

/**
 * The home page root URI, with the trailing slash. Google's site-name docs
 * require WebSite structured data to sit on "the domain or subdomain level
 * root URI", and the canonical, the sitemap and WebSite.url must all agree.
 */
export const HOME_URL = `${SITE_URL}/`;

export const SITE_TAGLINE =
	"Custom Software Development, Training & IT Consulting";

/**
 * The home page `<title>`.
 *
 * Deliberately separate from SITE_NAME. These are two different fields and
 * Google treats them differently:
 *
 * - SITE_NAME feeds `WebSite.name` and `og:site_name`. It is the short brand
 *   label Google renders *above* the result. Google's spec requires a concise
 *   name; a long, pipe-delimited keyword string is rejected and Google falls
 *   back to the domain — which is the failure this whole change set exists to
 *   fix.
 * - HOME_TITLE is the blue headline of the result. Keyword-led phrasing is
 *   legitimate here, and this is the string the site already ranked with.
 *
 * The brand still closes the title, so the `<title>` signal keeps pointing at
 * the same entity as the structured data. Do not merge these two constants.
 */
export const HOME_TITLE =
	"Global Custom Software & Tech Training | Trajectra Technologies";

export const SITE_DESCRIPTION =
	"Trajectra builds custom software, trains engineering teams and advises on IT strategy for startups and enterprises worldwide. Remote-first delivery from Lagos, Nigeria.";

/**
 * Checkable company facts. Single source of truth — the About page, the home
 * page proof band, the FAQ and the Organization schema all read from here.
 *
 * One date, deliberately: 2025 is the year of incorporation, which is what
 * anyone looking up RC 8464542 on the CAC register will see. An earlier
 * trading date would need explaining every time it appeared; this needs
 * explaining nowhere and contradicts nothing.
 */
export const COMPANY = {
	/** Year of incorporation — matches the CAC register exactly. */
	founded: 2025,
	/** Nigerian Corporate Affairs Commission registration number. */
	registrationNumber: "8464542",
	/** Core team only. Does not include the wider network of associates. */
	teamSize: 6,
} as const;

export const CONTACT = {
	email: "info@trajectra.com",
	/** E.164 — required format for schema.org telephone and tel: links. */
	phone: "+2347066120776",
	phoneDisplay: "+234 706 612 0776",
	bookingUrl: "https://trajectratech.youcanbook.me",
} as const;

export const ADDRESS = {
	streetAddress: "9b Ewusu Otaiku Street, Alapere",
	addressLocality: "Ketu",
	addressRegion: "Lagos",
	postalCode: "100244",
	/** ISO 3166-1 alpha-2, which is what schema.org consumers expect. */
	addressCountry: "NG",
} as const;

/**
 * Verified profile URLs, used for `sameAs`. These must be the exact live URLs —
 * `sameAs` is how Google resolves this site to the real-world Trajectra entity,
 * and a URL that 404s or redirects weakens that link. Keep in sync with the
 * links actually rendered in the footer.
 */
export const SOCIAL_PROFILES = [
	"https://www.linkedin.com/company/trajectra",
	"https://x.com/trajectra",
	"https://www.instagram.com/trajectra",
	"https://web.facebook.com/people/Trajectra/61575689502633",
	"https://youtube.com/@trajectra",
	"https://www.tiktok.com/@trajectra",
] as const;

/** Stable @id anchors so the JSON-LD graph nodes can reference each other. */
export const SCHEMA_IDS = {
	organization: `${SITE_URL}/#organization`,
	website: `${SITE_URL}/#website`,
	localBusiness: `${SITE_URL}/#local-business`,
} as const;

/** Absolute URL helper — schema.org and Open Graph both require absolute URLs. */
export const absoluteUrl = (path: string) =>
	new URL(path, `${SITE_URL}/`).toString();

export const OG_IMAGE = {
	url: absoluteUrl("/trajectra-full-dark.png"),
	width: 1200,
	height: 630,
	alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
} as const;
