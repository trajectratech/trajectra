import type { Metadata } from "next";
import Image from "next/image";
import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";

import { AboutUsCards } from "@/components/about-us";
import { ContactUsFormWrapper } from "@/components/contact-us/wrapper";
import { HeroSlider } from "@/components/hero-slider";
import { JsonLd } from "@/components/seo/json-ld";
import { Services } from "@/components/services";
import { homePageSchema } from "@/lib/structured-data";
import {
	CONTACT,
	HOME_TITLE,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_TAGLINE,
} from "@/lib/site";

/**
 * Static metadata.
 *
 * This was previously an async `generateMetadata` that called `headers()` to
 * derive the base URL. Reading headers opts the entire route out of static
 * rendering, so the home page was server-rendered on every single request — the
 * live response carried `cache-control: private, no-cache, no-store` and
 * `x-vercel-cache: MISS`. Deriving the origin from a constant instead lets the
 * page be prerendered and served from the edge cache, which is the single
 * largest TTFB (and therefore LCP) win available here.
 */
export const metadata: Metadata = {
	// `absolute` so the root layout's `%s | Trajectra` template is not appended.
	title: { absolute: HOME_TITLE },
	description: SITE_DESCRIPTION,
	alternates: {
		// Next normalises this to the origin with no trailing slash, which is the
		// same URL as the `https://www.trajectra.com/` used in the sitemap and in
		// WebSite.url — an empty path and "/" are equivalent per RFC 3986, and
		// Google resolves them to one URL. What matters is that it points at the
		// www host, since the apex 308-redirects here.
		canonical: "/",
	},
};

export default function Index() {
	return (
		<main className="min-h-screen flex flex-col">
			{/*
			 * Emitted as <script type="application/ld+json"> — the only form search
			 * engines parse. WebSite lives on the home page only, which is where
			 * Google requires it for the site name feature.
			 */}
			<JsonLd data={homePageSchema()} />

			{/* HERO */}
			<section id="home" aria-labelledby="page-title" className="relative">
				{/*
				 * The page's single h1. It is visually hidden because the hero is a
				 * rotating carousel with no stable visible headline to promote — the
				 * four slide headings rotate, and four competing h1s would be worse
				 * for both assistive tech and search. This gives the document one
				 * unambiguous, brand-led title.
				 *
				 * The UX recommendation is to replace the carousel with a static hero
				 * and make this h1 visible; see docs/ui-ux-audit.md.
				 */}
				<h1 id="page-title" className="sr-only">
					{SITE_NAME} — {SITE_TAGLINE}
				</h1>
				<HeroSlider />
				<div
					aria-hidden="true"
					className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"
				/>
			</section>

			<section
				aria-labelledby="cta-heading"
				className="relative my-16 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden"
			>
				<div aria-hidden="true" className="absolute inset-0 pointer-events-none">
					{/* Decorative gradient blobs */}
					<div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl motion-safe:animate-pulse" />
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl motion-safe:animate-pulse delay-200" />
				</div>

				<div className="relative flex flex-col items-center justify-center text-center text-secondary">
					<h2
						id="cta-heading"
						className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6 max-w-3xl"
					>
						Custom Software, Training &amp; Consulting for Growth
					</h2>

					<p className="text-lg sm:text-xl text-semi-mid mb-8 max-w-2xl">
						{SITE_NAME} helps you scale through expertly built digital products
						and talent development tailored to your business.
					</p>

					<a
						target="_blank"
						rel="noopener noreferrer"
						href={CONTACT.bookingUrl}
						className="inline-block bg-primary-accessible hover:bg-primary-accessible/90 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
					>
						Get a Free Consultation
					</a>
				</div>
			</section>

			{/* ABOUT */}
			<section
				id="about"
				aria-labelledby="about-heading"
				className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
			>
				{/*
				 * Was a CSS `background-image`, which bypasses next/image entirely —
				 * no AVIF/WebP negotiation, no responsive srcset, and eagerly fetched
				 * as part of the stylesheet even though the section is below the fold.
				 * Lighthouse measured 189 KB wasted on this one file. As a next/image
				 * it negotiates to AVIF and loads lazily.
				 */}
				<Image
					src="/art-scene.jpg"
					alt=""
					aria-hidden="true"
					fill
					sizes="100vw"
					quality={65}
					className="object-cover"
				/>
				{/* Content below carries `z-10`, so DOM order handles the stacking. */}
				<div aria-hidden="true" className="absolute inset-0 bg-black/60" />
				<div className="relative max-w-7xl mx-auto z-10 text-white text-center">
					<h2 id="about-heading" className="text-3xl sm:text-4xl font-bold mb-8">
						Who We Are
					</h2>
					<p className="max-w-2xl mx-auto mb-12 text-lg">
						{SITE_NAME} builds scalable software solutions, develops African
						tech talent, and provides expert IT consulting to clients worldwide.
					</p>
					<AboutUsCards />
				</div>
			</section>

			{/* SERVICES */}
			<section
				id="services"
				aria-labelledby="services-heading"
				className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary text-white"
			>
				<div className="max-w-7xl mx-auto">
					<h2
						id="services-heading"
						className="text-3xl font-bold text-center mb-12 text-primary"
					>
						Our Core Services
					</h2>
					<Services />
				</div>
			</section>

			{/* CONTACT */}
			<section
				id="contact"
				aria-labelledby="contact-heading"
				className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center px-4 sm:px-6">
						<h2
							id="contact-heading"
							className="text-4xl sm:text-5xl font-extrabold text-secondary mb-4"
						>
							Let&rsquo;s Work Together
						</h2>
						<p className="text-lg sm:text-xl text-semi-mid mb-10 max-w-2xl mx-auto leading-relaxed">
							Have a project in mind or want to learn more? Reach out and
							let&rsquo;s build something amazing together.
						</p>
					</div>

					{/* Quick contact links */}
					<div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mb-12">
						<div className="flex justify-center md:justify-between flex-col md:flex-row gap-6">
							<a
								className="font-bold p-4 rounded flex flex-col items-center text-primary-accessible hover:bg-primary-accessible hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
								href={`tel:${CONTACT.phone}`}
							>
								<FiPhone size={24} aria-hidden="true" />
								<span>
									<span className="sr-only">Call {SITE_NAME} on </span>
									{CONTACT.phoneDisplay}
								</span>
							</a>
							<a
								className="font-bold p-4 rounded flex flex-col items-center text-primary-accessible hover:bg-primary-accessible hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
								href={`mailto:${CONTACT.email}`}
							>
								<MdOutlineEmail size={24} aria-hidden="true" />
								<span>
									<span className="sr-only">Email {SITE_NAME} at </span>
									{CONTACT.email}
								</span>
							</a>
						</div>
					</div>

					{/* Contact form */}
					<div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl">
						<h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
						<ContactUsFormWrapper />
					</div>
				</div>
			</section>
		</main>
	);
}
