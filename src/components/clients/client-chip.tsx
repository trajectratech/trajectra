import Image from "next/image";

import { EVENTS } from "@/lib/analytics";

export type ClientLogo = {
	name: string;
	src: string;
	width: number;
	height: number;
	url: string;
};

type ClientChipProps = {
	logo: ClientLogo;
	location: string;
};

/**
 * Named client chip, clickable to the client's own site.
 *
 * Why a chip instead of a bare greyscale wordmark row?
 *
 * Client marks arrive on every possible background (black squares, transparent
 * circles, white wordmarks), so normalising them inside a white chip keeps
 * every mark legible without recolouring anyone's brand. And showing the name
 * in text, not only the logo, means the proof is checkable for someone who
 * does not recognise the mark — that is the whole job of social proof.
 *
 * The entire chip is a click target (the `<a>` wraps everything), but the
 * focusable anchor in the accessibility tree is still exactly one element and
 * its accname is "Client name — visit their site (opens in a new tab)" via the
 * visually-hidden suffix, so screen readers do not have to guess what clicking
 * does.
 */
export function ClientChip({ logo, location }: ClientChipProps) {
	return (
		<a
			href={logo.url}
			target="_blank"
			rel="noopener noreferrer"
			data-analytics={EVENTS.clientLogoClick}
			data-analytics-location={location}
			data-client-name={logo.name}
			className="group flex items-center gap-3 rounded-full border border-neutral-200 bg-white py-2 pl-2 pr-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-strong/40 hover:shadow-md focus-visible:outline-none"
		>
			<span
				aria-hidden="true"
				className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-neutral-200 transition group-hover:ring-brand-strong/30"
			>
				<Image
					src={logo.src}
					alt=""
					aria-hidden="true"
					width={logo.width}
					height={logo.height}
					className="h-10 w-10 object-contain"
				/>
			</span>
			<span className="text-small font-medium text-neutral-700 transition group-hover:text-ink">
				{logo.name}
			</span>
			<span
				aria-hidden="true"
				className="ml-auto h-4 w-4 shrink-0 text-neutral-400 transition group-hover:text-brand-strong"
			>
				<svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
					<path
						d="M6.5 3h5.5v5.5"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M12 4 5 11"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
					/>
				</svg>
			</span>
			<span className="sr-only"> — visit their site (opens in a new tab)</span>
		</a>
	);
}
