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
			onClick={scrollToTop}
			aria-label="Scroll to top"
			className="fixed bottom-8 right-8 bg-primary text-white text-xl p-5 rounded-full shadow-2xl hover:bg-primary/80 transition-all duration-300 transform hover:scale-110"
			style={{ zIndex: 1000 }}
		>
			↑
		</button>
	);
}
