"use client";

import { useState, useEffect } from "react";

export function ScrollToTopButton() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setVisible(window.scrollY > 300);
		};

		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (!visible) return null;

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Scroll to top"
			/*
			 * Was `bg-primary` (the bright #34C759) with white text — 2.22:1, a
			 * WCAG 1.4.3 failure. Lighthouse never caught it because the button
			 * only mounts after 300px of scroll and the audit measures the initial
			 * viewport. Anything that appears conditionally needs checking by hand.
			 */
			className="fixed bottom-6 right-6 z-[1000] flex h-12 w-12 items-center justify-center rounded-full bg-brand-strong text-white shadow-lg transition-all duration-300 hover:brightness-110 motion-safe:hover:-translate-y-0.5"
		>
			<svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-current">
				<path d="M10 3.5a1 1 0 0 1 .7.29l5 5a1 1 0 0 1-1.4 1.42L11 6.91V15.5a1 1 0 1 1-2 0V6.91L5.7 10.2A1 1 0 0 1 4.3 8.8l5-5A1 1 0 0 1 10 3.5Z" />
			</svg>
		</button>
	);
}
