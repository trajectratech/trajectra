import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	FaFacebookF,
	FaInstagram,
	FaLinkedinIn,
	FaTiktok,
	FaXTwitter,
	FaYoutube,
} from "react-icons/fa6";

import data from "@/contents/footer.json";
import { SERVICES, servicePath } from "@/lib/services";
import { ADDRESS, CONTACT, LEGAL_NAME, SITE_NAME } from "@/lib/site";

// React 19 removed the global JSX namespace; it now lives on the React
// package, so the type has to be imported explicitly.
const socialIcons: Record<string, JSX.Element> = {
	facebook: <FaFacebookF className="w-4 h-4" aria-hidden="true" />,
	instagram: <FaInstagram className="w-4 h-4" aria-hidden="true" />,
	// Was FaTwitter — the old bird mark for a profile that is now X.
	x: <FaXTwitter className="w-4 h-4" aria-hidden="true" />,
	linkedin: <FaLinkedinIn className="w-4 h-4" aria-hidden="true" />,
	youtube: <FaYoutube className="w-4 h-4" aria-hidden="true" />,
	tiktok: <FaTiktok className="w-4 h-4" aria-hidden="true" />,
};

/**
 * Root-relative hashes rather than bare `#about`.
 *
 * The footer links used to be a `ssr: false` client component whose only job
 * was to intercept clicks, call `scrollIntoView`, then strip the hash back out
 * of the URL. That meant: the links were absent from the server HTML entirely
 * (so crawlers saw a footer with no internal links at all), the URL never
 * reflected the section, and on the policy pages every link collapsed to "/".
 *
 * `/#about` works from any route with no JavaScript, keeps the anchor in the
 * URL so sections are linkable, and lets the CSS `scroll-behavior` handle the
 * animation — including honouring prefers-reduced-motion, which the JS did not.
 */
const serviceLinks = SERVICES.map((service) => ({
	label: service.heading,
	href: servicePath(service.slug),
}));

const sectionLinks = [
	{ label: "Services", href: "/services" },
	{ label: "How we work", href: "/#process" },
	{ label: "Terms", href: "/#terms" },
	{ label: "FAQ", href: "/#faq" },
	{ label: "Contact", href: "/#contact" },
];

export const Footer = () => {
	return (
		<footer
			id="footer"
			// Padding was dropped during the design-system migration; restored on
			// the same rhythm as Section so the footer lines up with the page above.
			className="bg-ink text-neutral-300 px-5 sm:px-6 lg:px-8 py-section-sm space-y-10"
			data-surface="dark"
		>
			{/*
			 * The catchphrase-and-buttons row that used to sit here is gone. It
			 * repeated the closing CTA section immediately above it, and did so
			 * with two more label variants ("Let's talk", "Contact us") for the
			 * same two destinations — exactly the CTA sprawl the redesign set out
			 * to remove.
			 */}
			<div className="mx-auto max-w-container flex justify-between gap-10 flex-col md:flex-row">
				{/* Logo and description */}
				<div className="flex flex-1 flex-col md:flex-row md:items-start gap-6 max-w-sm">
					<div className="flex flex-col flex-1 items-start">
						<Image
							src={data.logo.srcLight}
							// Bare brand name: "Logo" is redundant for a screen reader,
							// and this is one more place the exact site name appears.
							alt={SITE_NAME}
							width={140}
							height={40}
							// Was `priority`, which preloads a below-the-fold footer logo
							// in competition with the hero image.
						/>
						{data.description && (
							<p className="mt-6 text-neutral-400 text-left w-full md:w-auto">
								{data.description}
							</p>
						)}
					</div>
				</div>

				{/* Services + company links + social + address */}
				<div className="flex flex-[2] flex-col sm:flex-row gap-10 md:gap-16">
					{/*
					 * Every service linked from every page. This is the site's internal
					 * link graph — without it the service pages are reachable only from
					 * the home page and the hub.
					 */}
					<nav aria-labelledby="footer-services" className="flex-1">
						<h2 id="footer-services" className="font-semibold text-white mb-4">
							Services
						</h2>
						<ul className="space-y-2 text-small">
							{serviceLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="hover:text-brand transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-labelledby="footer-company" className="flex-1">
						<h2 id="footer-company" className="font-semibold text-white mb-4">
							Company
						</h2>
						<ul className="space-y-2 text-small">
							{sectionLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="hover:text-brand transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="flex-1">
						<h2 className="font-semibold text-white mb-4" id="footer-social">
							Follow Us
						</h2>
						<ul
							aria-labelledby="footer-social"
							className="flex flex-wrap gap-4 mb-4 list-none"
						>
							{data.socialLinks.map((social) => (
								<li key={social.id}>
									<a
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										// The links were icon-only with no accessible name at
										// all — a screen reader announced six unlabelled
										// links. WCAG 2.4.4 Link Purpose.
										aria-label={`${SITE_NAME} on ${social.name} (opens in a new tab)`}
										className="rounded-full bg-white/10 text-neutral-300 hover:bg-brand hover:text-ink p-2 inline-flex items-center justify-center transition-transform duration-300 ease-in-out hover:brightness-110 motion-safe:hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
									>
										{socialIcons[social.id]}
									</a>
								</li>
							))}
						</ul>

						{/*
						 * Marked up as a real postal address so the visible contact
						 * block matches the PostalAddress in the structured data.
						 */}
						<address className="not-italic space-y-1 text-neutral-400">
							<p>{data.companyAddress}</p>
							<p>
								<a
									href={`mailto:${CONTACT.email}`}
									className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
								>
									{CONTACT.email}
								</a>
							</p>
							<p>
								<a
									href={`tel:${CONTACT.phone}`}
									className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
								>
									{CONTACT.phoneDisplay}
								</a>
							</p>
							<p className="text-neutral-400 text-sm pt-2">
								Registered with the Corporate Affairs Commission,{" "}
								{ADDRESS.addressRegion}, Nigeria.
							</p>
						</address>
					</div>
				</div>
			</div>

			<hr className="mx-auto max-w-container border-white/10" />

			<div className="mx-auto max-w-container flex flex-col-reverse md:flex-row justify-between gap-4">
				<p className="text-xs text-neutral-400 text-left w-full md:w-auto">
					© {new Date().getFullYear()} {LEGAL_NAME}
				</p>

				<div className="flex gap-4 text-xs text-neutral-400">
					<Link
						href={data.policies.href}
						className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
					>
						{data.policies.label}
					</Link>
					<Link
						href={data.termsOfServices.href}
						className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
					>
						{data.termsOfServices.label}
					</Link>
				</div>
			</div>
		</footer>
	);
};
