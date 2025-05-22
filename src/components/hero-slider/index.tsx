"use client";

import { useEffect, useState, useRef } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import Image from "next/image";
import heroSlides from "@/contents/hero.json";
import Link from "next/link";

interface Slide {
	heading: string;
	content: string;
	ctaText: string;
	photoUrl: string;
	ctaUrl: string;
}

export const HeroSlider = () => {
	const [current, setCurrent] = useState(0);
	const total = heroSlides.length;
	const touchStartX = useRef<number | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Function to clear existing interval and start a new one
	const resetAutoplay = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setCurrent((prev) => (prev + 1) % total);
		}, 6000);
	};

	useEffect(() => {
		resetAutoplay(); // start autoplay on mount
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const nextSlide = () => {
		setCurrent((prev) => (prev + 1) % total);
		resetAutoplay();
	};

	const prevSlide = () => {
		setCurrent((prev) => (prev - 1 + total) % total);
		resetAutoplay();
	};

	const goToSlide = (index: number) => {
		setCurrent(index);
		resetAutoplay();
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const diff = touchStartX.current - e.changedTouches[0].clientX;
		if (diff > 50) nextSlide();
		else if (diff < -50) prevSlide();
		touchStartX.current = null;
	};

	return (
		<section
			id="hero"
			className="relative w-full h-[100vh] overflow-hidden"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{heroSlides.map((slide: Slide, index: number) => (
				<div
					key={index}
					className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center text-center px-4 md:px-0 ${
						index === current ? "opacity-100 z-20" : "opacity-0 z-10"
					}`}
				>
					<Image
						src={slide.photoUrl}
						alt={slide.heading}
						fill
						className="object-cover"
						priority={index === 0}
						sizes="100px"
					/>
					<div className="absolute inset-0 bg-black/50 z-30" />
					<div className="relative z-40 text-white max-w-3xl space-y-4 animate-fade-in">
						<h1 className="text-3xl md:text-5xl font-bold leading-tight">
							{slide.heading}
						</h1>
						<p className="text-base md:text-lg max-w-2xl mx-auto">
							{slide.content}
						</p>
						<Link passHref href={slide.ctaUrl} target="_blank">
							<button className="mt-3 bg-primary hover:bg-primary/80 text-white font-semibold px-5 py-3 rounded-full transition">
								{slide.ctaText}
							</button>
						</Link>
					</div>
				</div>
			))}

			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
				aria-label="Previous Slide"
			>
				<HiArrowNarrowLeft size={24} />
			</button>

			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
				aria-label="Next Slide"
			>
				<HiArrowNarrowRight size={24} />
			</button>

			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
				{heroSlides.map((_, index) => (
					<span
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-8 h-1 cursor-pointer rounded-full transition-all ${
							index === current ? "bg-green-500" : "bg-white/40"
						}`}
					/>
				))}
			</div>
		</section>
	);
};
