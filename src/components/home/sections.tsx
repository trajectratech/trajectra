import Image from "next/image";

import clients from "@/contents/clients.json";
import content from "@/contents/home.json";
import services from "@/contents/services.json";
import { CONTACT, SITE_NAME } from "@/lib/site";
import { CTA, Section, SectionHeading } from "@/components/ui";

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
					<ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
						{clients.logos.map(
							(logo: { name: string; src: string; width: number }) => (
								<li key={logo.name}>
									<Image
										src={logo.src}
										alt={logo.name}
										width={logo.width}
										height={32}
										// Greyscale keeps a row of mismatched brand colours
										// from fighting the page. Full colour on hover.
										className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
									/>
								</li>
							),
						)}
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
				{services.primary.map((service) => (
					<li
						key={service.slug}
						className="flex flex-col rounded-card border border-neutral-200 bg-white p-7 transition-shadow hover:shadow-lg"
					>
						<Image
							src={service.iconUrl}
							alt=""
							aria-hidden="true"
							width={44}
							height={44}
							className="h-11 w-11"
						/>
						<h3 className="mt-5 text-h3 font-semibold">{service.heading}</h3>
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

			<div className="mt-12 rounded-card bg-neutral-50 p-7">
				<h3 className="text-small font-semibold uppercase tracking-wider text-neutral-500">
					Also available
				</h3>
				<ul className="mt-5 grid gap-6 md:grid-cols-3">
					{services.secondary.map((service) => (
						<li key={service.slug}>
							<h4 className="font-semibold text-ink">{service.heading}</h4>
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
								<svg
									aria-hidden="true"
									viewBox="0 0 20 20"
									className="mt-0.5 h-5 w-5 shrink-0 fill-brand-strong"
								>
									<path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.55a.9.9 0 0 0-1.32-1.22l-3.3 3.58-1.42-1.42a.9.9 0 1 0-1.27 1.27l2.08 2.08a.9.9 0 0 0 1.3-.02l3.93-4.27Z" />
								</svg>
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
					<CTA href={CONTACT.bookingUrl} external>
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
