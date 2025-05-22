"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkData {
	href: string;
	label: string;
}

export function FooterLinks({ links }: { links: LinkData[] }) {
	const pathname = usePathname();

	return (
		<ul className="space-y-2">
			{links.map((link, index) => {
				const isPolicyPage =
					pathname === "/privacy-policy" || pathname === "/terms-of-service";

				const adjustedHref =
					isPolicyPage && link.href.startsWith("#") ? "/" : link.href;

				return (
					<li key={index}>
						<Link href={adjustedHref} className="hover:text-primary transition">
							{link.label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
