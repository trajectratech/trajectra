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
import { ADDRESS, CONTACT, LEGAL_NAME, SITE_NAME } from "@/lib/site";

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
const sectionLinks = data.links.map((link) => ({
	label: link.label,
	href: link.href.startsWith("#") ? `/${link.href}` : link.href,
}));

export const Footer = () => {
	return (
		<footer
			id="footer"
			className="bg-background-dark text-white px-6 md:px-16 py-12 space-y-8"
		>
			{/* Catchphrase and CTA */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<p className="text-xl font-semibold text-left w-full md:w-auto">
					{data.catchphrase}
				</p>
				<div className="flex gap-4 w-full md:w-auto justify-start md:justify-end">
					<a
						href={CONTACT.bookingUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium bg-primary-accessible shadow-sm transition-all duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						Let&apos;s talk
						<span className="sr-only"> (opens in a new tab)</span>
					</a>
					<Link
						href="/#contact"
						className="px-4 py-2 rounded-full font-semibold text-secondary bg-white hover:bg-white/90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						Contact us
					</Link>
				</div>
			</div>

			<hr className="border-white/20" />

			<div className="flex justify-between gap-4 flex-col md:flex-row">
				{/* Logo and description */}
				<div className="flex flex-1 flex-col md:flex-row md:items-start gap-6">
					<div className="flex flex-col flex-1 items-start">
						<Image
							src={data.logo.src}
							// Bare brand name: "Logo" is redundant for a screen reader,
							// and this is one more place the exact site name appears.
							alt={SITE_NAME}
							width={140}
							height={40}
							// Was `priority`, which preloads a below-the-fold footer logo
							// in competition with the hero image.
						/>
						{data.description && (
							<p className="mt-6 text-white/80 text-left w-full md:w-auto">
								{data.description}
							</p>
						)}
					</div>
				</div>

				{/* Company links + social + address */}
				<div className="flex flex-1 flex-col md:flex-row gap-10 md:gap-16">
					<nav aria-labelledby="footer-company" className="flex-1">
						<h2 id="footer-company" className="font-semibold text-white mb-4">
							Company
						</h2>
						<ul className="space-y-2">
							{sectionLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="hover:text-primary transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
									>
										{link.label}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/tools/color-generator"
									className="hover:text-primary transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
								>
									Color Palette Generator
								</Link>
							</li>
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
										className="rounded-full bg-primary text-secondary p-2 inline-flex items-center justify-center transition-transform duration-300 ease-in-out hover:brightness-110 motion-safe:hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
						<address className="not-italic space-y-1 text-white/80">
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
							<p className="text-white/60 text-sm pt-2">
								Registered with the Corporate Affairs Commission,{" "}
								{ADDRESS.addressRegion}, Nigeria.
							</p>
						</address>
					</div>
				</div>
			</div>

			<hr className="border-white/20" />

			<div className="flex flex-col-reverse md:flex-row justify-between gap-4">
				<p className="text-xs text-white/70 text-left w-full md:w-auto">
					© {new Date().getFullYear()} {LEGAL_NAME}
				</p>

				<div className="flex gap-4 text-xs text-white/70">
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
