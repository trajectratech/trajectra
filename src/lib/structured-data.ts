import about from "@/contents/about.json";
import home from "@/contents/home.json";
import { SERVICES, servicePath } from "./services";

import {
	ADDRESS,
	COMPANY,
	CONTACT,
	HOME_URL,
	LEGAL_NAME,
	OG_IMAGE,
	SCHEMA_IDS,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	SOCIAL_PROFILES,
	absoluteUrl,
} from "./site";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Thing = Record<string, any>;
export type WithContext<T extends Thing> = T & { "@context": string };
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * WebSite — the single most important signal for Google's site name feature.
 *
 * Google's docs: "WebSite structured data ... must be on the home page of the
 * site", meaning the domain/subdomain root URI. It is therefore emitted only
 * from the home page, never from sub-pages, and `url` is the root URI including
 * the trailing slash so it matches the canonical and the sitemap exactly.
 *
 * `name` is the short brand ("Trajectra"). `alternateName` gives Google the
 * variants it will encounter elsewhere on the web — including the bare domain,
 * which Google explicitly recommends listing when it has been showing the
 * domain, so it is treated as an alternative rather than the primary name.
 */
const website = {
	"@type": "WebSite",
	"@id": SCHEMA_IDS.website,
	name: SITE_NAME,
	alternateName: [LEGAL_NAME, "trajectra.com"],
	url: HOME_URL,
	description: SITE_DESCRIPTION,
	inLanguage: "en",
	publisher: { "@id": SCHEMA_IDS.organization },
};

/**
 * Organization — the real-world entity behind the site. `sameAs` is what lets
 * Google reconcile this site with Trajectra's social profiles and build an
 * entity it is confident enough to name.
 */
const organization = {
	"@type": "Organization",
	"@id": SCHEMA_IDS.organization,
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	alternateName: LEGAL_NAME,
	url: HOME_URL,
	logo: {
		"@type": "ImageObject",
		url: absoluteUrl("/trajectra-full-dark.png"),
		width: OG_IMAGE.width,
		height: OG_IMAGE.height,
		caption: SITE_NAME,
	},
	image: absoluteUrl("/trajectra-full-dark.png"),
	description: SITE_DESCRIPTION,
	// Year of incorporation, so this agrees with the CAC register and with
	// every visible mention of the date on the site.
	foundingDate: String(COMPANY.founded),
	// The CAC registration number, as a typed identifier rather than loose text
	// so consumers can tell what kind of number it is.
	identifier: {
		"@type": "PropertyValue",
		name: "CAC registration number",
		value: `RC ${COMPANY.registrationNumber}`,
	},
	numberOfEmployees: {
		"@type": "QuantitativeValue",
		value: COMPANY.teamSize,
	},
	/*
	 * Named people, once about.json has any. Spread rather than set, so the
	 * property is absent entirely while the team is empty — an `employee: []`
	 * would assert that Trajectra has no employees, which is worse than saying
	 * nothing. Named individuals are among the strongest corroborating signals
	 * Google has for treating an organisation as a real entity.
	 */
	...(about.team.members.length > 0
		? {
				employee: (
					about.team.members as { name: string; role: string }[]
				).map((member) => ({
					"@type": "Person",
					name: member.name,
					jobTitle: member.role,
					worksFor: { "@id": SCHEMA_IDS.organization },
				})),
			}
		: {}),
	email: CONTACT.email,
	telephone: CONTACT.phone,
	address: { "@type": "PostalAddress", ...ADDRESS },
	contactPoint: [
		{
			"@type": "ContactPoint",
			telephone: CONTACT.phone,
			email: CONTACT.email,
			contactType: "customer support",
			availableLanguage: ["English"],
			areaServed: "Worldwide",
		},
		{
			"@type": "ContactPoint",
			telephone: CONTACT.phone,
			email: CONTACT.email,
			contactType: "sales",
			availableLanguage: ["English"],
			areaServed: "Worldwide",
		},
	],
	sameAs: [...SOCIAL_PROFILES],
	// Gives Google an explicit page describing the entity, which is one of the
	// signals it uses when deciding whether to build a knowledge panel.
	mainEntityOfPage: absoluteUrl("/about"),
	knowsAbout: [
		"Custom software development",
		"Cloud migration",
		"Digital transformation",
		"Legacy system modernisation",
		"Technical training",
		"IT consulting",
		"Network design and security",
	],
	// Both tiers are real offerings, so both belong in the graph even though the
	// page gives them different visual weight.
	makesOffer: SERVICES.map((service) => ({
		"@type": "Offer",
		itemOffered: {
			"@type": "Service",
			"@id": `${absoluteUrl(servicePath(service.slug))}#service`,
			name: service.page.metaTitle,
			description: service.promise,
			url: absoluteUrl(servicePath(service.slug)),
			provider: { "@id": SCHEMA_IDS.organization },
			areaServed: "Worldwide",
		},
	})),
};

/**
 * ProfessionalService — the Lagos office, for local search.
 *
 * Deliberately a separate node with its own @id rather than a second entity
 * duplicating Organization's name/url/address: duplicated top-level entities
 * compete with each other and dilute the entity Google resolves the site to.
 *
 * Note: this no longer carries an `aggregateRating`. The previous markup
 * declared 4.9 from 25 reviews with no reviews anywhere on the site, which
 * violates Google's review snippet policy (self-serving and unverifiable) and
 * risks a structured-data manual action. Re-add it only when real, publicly
 * visible reviews exist on the page.
 */
const localBusiness = {
	"@type": "ProfessionalService",
	"@id": SCHEMA_IDS.localBusiness,
	name: LEGAL_NAME,
	parentOrganization: { "@id": SCHEMA_IDS.organization },
	url: HOME_URL,
	image: absoluteUrl("/trajectra-full-dark.png"),
	telephone: CONTACT.phone,
	email: CONTACT.email,
	address: { "@type": "PostalAddress", ...ADDRESS },
	areaServed: "Worldwide",
	priceRange: "$$",
	sameAs: [...SOCIAL_PROFILES],
};

/**
 * The home page graph. Only the home page emits WebSite, per Google's
 * placement requirement.
 */
export function homePageSchema(): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@graph": [website, organization, localBusiness],
	};
}

/**
 * FAQPage, generated from the same JSON the FAQ section renders.
 *
 * Driving both from one source is the point: Google's structured data policy
 * requires the marked-up answer to be visible on the page, and hand-maintaining
 * a second copy is how that quietly stops being true.
 */
export function faqSchema(): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": `${HOME_URL}#faq`,
		mainEntity: home.faq.items.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: { "@type": "Answer", text: item.a },
		})),
	};
}

/**
 * A single service, for its own page. `@id` matches the node the Organization's
 * `makesOffer` points at, so Google resolves them to one entity rather than two
 * competing descriptions of the same service.
 */
export function serviceSchema(slug: string): WithContext<Thing> | null {
	const service = SERVICES.find((s) => s.slug === slug);
	if (!service) return null;

	const url = absoluteUrl(servicePath(slug));
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": `${url}#service`,
		name: service.page.metaTitle,
		description: service.page.metaDescription,
		url,
		serviceType: service.page.metaTitle,
		provider: { "@id": SCHEMA_IDS.organization },
		areaServed: "Worldwide",
		isPartOf: { "@id": SCHEMA_IDS.website },
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `What ${service.page.h1.toLowerCase()} includes`,
			itemListElement: service.page.includes.map((item) => ({
				"@type": "Offer",
				itemOffered: { "@type": "Service", name: item },
			})),
		},
	};
}

/** FAQPage built from an arbitrary Q&A list, for service pages. */
export function faqSchemaFrom(
	items: { q: string; a: string }[],
	id: string,
): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": id,
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: { "@type": "Answer", text: item.a },
		})),
	};
}

/**
 * Breadcrumbs for sub-pages. Gives Google an explicit site hierarchy and lets
 * the brand name appear as the root of the trail in search results.
 */
export function breadcrumbSchema(
	trail: { name: string; path: string }[],
): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [{ name: SITE_NAME, path: "/" }, ...trail].map(
			(item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				item: absoluteUrl(item.path),
			}),
		),
	};
}

/** A sub-page WebPage node that stays attached to the site's entity graph. */
export function webPageSchema({
	name,
	description,
	path,
}: {
	name: string;
	description: string;
	path: string;
}): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": `${absoluteUrl(path)}#webpage`,
		name,
		description,
		url: absoluteUrl(path),
		isPartOf: { "@id": SCHEMA_IDS.website },
		publisher: { "@id": SCHEMA_IDS.organization },
		inLanguage: "en",
	};
}

export { SITE_URL };
