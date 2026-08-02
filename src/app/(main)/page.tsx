import type { Metadata } from "next";

import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import {
	Faq,
	FinalCta,
	Process,
	ProofBand,
	Services,
	Terms,
} from "@/components/home/sections";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema, homePageSchema } from "@/lib/structured-data";
import { HOME_TITLE, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Static metadata.
 *
 * This was once an async `generateMetadata` calling `headers()`, which opted
 * the whole route out of prerendering — the live site served
 * `cache-control: no-store` with every request a CDN miss. Deriving the origin
 * from a constant keeps the page static and edge-cacheable.
 */
export const metadata: Metadata = {
	title: { absolute: HOME_TITLE },
	description: SITE_DESCRIPTION,
	alternates: { canonical: "/" },
};

export default function Index() {
	return (
		<main>
			{/*
			 * Emitted as <script type="application/ld+json"> — the only form
			 * search engines parse. WebSite lives on the home page only, which is
			 * where Google requires it for the site name feature.
			 */}
			<JsonLd data={homePageSchema()} />
			<JsonLd data={faqSchema()} />

			<Hero />
			<ProofBand />
			<Services />
			<Process />
			<Terms />
			<Faq />
			<Contact />
			<FinalCta />
		</main>
	);
}
