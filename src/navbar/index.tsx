"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import navbarContent from "@/contents/navbar.json";
import { SITE_NAME } from "@/lib/site";

/** Section ids the in-page nav links point at, in document order. */
const SECTION_IDS = ["home", "about", "services", "contact"];

export const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isToolsOpen, setIsToolsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState<string>("home");
	const pathname = usePathname();

	const toolsRef = useRef<HTMLLIElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const mobilePanelRef = useRef<HTMLDivElement>(null);

	const isHome = pathname === "/";

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	/**
	 * Scroll spy.
	 *
	 * This replaces a `document.querySelectorAll('a[href^="#"]')` effect that
	 * attached manual click handlers to every hash link on the page — including
	 * the footer's, which the navbar does not own — called `preventDefault` on
	 * all of them and re-ran the whole setup on every route change. It also
	 * left a `console.log` in production and used a debounced scroll handler
	 * that re-measured every section on each tick.
	 *
	 * An IntersectionObserver does the same job without touching other
	 * components' DOM, and native anchor navigation now handles the scrolling
	 * (see `scroll-behavior` / `scroll-margin-top` in globals.css), which also
	 * means the hash lands in the URL and deep links work.
	 */
	useEffect(() => {
		if (!isHome) return;

		const sections = SECTION_IDS.map((id) =>
			document.getElementById(id),
		).filter((el): el is HTMLElement => el !== null);
		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) setActiveSection(visible.target.id);
			},
			// Top offset clears the fixed header so a section counts as active
			// once it is genuinely the one being read.
			{ rootMargin: "-88px 0px -55% 0px", threshold: [0.1, 0.5] },
		);

		sections.forEach((section) => observer.observe(section));

		const onScrollTop = () => {
			if (window.scrollY < 100) setActiveSection("home");
		};
		window.addEventListener("scroll", onScrollTop, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", onScrollTop);
		};
	}, [isHome]);

	/* Lock body scroll behind the mobile menu. */
	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", isMenuOpen);
		return () => document.body.classList.remove("overflow-hidden");
	}, [isMenuOpen]);

	/** Escape closes whichever overlay is open, and focus returns to its trigger. */
	useEffect(() => {
		if (!isMenuOpen && !isToolsOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			if (isMenuOpen) {
				setIsMenuOpen(false);
				menuButtonRef.current?.focus();
			}
			setIsToolsOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isMenuOpen, isToolsOpen]);

	/** Click-away for the tools dropdown, which is now click/keyboard driven. */
	useEffect(() => {
		if (!isToolsOpen) return;
		const onPointerDown = (e: MouseEvent) => {
			if (!toolsRef.current?.contains(e.target as Node)) setIsToolsOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		return () => document.removeEventListener("mousedown", onPointerDown);
	}, [isToolsOpen]);

	/* Move focus into the mobile panel when it opens, per WCAG 2.4.3. */
	useEffect(() => {
		if (isMenuOpen) mobilePanelRef.current?.focus();
	}, [isMenuOpen]);

	/**
	 * Hash links only work on the home page; elsewhere they must be absolute so
	 * the browser navigates home first. Previously every non-home route sent all
	 * four links to `/`, so "About" and "Services" from the privacy page landed
	 * at the top of the home page rather than at their section.
	 */
	const resolveHref = (href: string) => {
		if (!href.startsWith("#")) return href;
		if (href === "#home") return isHome ? "#home" : "/";
		return isHome ? href : `/${href}`;
	};

	const isLinkActive = (href: string) => {
		if (href.startsWith("#")) return isHome && activeSection === href.slice(1);
		return pathname === href;
	};

	const linkBase =
		"relative block px-3 py-2 rounded-md text-sm lg:text-base transition-colors duration-200 hover:text-primary-accessible hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

	return (
		<header
			className={`fixed top-0 inset-x-0 z-[9999] transition-all duration-300 rounded-b-xl ${
				scrolled
					? "bg-background-alt/95 backdrop-blur-lg shadow-md py-2"
					: "bg-background-alt/90 py-2"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<nav aria-label="Main" className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link
							href="/"
							className="flex items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
							aria-label={`${SITE_NAME} — home`}
						>
							<Image
								height={40}
								width={40}
								src={navbarContent.logo.src}
								// The alt is the bare brand name. It was "Trajectra
								// Technologies Logo": screen readers already announce the
								// element as an image, so "Logo" is noise, and the exact
								// site name here is one more consistent brand signal.
								alt={SITE_NAME}
								className="h-[2rem] w-auto block object-contain"
								priority
							/>
						</Link>
					</div>

					{/* Desktop links */}
					<div className="hidden md:flex justify-center flex-1">
						<ul className="flex items-center space-x-4">
							{navbarContent.links.map((link) => {
								const active = isLinkActive(link.href);
								return (
									<li key={link.label}>
										<Link
											href={resolveHref(link.href)}
											aria-current={active ? "page" : undefined}
											className={`${linkBase} ${
												active
													? "text-primary-accessible font-medium"
													: "text-secondary"
											}`}
										>
											{link.label}
											{active && (
												<span
													aria-hidden="true"
													className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-accessible rounded-full"
												/>
											)}
										</Link>
									</li>
								);
							})}

							{/*
							 * Was a <div> child of this <ul> (invalid: only <li> may be a
							 * child of <ul>) whose trigger was a non-focusable <div> shown
							 * on :hover only — completely unreachable by keyboard, a
							 * WCAG 2.1.1 failure. Now a real button with aria-expanded.
							 */}
							<li ref={toolsRef} className="relative">
								<button
									type="button"
									onClick={() => setIsToolsOpen((open) => !open)}
									aria-expanded={isToolsOpen}
									aria-haspopup="true"
									aria-controls="tools-menu"
									className={`${linkBase} inline-flex items-center gap-1 text-secondary`}
								>
									Tools
									<BiChevronDown
										size={16}
										aria-hidden="true"
										className={`transition-transform ${
											isToolsOpen ? "rotate-180" : ""
										}`}
									/>
								</button>

								{isToolsOpen && (
									<ul
										id="tools-menu"
										className="absolute left-0 top-full mt-1 w-52 rounded-md shadow-lg bg-white border border-gray-200 py-2 z-50"
									>
										{navbarContent.tools.map((tool) => (
											<li key={tool.name}>
												<Link
													href={tool.url}
													target={tool.isExternal ? "_blank" : undefined}
													rel={
														tool.isExternal ? "noopener noreferrer" : undefined
													}
													onClick={() => setIsToolsOpen(false)}
													className="block px-4 py-2 text-sm text-secondary hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary"
												>
													{tool.name}
													{tool.isExternal && (
														<span className="sr-only"> (opens in a new tab)</span>
													)}
												</Link>
											</li>
										))}
									</ul>
								)}
							</li>
						</ul>
					</div>

					{/* Desktop CTA */}
					<div className="hidden md:block">
						<a
							href={navbarContent.ctaButton.href}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium bg-primary-accessible shadow-sm transition-all duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
						>
							{navbarContent.ctaButton.label}
							<span className="sr-only"> (opens in a new tab)</span>
						</a>
					</div>

					{/* Mobile toggle */}
					<div className="md:hidden">
						<button
							ref={menuButtonRef}
							type="button"
							onClick={() => setIsMenuOpen((open) => !open)}
							aria-expanded={isMenuOpen}
							aria-controls="mobile-menu"
							aria-label={isMenuOpen ? "Close menu" : "Open menu"}
							className="p-2 rounded-md text-secondary hover:bg-primary/10 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
						>
							{isMenuOpen ? (
								<FiX size={24} aria-hidden="true" />
							) : (
								<FiMenu size={24} aria-hidden="true" />
							)}
						</button>
					</div>
				</nav>
			</div>

			{/* Mobile menu */}
			<div
				className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
					isMenuOpen
						? "translate-x-0 opacity-100"
						: "translate-x-full opacity-0 pointer-events-none"
				}`}
				// Hidden from assistive tech when off-screen; it is only faded and
				// translated, so without this its links stayed readable and
				// focusable while the menu appeared closed.
				aria-hidden={!isMenuOpen}
			>
				<div
					aria-hidden="true"
					className="h-full absolute inset-0 bg-black/40 backdrop-blur-sm"
					onClick={() => setIsMenuOpen(false)}
				/>
				<div
					id="mobile-menu"
					ref={mobilePanelRef}
					tabIndex={-1}
					role="dialog"
					aria-modal="true"
					aria-label="Site menu"
					className="h-full fixed right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl flex flex-col outline-none"
				>
					<div className="p-4 flex justify-end">
						<button
							type="button"
							onClick={() => {
								setIsMenuOpen(false);
								menuButtonRef.current?.focus();
							}}
							aria-label="Close menu"
							tabIndex={isMenuOpen ? undefined : -1}
							className="p-2 rounded-md text-secondary hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
						>
							<FiX size={24} aria-hidden="true" />
						</button>
					</div>

					<nav aria-label="Mobile" className="px-6 py-2 flex-grow">
						<ul className="space-y-1">
							{navbarContent.links.map((link) => {
								const active = isLinkActive(link.href);
								return (
									<li key={link.label}>
										<Link
											href={resolveHref(link.href)}
											aria-current={active ? "page" : undefined}
											tabIndex={isMenuOpen ? undefined : -1}
											onClick={() => setIsMenuOpen(false)}
											className={`block px-3 py-3 text-base rounded-md font-medium transition-colors duration-200 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
												active
													? "text-primary-accessible bg-primary/10"
													: "text-secondary"
											}`}
										>
											{link.label}
										</Link>
									</li>
								);
							})}
						</ul>

						{/*
						 * A plain label rather than a heading: the header renders
						 * before <main>, so an <h2> here would sit above the page's
						 * <h1> and break the document outline on every page.
						 */}
						<p
							id="mobile-tools-label"
							className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-semi-mid"
						>
							Tools
						</p>
						<ul aria-labelledby="mobile-tools-label" className="space-y-1">
							{navbarContent.tools.map((tool) => (
								<li key={tool.name}>
									<Link
										href={tool.url}
										target={tool.isExternal ? "_blank" : undefined}
										rel={tool.isExternal ? "noopener noreferrer" : undefined}
										tabIndex={isMenuOpen ? undefined : -1}
										onClick={() => setIsMenuOpen(false)}
										className="block px-3 py-3 text-base rounded-md text-secondary hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
									>
										{tool.name}
										{tool.isExternal && (
											<span className="sr-only"> (opens in a new tab)</span>
										)}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="px-6 py-4">
						<a
							href={navbarContent.ctaButton.href}
							target="_blank"
							rel="noopener noreferrer"
							tabIndex={isMenuOpen ? undefined : -1}
							className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-white font-medium bg-primary-accessible shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
						>
							{navbarContent.ctaButton.label}
							<span className="sr-only"> (opens in a new tab)</span>
						</a>
					</div>
				</div>
			</div>
		</header>
	);
};
