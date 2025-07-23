"use client";

import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import navbarContent from "@/contents/navbar.json";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";

export const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));

		const updateActiveLink = (activeId: string) => {
			setActiveAnchor(activeId);
		};

		const onAnchorClick = (e: Event) => {
			e.preventDefault();
			const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href")!;
			const targetId = href.substring(1);
			console.log({ href, targetId, pathname });

			if (targetId === "home") {
				window.scrollTo({ top: 0, behavior: "smooth" });
			} else {
				const targetElem = document.getElementById(targetId);
				if (targetElem) {
					targetElem.scrollIntoView({ behavior: "smooth" });
				}
			}

			// history.replaceState(null, "", href);
			updateActiveLink(targetId);
			setIsMenuOpen(false);
		};

		anchors.forEach((anchor) =>
			anchor.addEventListener("click", onAnchorClick),
		);

		if (window.location.hash) {
			updateActiveLink(window.location.hash.substring(1));
		}

		let timer: ReturnType<typeof setTimeout>;
		const onScroll = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				const fromTop = window.scrollY + 80;
				let current = "";
				document.querySelectorAll("section[id]").forEach((section) => {
					const el = section as HTMLElement;
					if (el.offsetTop <= fromTop) current = el.id;
				});
				if (current) updateActiveLink(current);
			}, 100);
		};

		window.addEventListener("scroll", onScroll);
		return () => {
			anchors.forEach((anchor) =>
				anchor.removeEventListener("click", onAnchorClick),
			);
			window.removeEventListener("scroll", onScroll);
		};
	}, [pathname]);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
	}, [isMenuOpen]);

	const isPageLinkActive = (href: string) => {
		if (!href.startsWith("/")) return false;
		return pathname.split("#")[0].split("?")[0] === href;
	};

	return (
		<header
			className={`fixed top-0 inset-x-0 z-[9999] transition-all duration-300 rounded-b-xl ${
				scrolled
					? "bg-background-alt/95 backdrop-blur-lg shadow-md py-2"
					: "bg-background-alt/70 py-2"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link href="/" className="flex items-center" aria-label="Home">
							<Image
								height={40}
								width={40}
								src={navbarContent.logo.src}
								alt={navbarContent.logo.alt}
								className="h-[2rem] w-auto block object-contain"
							/>
						</Link>
					</div>

					{/* Links */}
					<div className="hidden md:flex justify-center flex-1">
						<ul className="flex items-center space-x-4">
							{navbarContent.links.map((link) => {
								const isActive = isPageLinkActive(link.href);
								const isAnchorActive =
									activeAnchor ===
									(link.href.startsWith("#") ? link.href.substring(1) : null);
								const activeClass =
									isActive || isAnchorActive
										? "text-primary font-medium"
										: "text-secondary";

								const commonClass =
									"relative px-3 py-2 rounded-md text-sm lg:text-base transition-all duration-200 hover:text-primary hover:bg-blue-50/50";

								const isPolicyPage =
									pathname === "/privacy-policy" ||
									pathname === "/terms-of-service" ||
									pathname === "/tools/color-generator";
								const adjustedHref =
									isPolicyPage && link.href.startsWith("#") ? "/" : link.href;

								return (
									<li key={link.label}>
										{link.href.startsWith("#") ? (
											<Link
												href={adjustedHref}
												className={`${commonClass} ${activeClass}`}
											>
												{link.label}
												{(isActive || isAnchorActive) && (
													<span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transform origin-left animate-[scaleX_0.3s_ease-in-out]" />
												)}
											</Link>
										) : (
											<Link
												href={adjustedHref}
												className={`${commonClass} ${activeClass}`}
											>
												{link.label}
												{isActive && (
													<span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transform origin-left animate-[scaleX_0.3s_ease-in-out]" />
												)}
											</Link>
										)}
									</li>
								);
							})}

							<div className="hidden md:block relative group">
								{/* Hover trigger */}
								<div className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-black cursor-pointer">
									Tools <BiChevronDown size={16} />
								</div>

								{/* Dropdown */}
								<div
									className="absolute left-0 top-full mt-0 w-48 rounded-md shadow-lg bg-white border border-gray-200 
									opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto 
									pointer-events-none transition-all duration-200 z-50"
								>
									{navbarContent.tools.map((section) => (
										<div key={section.name} className="px-4 py-2">
											<Link
												target={section.isExternal ? "_blank" : "_self"}
												href={section.url}
												className="block px-2 py-1 text-sm hover:bg-gray-100 rounded"
											>
												{section.name}
											</Link>
										</div>
									))}
								</div>
							</div>
						</ul>
					</div>

					{/* CTA Button */}
					<div className="hidden md:block">
						<a
							target="_blank"
							href={navbarContent.ctaButton.href}
							className="inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium bg-primary shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:scale-95"
						>
							{navbarContent.ctaButton.label}
						</a>
					</div>

					{/* Mobile Toggle */}
					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 rounded-md text-gray-800 hover:bg-blue-50/70 hover:text-blue-600 transition-colors duration-200"
						>
							{isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
						</button>
					</div>
				</nav>
			</div>

			{/* Mobile Menu */}
			<div
				className={`md:hidden fixed inset-0 z-40 transform ${
					isMenuOpen
						? "translate-x-0 opacity-100"
						: "translate-x-full opacity-0 pointer-events-none"
				} transition-all duration-300 ease-in-out`}
			>
				<div
					className="h-screen absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
					onClick={() => setIsMenuOpen(false)}
				/>
				<div className="h-screen fixed right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl flex flex-col">
					<div className="p-4 flex justify-end">
						<button
							type="button"
							onClick={() => setIsMenuOpen(false)}
							className="p-2 rounded-md text-secondary hover:bg-secondary/60"
						>
							<FiX size={24} />
						</button>
					</div>
					<div className="px-6 py-2 flex-grow">
						<ul className="space-y-3">
							{navbarContent.links.map((link) => {
								const isActive = isPageLinkActive(link.href);
								const isAnchorActive =
									activeAnchor ===
									(link.href.startsWith("#") ? link.href.substring(1) : null);

								const isPolicyPage =
									pathname === "/privacy-policy" ||
									pathname === "/terms-of-service" ||
									pathname === "/tools/color-generator";

								const adjustedHref =
									isPolicyPage && link.href.startsWith("#") ? "/" : link.href;

								return (
									<li key={link.label}>
										{link.href.startsWith("#") ? (
											<Link
												href={adjustedHref}
												className={`block px-3 py-3 text-base rounded-md font-medium transition-all duration-200 hover:bg-blue-50 ${
													isAnchorActive
														? "text-primary bg-blue-50/50"
														: "text-secondary/70"
												}`}
												onClick={() => setIsMenuOpen(false)}
											>
												{link.label}
											</Link>
										) : (
											<Link
												href={adjustedHref}
												className={`block px-3 py-3 text-base rounded-md font-medium transition-all duration-200 hover:bg-blue-50 ${
													isActive
														? "text-blue-600 bg-blue-50/50"
														: "text-gray-800"
												}`}
												onClick={() => setIsMenuOpen(false)}
											>
												{link.label}
											</Link>
										)}
									</li>
								);
							})}
						</ul>
						<div className="mt-2 bg-white border border-gray-200 rounded-md shadow-md p-4 z-50">
							{navbarContent.tools.map((section) => (
								<div key={section.name} className="mb-4">
									<Link
										target={section.isExternal ? "_blank" : "_self"}
										key={section.name}
										href={section.url}
										onClick={() => setIsMenuOpen(false)}
										className="block px-2 py-1 text-sm hover:bg-gray-100 rounded"
									>
										{section.name}
									</Link>
								</div>
							))}
						</div>
					</div>

					{/* CTA Button */}
					<div className="block md:hidden px-6 py-2">
						<a
							target="_blank"
							href={navbarContent.ctaButton.href}
							className="w-full inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium bg-primary shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:scale-95"
						>
							{navbarContent.ctaButton.label}
						</a>
					</div>
				</div>
			</div>
		</header>
	);
};
