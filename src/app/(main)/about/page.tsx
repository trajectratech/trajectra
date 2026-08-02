import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import about from "@/contents/about.json";
import clients from "@/contents/clients.json";
import { JsonLd } from "@/components/seo/json-ld";
import { CTA, Section, SectionHeading } from "@/components/ui";
import { EVENTS } from "@/lib/analytics";
import { primaryServices, servicePath } from "@/lib/services";
import { ADDRESS, COMPANY, CONTACT, LEGAL_NAME, SITE_NAME } from "@/lib/site";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

const TITLE = "About";
const DESCRIPTION =
	"Trajectra is a software company in Lagos, Nigeria, building products for clients worldwide. How we work, where we are, and the terms we hold ourselves to.";
const PATH = "/about";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
};

/**
 * Every fact here is checkable.
 *
 * The RC number can be looked up on the CAC register, the address is real, the
 * clients are named with permission. That is the whole point of an About page:
 * a sceptical buyer can verify what it claims, and one invented number would
 * undo the rest of it. The team section stays hidden until real people exist
 * rather than showing a vacant heading.
 */
export default function AboutPage() {
	const { hero, principles, location, team } = about;

	const stats = [
		{
			value: `Since ${COMPANY.founded}`,
			label: "Incorporated in Nigeria, matching the CAC register",
		},
		{
			value: `${COMPANY.teamSize} engineers`,
			label: "Core team, plus a wider network of associates we bring in by name",
		},
		{
			value: "UTC+1",
			label: "Overlapping the working day in Europe, Africa and the Americas",
		},
		{
			value: `RC ${COMPANY.registrationNumber}`,
			label: "Verify us on the Corporate Affairs Commission register",
		},
	];

	return (
		<main>
			<JsonLd
				data={webPageSchema({
					name: `About ${SITE_NAME}`,
					description: DESCRIPTION,
					path: PATH,
				})}
			/>
			<JsonLd data={breadcrumbSchema([{ name: TITLE, path: PATH }])} />

			{/* Hero */}
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
								About
							</li>
						</ol>
					</nav>

					<p className="text-eyebrow uppercase mb-4 text-brand">
						{hero.eyebrow}
					</p>
					<h1
						id="page-title"
						className="max-w-3xl text-h1 font-bold text-white text-balance"
					>
						{hero.h1}
					</h1>
					<p className="mt-6 max-w-prose text-body-lg text-neutral-300">
						{hero.lede}
					</p>
				</div>
			</section>

			{/* Verifiable facts */}
			<Section surface="muted" className="!py-12">
				<dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.label}>
							<dt className="text-h3 font-bold text-brand-strong">
								{stat.value}
							</dt>
							<dd className="mt-1 text-small text-neutral-600">{stat.label}</dd>
						</div>
					))}
				</dl>
			</Section>

			{/* Principles */}
			<Section surface="light" labelledBy="principles-heading">
				<SectionHeading
					id="principles-heading"
					eyebrow={principles.eyebrow}
					title={principles.heading}
					lede={principles.lede}
				/>

				<ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
					{principles.items.map((item, index) => (
						<li key={item.title}>
							<span
								aria-hidden="true"
								className="text-small font-bold text-brand-strong"
							>
								{String(index + 1).padStart(2, "0")}
							</span>
							<h3 className="mt-2 text-h3 font-semibold">{item.title}</h3>
							<p className="mt-3 text-body text-neutral-600">{item.detail}</p>
						</li>
					))}
				</ol>
			</Section>

			{/* Location and timezone */}
			<Section surface="dark" labelledBy="location-heading">
				<div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
					<SectionHeading
						id="location-heading"
						eyebrow={location.eyebrow}
						title={location.heading}
						tone="dark"
					/>
					<div>
						<p className="text-body-lg text-neutral-300">{location.body}</p>
						<p className="mt-5 text-small text-neutral-400">{location.note}</p>

						<address className="mt-8 not-italic border-t border-white/15 pt-6 text-small text-neutral-300">
							<p className="font-semibold text-white">{LEGAL_NAME}</p>
							<p className="mt-1">
								{ADDRESS.streetAddress}, {ADDRESS.addressLocality},{" "}
								{ADDRESS.addressRegion}
							</p>
							<p className="mt-2">
								<a
									href={`mailto:${CONTACT.email}`}
									data-analytics={EVENTS.emailClick}
									data-analytics-location="about"
									className="text-brand underline underline-offset-4 hover:text-white"
								>
									{CONTACT.email}
								</a>
							</p>
						</address>
					</div>
				</div>
			</Section>

			{/*
			 * Team. Hidden entirely until `members` has entries — an About page with
			 * an empty "meet the team" heading is worse than one that does not
			 * mention a team at all.
			 */}
			{team.members.length > 0 && (
				<Section surface="light" labelledBy="team-heading">
					<SectionHeading
						id="team-heading"
						eyebrow={team.eyebrow}
						title={team.heading}
						lede={team.lede}
					/>
				</Section>
			)}

			{/* Clients */}
			{clients.logos.length > 0 && (
				<Section surface="muted" labelledBy="clients-heading">
					<SectionHeading
						id="clients-heading"
						eyebrow="Clients"
						title="Who we build for"
						lede="Named with their permission."
					/>
					<ul className="mt-10 flex flex-wrap gap-4">
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
				</Section>
			)}

			{/* Services + CTA */}
			<Section surface="light" labelledBy="about-services-heading">
				<div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
					<SectionHeading
						id="about-services-heading"
						eyebrow="What we do"
						title="Three ways to work with us"
						lede="Most engagements start as a fixed-scope build and continue as a retainer."
					/>
					<ul className="space-y-4">
						{primaryServices.map((service) => (
							<li key={service.slug} className="group relative">
								<Link
									href={servicePath(service.slug)}
									className="block rounded-card border border-neutral-200 p-5 transition-colors hover:border-brand-strong/40 hover:bg-neutral-50"
								>
									<h3 className="font-semibold text-ink">{service.heading}</h3>
									<p className="mt-1.5 text-small text-neutral-600">
										{service.promise}
									</p>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</Section>

			<Section surface="dark" labelledBy="about-cta-heading">
				<div className="mx-auto max-w-prose text-center">
					<h2
						id="about-cta-heading"
						className="text-h2 font-bold text-white text-balance"
					>
						Still deciding whether we&rsquo;re the right team?
					</h2>
					<p className="mt-4 text-body-lg text-neutral-300">
						Thirty minutes on a call will tell you more than any About page can.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
						<CTA
							href={CONTACT.bookingUrl}
							external
							event={EVENTS.bookCallClick}
							location="about"
						>
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
