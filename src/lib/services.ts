import servicesContent from "@/contents/services.json";

export type ServicePage = {
	metaTitle: string;
	metaDescription: string;
	h1: string;
	lede: string;
	includes: string[];
	notFor: string[];
	faq: { q: string; a: string }[];
};

export type Service = {
	slug: string;
	tier: "primary" | "secondary";
	heading: string;
	promise: string;
	bestFor?: string;
	timeline?: string;
	iconUrl: string;
	page: ServicePage;
};

/**
 * One flat list is the source of truth for the home page cards, the /services
 * hub and every /services/<slug> page. Splitting it into `primary` and
 * `secondary` arrays, as an earlier revision did, meant a lookup by slug had to
 * search both and the dynamic route had to know the shape.
 */
export const SERVICES = servicesContent.items as Service[];

export const primaryServices = SERVICES.filter((s) => s.tier === "primary");
export const secondaryServices = SERVICES.filter((s) => s.tier === "secondary");

export const getService = (slug: string) =>
	SERVICES.find((s) => s.slug === slug);

export const servicePath = (slug: string) => `/services/${slug}`;

/**
 * Two other services to cross-link from a service page, preferring ones in the
 * same tier. Internal linking is the point: without it every service page is a
 * dead end and the site has no link graph at all.
 */
export const relatedServices = (slug: string, count = 2) => {
	const current = getService(slug);
	const others = SERVICES.filter((s) => s.slug !== slug);
	const sameTier = others.filter((s) => s.tier === current?.tier);
	return [...sameTier, ...others.filter((s) => s.tier !== current?.tier)].slice(
		0,
		count,
	);
};
