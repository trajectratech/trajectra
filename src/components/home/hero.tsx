import Image from "next/image";

import content from "@/contents/home.json";
import { CONTACT } from "@/lib/site";
import { CTA, Eyebrow } from "@/components/ui";

const { hero } = content;

/**
 * Static hero, replacing the four-slide auto-rotating carousel.
 *
 * The carousel cost more than it returned in every dimension: four rotating
 * claims diluted into no claim, the overwhelming majority of interactions land
 * on slide one so slides two to four were effectively invisible, it downloaded
 * four hero images instead of one, and its repainting dragged Speed Index from
 * 0.9s to 9.7s in production.
 *
 * One headline that names the buyer and the outcome does the job the four were
 * failing to do between them — and the page's h1 can finally be visible rather
 * than screen-reader-only.
 */
export function Hero() {
	return (
		<section
			id="home"
			aria-labelledby="page-title"
			className="relative isolate overflow-hidden bg-ink"
			data-surface="dark"
		>
			<Image
				src="/assets/custom.jpg"
				alt=""
				aria-hidden="true"
				fill
				priority
				sizes="100vw"
				// Low quality on purpose. This sits under a 90% scrim on mobile and
				// a heavy gradient on desktop, at 60% opacity — it reads as texture,
				// not as a photograph, so encoding detail nobody can see just
				// delays LCP. It is the largest paint on the page, so its weight is
				// the metric.
				quality={40}
				className="object-cover object-center opacity-60"
			/>
			{/*
			 * Two scrims, because the copy occupies different proportions of the
			 * frame at each breakpoint.
			 *
			 * On desktop the text sits in the left half, so a directional gradient
			 * guarantees contrast there while leaving the photograph legible on the
			 * right. On mobile the text spans the full width, so that same gradient
			 * would leave the ends of each line over the bright part of the image —
			 * a near-even scrim is required instead.
			 */}
			{/*
			 * Opacity values must be steps Tailwind actually has. `bg-ink/88` and
			 * `via-ink/92` are not, so they generated no CSS whatsoever and the
			 * scrim silently did not exist — the same class of silent failure as
			 * an interpolated class name. Stick to the scale: 50, 55, 60 … 90, 95.
			 */}
			<div aria-hidden="true" className="absolute inset-0 bg-ink/90 md:hidden" />
			<div
				aria-hidden="true"
				className="absolute inset-0 hidden md:block bg-gradient-to-r from-ink via-ink/90 to-ink/50"
			/>

			<div className="relative mx-auto max-w-container px-5 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-44 md:pb-28">
				<div className="max-w-3xl">
					<Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>

					<h1
						id="page-title"
						className="text-display font-bold text-white text-balance"
					>
						{hero.headline}
					</h1>

					<p className="mt-6 max-w-prose text-body-lg text-neutral-300">
						{hero.lede}
					</p>

					<div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
						<CTA href={CONTACT.bookingUrl} external>
							{hero.primaryCta}
						</CTA>
						<CTA href="#process" tone="outline-dark">
							{hero.secondaryCta}
						</CTA>
					</div>

					<p className="mt-6 text-small text-neutral-400">{hero.footnote}</p>
				</div>
			</div>
		</section>
	);
}
