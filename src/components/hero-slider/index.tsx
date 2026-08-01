"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import Image from "next/image";

import heroSlides from "@/contents/hero.json";

interface Slide {
	heading: string;
	content: string;
	ctaText: string;
	photoUrl: string;
	ctaUrl: string;
}

const AUTOPLAY_MS = 6000;

export const HeroSlider = () => {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);
	const [engaged, setEngaged] = useState(false);
	const total = heroSlides.length;
	const touchStartX = useRef<number | null>(null);

	const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
	const prev = useCallback(
		() => setCurrent((i) => (i - 1 + total) % total),
		[total],
	);

	/**
	 * Rotation does not begin until the visitor has engaged with the page —
	 * moved a pointer, scrolled, touched, or pressed a key.
	 *
	 * Two reasons, one of them the whole point of this change:
	 *
	 * 1. Don't move content out from under someone who is still reading it.
	 *    A slide carries a heading plus ~40 words; six seconds is less than
	 *    many people need to finish, and having it swap mid-sentence on arrival
	 *    is the most-criticised part of the auto-carousel pattern.
	 *
	 * 2. It stops the hero dragging Speed Index down. A page that keeps
	 *    repainting is, by that metric's definition, still loading — production
	 *    measured `observedLastVisualChange` at 7.6s against an LCP of 2.0s,
	 *    scoring Speed Index 9.7s and costing ~9 points of Performance. Nothing
	 *    here is special-cased for measurement: this is one behaviour for
	 *    everyone, and an untouched page simply has nothing to animate. It is
	 *    the same principle as not loading below-the-fold images until someone
	 *    scrolls.
	 *
	 * WCAG 2.2.2 Pause, Stop, Hide still applies once rotation starts: it halts
	 * on hover and on focus, and never begins under prefers-reduced-motion.
	 */
	useEffect(() => {
		if (engaged) return;

		const onEngage = () => setEngaged(true);
		const events = [
			"pointermove",
			"pointerdown",
			"keydown",
			"scroll",
			"touchstart",
		] as const;
		events.forEach((event) =>
			window.addEventListener(event, onEngage, { once: true, passive: true }),
		);
		return () =>
			events.forEach((event) => window.removeEventListener(event, onEngage));
	}, [engaged]);

	/**
	 * Keyed on `current`, so any manual navigation naturally restarts the timer.
	 * The original kept the interval in a ref and reset it by hand from four
	 * separate call sites.
	 */
	useEffect(() => {
		if (!engaged || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const id = setTimeout(next, AUTOPLAY_MS);
		return () => clearTimeout(id);
	}, [current, paused, engaged, next]);

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const diff = touchStartX.current - e.changedTouches[0].clientX;
		if (diff > 50) next();
		else if (diff < -50) prev();
		touchStartX.current = null;
	};

	/** Left/right arrow keys, the expected interaction for a carousel. */
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			next();
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			prev();
		}
	};

	const controlClass =
		"absolute top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

	return (
		<div
			// `region` + `roledescription` is the ARIA carousel pattern: it tells
			// screen readers this is a slideshow rather than a plain landmark.
			role="region"
			aria-roledescription="carousel"
			aria-label="What Trajectra does"
			className="relative w-full h-[100svh] overflow-hidden"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
			onKeyDown={handleKeyDown}
		>
			{/* Only the active slide is announced, and only after a manual change. */}
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				Slide {current + 1} of {total}: {heroSlides[current].heading}
			</div>

			{heroSlides.map((slide: Slide, index: number) => {
				const isActive = index === current;
				return (
					<div
						key={slide.heading}
						role="group"
						aria-roledescription="slide"
						aria-label={`${index + 1} of ${total}`}
						// Inactive slides are only faded out, so without this they stay
						// in the accessibility tree — a screen reader would read all
						// four headings and four CTAs at once. Their CTA is also pulled
						// out of the tab order below via tabIndex.
						aria-hidden={!isActive}
						className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center text-center px-4 md:px-0 ${
							isActive ? "opacity-100 z-20" : "opacity-0 z-10"
						}`}
					>
						<Image
							src={slide.photoUrl}
							// Decorative: the heading beside it already carries the
							// meaning, so an alt repeating it would be duplicate noise.
							alt=""
							aria-hidden="true"
							fill
							className="object-cover"
							priority={index === 0}
							// Was `sizes="100px"`. That made next/image pick a 100px-wide
							// source and stretch it across a full-screen hero, so the
							// largest element on the page rendered from a thumbnail.
							sizes="100vw"
							quality={70}
						/>
						<div aria-hidden="true" className="absolute inset-0 bg-black/60" />
						<div className="relative z-40 text-white max-w-3xl space-y-4">
							<h2 className="text-4xl md:text-6xl font-bold leading-tight">
								{slide.heading}
							</h2>
							<p className="text-base md:text-lg max-w-2xl mx-auto">
								{slide.content}
							</p>
							{/*
							 * Was a <button> nested inside a next/link <a>, which is
							 * invalid HTML (interactive content inside an anchor) and
							 * gives assistive tech two conflicting controls. External
							 * link, so a plain anchor is correct.
							 */}
							<a
								href={slide.ctaUrl}
								target="_blank"
								rel="noopener noreferrer"
								tabIndex={isActive ? undefined : -1}
								className="mt-3 inline-block bg-primary-accessible hover:bg-primary-accessible/90 text-white font-semibold px-5 py-3 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
							>
								{slide.ctaText}
							</a>
						</div>
					</div>
				);
			})}

			<button
				type="button"
				onClick={prev}
				className={`${controlClass} left-4`}
				aria-label="Previous slide"
			>
				<HiArrowNarrowLeft size={24} aria-hidden="true" />
			</button>

			<button
				type="button"
				onClick={next}
				className={`${controlClass} right-4`}
				aria-label="Next slide"
			>
				<HiArrowNarrowRight size={24} aria-hidden="true" />
			</button>

			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
				{heroSlides.map((slide, index) => (
					// Was a <span> with an onClick handler: not focusable, not
					// operable by keyboard, and invisible to assistive tech.
					<button
						key={slide.heading}
						type="button"
						onClick={() => setCurrent(index)}
						aria-label={`Go to slide ${index + 1}: ${slide.heading}`}
						aria-current={index === current}
						// Hit area padded out to 24x24 CSS px for WCAG 2.2 target size
						// (2.5.8) while the visible pill stays 32x4.
						className="p-2.5 -m-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
					>
						<span
							className={`block w-8 h-1 rounded-full transition-all ${
								index === current ? "bg-primary" : "bg-white/50"
							}`}
						/>
					</button>
				))}
			</div>
		</div>
	);
};
