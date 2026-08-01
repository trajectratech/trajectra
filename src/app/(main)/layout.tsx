import { Footer } from "@/footer";
import { Navbar } from "@/navbar";
import { ScrollToTopButton } from "@/scroll-to-top";

/**
 * Every child here was previously wrapped in `next/dynamic`, which was doing
 * more harm than good:
 *
 * - `Navbar` used `ssr: false`, so the header was absent from the server HTML
 *   and popped in after hydration — a guaranteed layout shift and an invisible
 *   navigation landmark for crawlers. It is a client component either way; the
 *   `use client` directive alone already keeps it out of the server bundle.
 * - `Footer` and `ScrollToTopButton` used `ssr: true`, which buys nothing on a
 *   component this small and only adds an extra chunk + request waterfall.
 *
 * The home page also rendered its own second `<Navbar />` on top of this one,
 * producing two fixed headers, two `<nav>` landmarks and two sets of scroll
 * listeners after hydration. That duplicate is now gone.
 */
export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{/*
			 * WCAG 2.4.1 Bypass Blocks. Keyboard and screen-reader users had to
			 * tab through the entire header (plus the tools dropdown) on every
			 * page before reaching content.
			 */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-brand"
			>
				Skip to main content
			</a>
			<Navbar />
			<div id="main-content">{children}</div>
			<Footer />
			<ScrollToTopButton />
		</>
	);
}
