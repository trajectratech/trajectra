import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { CTA, Section, SectionHeading } from "@/components/ui";
import { SERVICES, getService, relatedServices, servicePath } from "@/lib/services";
import { CONTACT } from "@/lib/site";
import {
	breadcrumbSchema,
	faqSchemaFrom,
	serviceSchema,
} from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site";

/**
 * One template for all six services rather than six near-identical files. Every
 * page therefore gets the same metadata, breadcrumbs and Service schema by
 * construction — the usual failure mode for service pages is that the fifth one
 * quietly misses its canonical.
 */
export function generateStaticParams() {
	return SERVICES.map((service) => ({ slug: service.slug }));
}

/** Anything not in services.json 404s rather than rendering an empty shell. */
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) return {};

	return {
		title: service.page.metaTitle,
		description: service.page.metaDescription,
		alternates: { canonical: servicePath(slug) },
		openGraph: {
			title: `${service.page.metaTitle} | Trajectra`,
			description: service.page.metaDescription,
			url: absoluteUrl(servicePath(slug)),
			type: "website",
		},
	};
}

export default async function ServicePage({ params }: Props) {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) notFound();

	const { page } = service;
	const related = relatedServices(slug);
	const url = absoluteUrl(servicePath(slug));

	return (
		<main>
			<JsonLd data={serviceSchema(slug)!} />
			<JsonLd data={faqSchemaFrom(page.faq, `${url}#faq`)} />
			<JsonLd
				data={breadcrumbSchema([
					{ name: "Services", path: "/services" },
					{ name: service.heading, path: servicePath(slug) },
				])}
			/>

			{/* Hero */}
			<section
				aria-labelledby="page-title"
				className="bg-ink pt-32 pb-16 md:pt-40 md:pb-20 px-5 sm:px-6 lg:px-8"
				data-surface="dark"
			>
				<div className="mx-auto max-w-container">
					{/*
					 * A visible breadcrumb as well as the structured one. On a page
					 * reached from search rather than from the home page, this is the
					 * only thing telling a visitor where they are.
					 */}
					<nav aria-label="Breadcrumb" className="mb-8">
						<ol className="flex flex-wrap items-center gap-2 text-small text-neutral-400">
							<li>
								<Link href="/" className="hover:text-white">
									Home
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li>
								<Link href="/services" className="hover:text-white">
									Services
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li className="text-neutral-300" aria-current="page">
								{service.heading}
							</li>
						</ol>
					</nav>

					<h1
						id="page-title"
						className="max-w-3xl text-h1 font-bold text-white text-balance"
					>
						{page.h1}
					</h1>
					<p className="mt-6 max-w-prose text-body-lg text-neutral-300">
						{page.lede}
					</p>

					{(service.bestFor || service.timeline) && (
						<dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-6">
							{service.bestFor && (
								<div className="max-w-sm">
									<dt className="text-eyebrow uppercase text-brand">
										Best for
									</dt>
									<dd className="mt-1.5 text-small text-neutral-300">
										{service.bestFor}
									</dd>
								</div>
							)}
							{service.timeline && (
								<div>
									<dt className="text-eyebrow uppercase text-brand">Typical</dt>
									<dd className="mt-1.5 text-small text-neutral-300">
										{service.timeline}
									</dd>
								</div>
							)}
						</dl>
					)}

					<div className="mt-10">
						<CTA href={CONTACT.bookingUrl} external>
							Book a 30-minute call
						</CTA>
					</div>
				</div>
			</section>

			{/* What's included / who it isn't for */}
			<Section surface="light" labelledBy="includes-heading">
				<div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
					<div>
						<SectionHeading id="includes-heading" title="What you get" />
						<ul className="mt-8 space-y-4">
							{page.includes.map((item) => (
								<li key={item} className="flex items-start gap-3">
									<svg
										aria-hidden="true"
										viewBox="0 0 20 20"
										className="mt-1 h-5 w-5 shrink-0 fill-brand-strong"
									>
										<path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.55a.9.9 0 0 0-1.32-1.22l-3.3 3.58-1.42-1.42a.9.9 0 1 0-1.27 1.27l2.08 2.08a.9.9 0 0 0 1.3-.02l3.93-4.27Z" />
									</svg>
									<span className="text-body text-neutral-600">{item}</span>
								</li>
							))}
						</ul>
					</div>

					{/*
					 * Saying who a service is wrong for is the most persuasive block on
					 * the page. It costs a few unqualified enquiries and buys
					 * credibility with everyone else — almost no agency will do it.
					 */}
					<div className="rounded-card bg-neutral-50 p-7 lg:p-9">
						<h2 className="text-h3 font-semibold">
							When this isn&rsquo;t the right fit
						</h2>
						<ul className="mt-6 space-y-4">
							{page.notFor.map((item) => (
								<li key={item} className="flex items-start gap-3">
									<svg
										aria-hidden="true"
										viewBox="0 0 20 20"
										className="mt-1 h-5 w-5 shrink-0 fill-neutral-400"
									>
										<path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.5 9.1h7a.9.9 0 0 1 0 1.8h-7a.9.9 0 0 1 0-1.8Z" />
									</svg>
									<span className="text-body text-neutral-600">{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Section>

			{/* FAQ */}
			<Section surface="muted" labelledBy="service-faq-heading">
				<SectionHeading
					id="service-faq-heading"
					eyebrow="Questions"
					title={`About ${page.h1.toLowerCase()}`}
				/>
				<div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
					{page.faq.map((item) => (
						<details key={item.q} className="group py-5">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:hidden">
								{item.q}
								<svg
									aria-hidden="true"
									viewBox="0 0 20 20"
									className="h-5 w-5 shrink-0 fill-neutral-500 transition-transform group-open:rotate-45"
								>
									<path d="M9 4a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4Z" />
								</svg>
							</summary>
							<p className="mt-3 max-w-prose text-body text-neutral-600">
								{item.a}
							</p>
						</details>
					))}
				</div>
			</Section>

			{/* Related + CTA */}
			<Section surface="dark" labelledBy="related-heading">
				<div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
					<div>
						<h2
							id="related-heading"
							className="text-h2 font-bold text-white text-balance"
						>
							Not quite what you need?
						</h2>
						<p className="mt-4 max-w-prose text-body-lg text-neutral-300">
							Book the call anyway. Thirty minutes, and we&rsquo;ll tell you
							honestly which of these fits — or who to talk to if none of them
							do.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<CTA href={CONTACT.bookingUrl} external>
								Book a 30-minute call
							</CTA>
							<CTA href="/services" tone="outline-dark">
								All services
							</CTA>
						</div>
					</div>

					<ul className="space-y-4">
						{related.map((other) => (
							<li key={other.slug} className="group relative">
								<Link
									href={servicePath(other.slug)}
									className="block rounded-card border border-white/15 p-5 transition-colors hover:border-brand/60 hover:bg-white/5"
								>
									<h3 className="font-semibold text-white">{other.heading}</h3>
									<p className="mt-1.5 text-small text-neutral-400">
										{other.promise}
									</p>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</Section>
		</main>
	);
}
