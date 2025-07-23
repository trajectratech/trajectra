"use client";

import { usePathname } from "next/navigation";
import { MouseEvent } from "react";

interface LinkData {
	href: string;
	label: string;
}

export function FooterLinks({ links }: { links: LinkData[] }) {
	const pathname = usePathname();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
		if (href.startsWith("#")) {
			e.preventDefault();

			const targetId = href.slice(1);
			const element = document.getElementById(targetId);

			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			} else if (targetId === "home") {
				// Scroll to top if #home and no element is found
				window.scrollTo({ top: 0, behavior: "smooth" });
			}

			// Remove the hash from the URL bar
			window.history.replaceState(null, "", pathname);
		}
	};

	return (
		<ul className="space-y-2">
			{links.map((link, index) => {
				const isPolicyPage =
					pathname === "/privacy-policy" ||
					pathname === "/terms-of-service" ||
					pathname === "/tools/color-generator";
				const adjustedHref =
					isPolicyPage && link.href.startsWith("#") ? "/" : link.href;

				return (
					<li key={index}>
						<a
							href={adjustedHref}
							onClick={(e) => handleClick(e, link.href)}
							className="hover:text-primary transition"
						>
							{link.label}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
