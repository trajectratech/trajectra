import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { CTA, Section, SectionHeading } from "@/components/ui";
import { primaryServices, secondaryServices, servicePath } from "@/lib/services";
import { CONTACT, absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

const TITLE = "Services";
const DESCRIPTION =
	"Trajectra builds new products, modernises existing systems, and embeds senior engineers into product teams — plus technical training, advisory and network design.";
const PATH = "/services";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
};

/**
 * The hub. Exists so the six service pages have a parent in the breadcrumb
 * trail and a single page linking to all of them — without it each service page
 * is an orphan reachable only from the home page.
 */
export default function ServicesIndex() {
	return (
		<main>
			<JsonLd
				data={webPageSchema({
					name: TITLE,
					description: DESCRIPTION,
					path: PATH,
				})}
			/>
			<JsonLd data={breadcrumbSchema([{ name: TITLE, path: PATH }])} />
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "ItemList",
					name: "Trajectra services",
					itemListElement: [...primaryServices, ...secondaryServices].map(
						(service, index) => ({
							"@type": "ListItem",
							position: index + 1,
							name: service.page.metaTitle,
							url: absoluteUrl(servicePath(service.slug)),
						}),
					),
				}}
			/>

			<section
				aria-labelledby="page-title"
				className="bg-ink pt-32 pb-16 md:pt-40 md:pb-20 px-5 sm:px-6 lg:px-8"
				data-surface="dark"
			>
				<div className="mx-auto max-w-container">
					<nav aria-label="Breadcrumb" className="mb-8">
						<ol className="flex items-center gap-2 text-small text-neutral-400">
							<li>
								<Link href="/" className="hover:text-white">
									Home
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li className="text-neutral-300" aria-current="page">
								Services
							</li>
						</ol>
					</nav>

					<h1
						id="page-title"
						className="max-w-3xl text-h1 font-bold text-white text-balance"
					>
						What we do
					</h1>
					<p className="mt-6 max-w-prose text-body-lg text-neutral-300">
						Three ways to work with us on software, and three specialisms
						alongside them. Every engagement starts with the same thirty-minute
						call.
					</p>
				</div>
			</section>

			<Section surface="light" labelledBy="primary-heading">
				<SectionHeading
					id="primary-heading"
					eyebrow="Product engineering"
					title="Three ways to work with us"
				/>

				<ul className="mt-12 grid gap-6 md:grid-cols-3">
					{primaryServices.map((service) => (
						<li
							key={service.slug}
							className="group relative flex flex-col rounded-card border border-neutral-200 bg-white p-7 transition-shadow hover:shadow-lg focus-within:shadow-lg"
						>
							<Image
								src={service.iconUrl}
								alt=""
								aria-hidden="true"
								width={44}
								height={44}
								className="h-11 w-11"
							/>
							<h2 className="mt-5 text-h3 font-semibold">
								<Link
									href={servicePath(service.slug)}
									className="after:absolute after:inset-0 after:content-['']"
								>
									{service.heading}
								</Link>
							</h2>
							<p className="mt-3 flex-1 text-body text-neutral-600">
								{service.promise}
							</p>
							<dl className="mt-6 space-y-2 border-t border-neutral-200 pt-5 text-small">
								<div className="flex gap-2">
									<dt className="shrink-0 font-semibold text-neutral-700">
										Best for
									</dt>
									<dd className="text-neutral-600">{service.bestFor}</dd>
								</div>
								<div className="flex gap-2">
									<dt className="shrink-0 font-semibold text-neutral-700">
										Typical
									</dt>
									<dd className="text-neutral-600">{service.timeline}</dd>
								</div>
							</dl>
						</li>
					))}
				</ul>
			</Section>

			<Section surface="muted" labelledBy="secondary-heading">
				<SectionHeading
					id="secondary-heading"
					eyebrow="Alongside"
					title="Specialisms"
					lede="Sold on their own, and often alongside a build or a retainer."
				/>

				<ul className="mt-12 grid gap-6 md:grid-cols-3">
					{secondaryServices.map((service) => (
						<li
							key={service.slug}
							className="group relative rounded-card border border-neutral-200 bg-white p-7 transition-shadow hover:shadow-lg focus-within:shadow-lg"
						>
							<Image
								src={service.iconUrl}
								alt=""
								aria-hidden="true"
								width={40}
								height={40}
								className="h-10 w-10"
							/>
							<h2 className="mt-5 text-h3 font-semibold">
								<Link
									href={servicePath(service.slug)}
									className="after:absolute after:inset-0 after:content-['']"
								>
									{service.heading}
								</Link>
							</h2>
							<p className="mt-3 text-body text-neutral-600">
								{service.promise}
							</p>
						</li>
					))}
				</ul>
			</Section>

			<Section surface="dark" labelledBy="services-cta-heading">
				<div className="mx-auto max-w-prose text-center">
					<h2
						id="services-cta-heading"
						className="text-h2 font-bold text-white text-balance"
					>
						Not sure which one you need?
					</h2>
					<p className="mt-4 text-body-lg text-neutral-300">
						That is what the call is for. Describe the problem and we&rsquo;ll
						tell you which of these fits — or that none of them do.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
						<CTA href={CONTACT.bookingUrl} external>
							Book a 30-minute call
						</CTA>
						<CTA href="/#contact" tone="outline-dark">
							Send a message
						</CTA>
					</div>
				</div>
			</Section>
		</main>
	);
}
