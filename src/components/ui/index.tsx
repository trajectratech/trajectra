import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Layout primitives.
 *
 * The old page hard-coded section padding (`py-16` here, `py-20` there) and
 * switched between `max-w-7xl`, `max-w-4xl` and `max-w-xl` with no rule. These
 * exist so the rhythm is decided once and cannot drift.
 */

type Surface = "light" | "muted" | "dark";

const surfaceClass: Record<Surface, string> = {
	light: "bg-white",
	muted: "bg-neutral-50",
	dark: "bg-ink text-neutral-200",
};

export function Section({
	id,
	surface = "light",
	labelledBy,
	className = "",
	children,
}: {
	id?: string;
	surface?: Surface;
	labelledBy?: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			aria-labelledby={labelledBy}
			// `data-surface` lets globals.css swap the focus-ring colour on dark
			// panels without every control needing its own override.
			data-surface={surface === "dark" ? "dark" : undefined}
			className={`py-section-sm md:py-section px-5 sm:px-6 lg:px-8 ${surfaceClass[surface]} ${className}`}
		>
			<div className="mx-auto max-w-container">{children}</div>
		</section>
	);
}

/**
 * Filled circle with a tick.
 *
 * Replaces a single compound path that drew the circle and the tick in the same
 * winding direction. Under the default `fill-rule: nonzero` the tick never cut
 * through, so every checkmark on the site rendered as a solid blob. Drawing the
 * tick as a separate stroked path removes the fill-rule dependency entirely.
 *
 * The tick is stroked in the surface colour, so it must sit on a light
 * background — which is the only place it is used.
 */
export function CheckCircle({ className = "" }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 20 20"
			fill="none"
			className={`h-5 w-5 shrink-0 ${className}`}
		>
			<circle cx="10" cy="10" r="9" fill="currentColor" />
			<path
				d="m5.9 10.3 2.6 2.6 5.6-5.8"
				stroke="#fff"
				strokeWidth="1.9"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/**
 * Outlined circle with a dash — the counterpart to CheckCircle, for
 * "this is not included" / "not the right fit" lists. Visually distinct from
 * the tick by shape, not only by colour, so the distinction survives greyscale
 * and colour-blindness.
 */
export function ExcludeCircle({ className = "" }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 20 20"
			fill="none"
			className={`h-5 w-5 shrink-0 ${className}`}
		>
			<circle
				cx="10"
				cy="10"
				r="8.1"
				stroke="currentColor"
				strokeWidth="1.8"
			/>
			<path
				d="M6.4 10h7.2"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/** Small uppercase kicker above a heading. Purely typographic, never a heading. */
export function Eyebrow({
	children,
	tone = "light",
}: {
	children: ReactNode;
	tone?: "light" | "dark";
}) {
	return (
		<p
			className={`text-eyebrow uppercase mb-4 ${
				tone === "dark" ? "text-brand" : "text-brand-strong"
			}`}
		>
			{children}
		</p>
	);
}

export function SectionHeading({
	id,
	eyebrow,
	title,
	lede,
	tone = "light",
	align = "left",
}: {
	id: string;
	eyebrow?: string;
	title: string;
	lede?: string;
	tone?: "light" | "dark";
	align?: "left" | "center";
}) {
	return (
		<div
			className={`max-w-prose ${align === "center" ? "mx-auto text-center" : ""}`}
		>
			{eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
			<h2
				id={id}
				className={`text-h2 font-bold ${tone === "dark" ? "text-white" : ""}`}
			>
				{title}
			</h2>
			{lede && (
				<p
					className={`mt-4 text-body-lg ${
						tone === "dark" ? "text-neutral-300" : "text-neutral-600"
					}`}
				>
					{lede}
				</p>
			)}
		</div>
	);
}

/**
 * One primary action for the whole site.
 *
 * The old design had five different labels — "Let's Talk", "Get a Free
 * Consultation", "Start Your Project", "Book a Consultation", "Let's Talk
 * Strategy" — all pointing at the same booking page. Five labels for one
 * destination reads as indecision and splits the visitor's attention.
 */
const buttonBase =
	"inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] motion-safe:hover:-translate-y-0.5";

const buttonSize = {
	md: "px-5 py-2.5 text-small",
	lg: "px-7 py-3.5 text-body",
};

const buttonTone = {
	primary: "bg-brand-strong text-white hover:brightness-110 shadow-sm",
	inverse: "bg-white text-ink hover:bg-neutral-100",
	outline: "border border-neutral-300 text-ink hover:bg-neutral-50",
	"outline-dark": "border border-white/25 text-white hover:bg-white/10",
};

export function CTA({
	href,
	children,
	tone = "primary",
	size = "lg",
	external = false,
	className = "",
}: {
	href: string;
	children: ReactNode;
	tone?: keyof typeof buttonTone;
	size?: keyof typeof buttonSize;
	external?: boolean;
	className?: string;
}) {
	const classes = `${buttonBase} ${buttonSize[size]} ${buttonTone[tone]} ${className}`;

	if (external) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={classes}
			>
				{children}
				<span className="sr-only"> (opens in a new tab)</span>
			</a>
		);
	}

	return (
		<Link href={href} className={classes}>
			{children}
		</Link>
	);
}
