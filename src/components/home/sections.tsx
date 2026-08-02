import Image from "next/image";

import clients from "@/contents/clients.json";
import content from "@/contents/home.json";
import {
	primaryServices,
	secondaryServices,
	servicePath,
} from "@/lib/services";
import { EVENTS } from "@/lib/analytics";
import { CONTACT, SITE_NAME } from "@/lib/site";
import { CTA, CheckCircle, Section, SectionHeading } from "@/components/ui";
import Link from "next/link";

/**
 * Proof band.
 *
 * Client logos render only when `clients.json` actually has entries — the file
 * ships empty on purpose, so a placeholder or invented client can never reach
 * production. Until then the band carries three verifiable facts instead,
 * which is a weaker but honest substitute.
 */
export function ProofBand() {
	const { proof } = content;
	const hasLogos = clients.logos.length > 0;

	return (
		<Section surface="muted" className="!py-12">
			{hasLogos && (
				<>
					<h2 className="text-eyebrow uppercase text-neutral-500 text-center">
						{proof.heading}
					</h2>
					{/*
					 * Named credits rather than an anonymous greyscale logo row.
					 *
					 * That treatment needs six or more horizontal wordmarks to read as
					 * social proof; with two it reads as a thin row of unexplained
					 * marks. Showing the client's name in text does more work than the
					 * logo does — and it is the name, not the mark, that a prospect can
					 * actually go and verify.
					 *
					 * The chips exist because client logos arrive on every possible
					 * background — one of these is a black square, the other a
					 * transparent circle — and a white chip normalises them without
					 * recolouring anyone's brand, which greyscale would.
					 */}
					<ul className="mt-8 flex flex-wrap items-center justify-center gap-4">
						{clients.logos.map((logo) => (
							<li
								key={logo.name}
								className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white py-2 pl-2 pr-5"
							>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
									<Image
										src={logo.src}
										alt=""
										aria-hidden="true"
										width={logo.width}
										height={logo.height}
										className="h-10 w-10 object-contain"
									/>
								</span>
								<span className="text-small font-medium text-neutral-700">
									{logo.name}
								</span>
							</li>
						))}
					</ul>
				</>
			)}

			<dl
				className={`grid gap-8 sm:grid-cols-3 ${hasLogos ? "mt-12 border-t border-neutral-200 pt-10" : ""}`}
			>
				{proof.facts.map((fact) => (
					<div key={fact.value} className="text-center sm:text-left">
						<dt className="text-h3 font-bold text-brand-strong">
							{fact.value}
						</dt>
						<dd className="mt-1 text-small text-neutral-600">{fact.label}</dd>
					</div>
				))}
			</dl>
		</Section>
	);
}

/**
 * Services.
 *
 * Was six equal paragraphs of keyword-optimised prose competing for one URL.
 * Now three headline offers, each answering what you get, who it's for and how
 * long — with the other three services present but visibly one level down, so
 * the page reads as a product engineering firm rather than a general IT shop.
 */
export function Services() {
	const { services: copy } = content;

	return (
		<Section id="services" surface="light" labelledBy="services-heading">
			<SectionHeading
				id="services-heading"
				eyebrow={copy.eyebrow}
				title={copy.heading}
				lede={copy.lede}
			/>

			<ul className="mt-14 grid gap-6 md:grid-cols-3">
				{primaryServices.map((service) => (
					<li
						key={service.slug}
						// `group` + a stretched link: the whole card is clickable, but
						// there is still exactly one link in the accessibility tree
						// rather than a card-sized anchor wrapping a heading.
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
						<h3 className="mt-5 text-h3 font-semibold">
							<Link
								href={servicePath(service.slug)}
								className="after:absolute after:inset-0 after:content-['']"
							>
								{service.heading}
							</Link>
						</h3>
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

						<span
							aria-hidden="true"
							className="mt-5 text-small font-semibold text-brand-strong"
						>
							Read more →
						</span>
					</li>
				))}
			</ul>

			<div className="mt-12 rounded-card bg-neutral-50 p-7">
				<h3 className="text-small font-semibold uppercase tracking-wider text-neutral-500">
					Also available
				</h3>
				<ul className="mt-5 grid gap-6 md:grid-cols-3">
					{secondaryServices.map((service) => (
						<li key={service.slug} className="group relative">
							<h4 className="font-semibold text-ink">
								<Link
									href={servicePath(service.slug)}
									className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-strong"
								>
									{service.heading}
								</Link>
							</h4>
							<p className="mt-1.5 text-small text-neutral-600">
								{service.promise}
							</p>
						</li>
					))}
				</ul>
			</div>
		</Section>
	);
}

/** The four steps between booking a call and owning the software. */
export function Process() {
	const { process } = content;

	return (
		<Section id="process" surface="dark" labelledBy="process-heading">
			<SectionHeading
				id="process-heading"
				eyebrow={process.eyebrow}
				title={process.heading}
				lede={process.lede}
				tone="dark"
			/>

			<ol className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
				{process.steps.map((step, index) => (
					<li key={step.title} className="border-t border-white/15 pt-6">
						<span
							aria-hidden="true"
							className="text-small font-bold text-brand"
						>
							{String(index + 1).padStart(2, "0")}
						</span>
						<h3 className="mt-3 text-h3 font-semibold text-white">
							{step.title}
						</h3>
						<p className="mt-1 text-small font-medium text-brand">
							{step.duration}
						</p>
						<p className="mt-3 text-body text-neutral-300">{step.detail}</p>
					</li>
				))}
			</ol>
		</Section>
	);
}

/**
 * Commercial terms.
 *
 * The single highest-leverage trust element for an international buyer weighing
 * an unfamiliar vendor. Their real question is "what happens if this goes
 * wrong?", and answering it before they ask removes the objection they were
 * never going to voice.
 */
export function Terms() {
	const { terms } = content;

	return (
		<Section id="terms" surface="light" labelledBy="terms-heading">
			<div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
				<SectionHeading
					id="terms-heading"
					eyebrow={terms.eyebrow}
					title={terms.heading}
					lede={terms.lede}
				/>

				<ul className="grid gap-8 sm:grid-cols-2">
					{terms.items.map((item) => (
						<li key={item.title}>
							<h3 className="flex items-start gap-2.5 font-semibold text-ink">
								<CheckCircle className="mt-0.5 text-brand-strong" />
								{item.title}
							</h3>
							<p className="mt-2 pl-[1.9rem] text-body text-neutral-600">
								{item.detail}
							</p>
						</li>
					))}
				</ul>
			</div>
		</Section>
	);
}

/**
 * FAQ.
 *
 * Native <details>/<summary>: keyboard accessible, screen-reader friendly and
 * findable by in-page search with no JavaScript at all. Also the content that
 * earns an FAQPage rich result — see the structured data on the page.
 */
export function Faq() {
	const { faq } = content;

	return (
		<Section id="faq" surface="muted" labelledBy="faq-heading">
			<SectionHeading
				id="faq-heading"
				eyebrow={faq.eyebrow}
				title={faq.heading}
			/>

			<div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
				{faq.items.map((item) => (
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
	);
}

/** Closing CTA — same primary label as the hero, deliberately. */
export function FinalCta() {
	const { finalCta } = content;

	return (
		<Section surface="dark" labelledBy="final-cta-heading">
			<div className="mx-auto max-w-prose text-center">
				<h2
					id="final-cta-heading"
					className="text-h1 font-bold text-white text-balance"
				>
					{finalCta.heading}
				</h2>
				<p className="mt-5 text-body-lg text-neutral-300">{finalCta.lede}</p>

				<div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
					<CTA
						href={CONTACT.bookingUrl}
						external
						event={EVENTS.bookCallClick}
						location="final-cta"
					>
						{finalCta.primaryCta}
					</CTA>
					<CTA href="#contact" tone="outline-dark">
						{finalCta.secondaryCta}
					</CTA>
				</div>

				<p className="mt-8 text-small text-neutral-400">
					Or email{" "}
					<a
						href={`mailto:${CONTACT.email}`}
						data-analytics={EVENTS.emailClick}
						data-analytics-location="final-cta"
						className="text-brand underline underline-offset-4 hover:text-white"
					>
						{CONTACT.email}
					</a>{" "}
					— {SITE_NAME} replies within one business day.
				</p>
			</div>
		</Section>
	);
}
