import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * Design system.
 *
 * Replaces a palette of eleven tokens, nine of which were near-greys with
 * overlapping roles (`brandGrey`, `brandMid`, `brandSemiMid`, `brandMuted`,
 * `brandAlt`, `brandSemiGrey`, `brandSoft`) that nobody could choose between
 * correctly. Everything below is a single ramp with a documented job and a
 * verified contrast pair.
 *
 * Contrast, measured (WCAG 2.2 AA needs 4.5:1 for body text, 3:1 for large):
 *
 *   neutral-700 on white ......... 11.06  body copy
 *   neutral-600 on white ..........7.51  secondary copy
 *   neutral-500 on white ......... 4.74  muted copy, the lightest that passes
 *   white on neutral-900 ........ 17.87  inverted sections
 *   neutral-300 on neutral-900 .. 10.21  muted copy on dark
 *   neutral-400 on neutral-900 ... 6.31  subtle copy on dark
 *   brand on neutral-900 ......... 8.05  green accents on dark
 *   brand-strong on white ........ 5.43  green text and CTAs on light
 *   brand-strong on neutral-50 ... 5.19  the same, on muted sections
 *   brand-strong on neutral-100 .. 4.79  the same, on the palest panels
 *
 * Two rules that cost an accessibility regression to learn:
 *   - neutral-400 and lighter must never carry body text on white.
 *   - neutral-500 does NOT pass on dark (3.77). It is a light-surface token.
 *
 * Verify any new colour against the *darkest* light surface it can land on and
 * the *lightest* dark one — not just white and black.
 */
const neutral = {
	50: "#F8FAFC",
	100: "#EDF1F6",
	200: "#DCE3EB",
	300: "#BAC5D1",
	400: "#8E9BAA",
	500: "#67757F",
	600: "#4A5661",
	700: "#333D47",
	800: "#1F2937",
	900: "#111820",
};

const brand = {
	/** Bright brand green. 2.22:1 on white — dark surfaces and accents only. */
	DEFAULT: "#34C759",
	/**
	 * Same hue and saturation, darkened until it clears AA on *every* light
	 * surface in the system, not just pure white.
	 *
	 * The earlier value (#23863C) was verified against #FFFFFF only, at 4.62.
	 * On neutral-50 — which every `surface="muted"` section uses — it measured
	 * 4.41 and failed. Verify new brand colours against the darkest light
	 * surface they can land on, not the lightest.
	 */
	strong: "#207936",
};

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		extend: {
			colors: {
				neutral,
				brand,
				/** The near-black used for inverted sections and headings. */
				ink: neutral[900],

				// --- Compatibility aliases -------------------------------------
				// The navbar, footer and contact form still reference the old
				// names. Mapped onto the new ramp so nothing renders differently
				// mid-migration; remove once every component is migrated.
				primary: brand.DEFAULT,
				"primary-accessible": brand.strong,
				secondary: neutral[800],
				"semi-mid": neutral[500],
				"background-alt": neutral[100],
				"background-dark": neutral[900],
				"background-semi-grey": neutral[50],
				surface: neutral[200],
				border: neutral[200],
			},

			/**
			 * Fluid type scale. Each step interpolates between a mobile and a
			 * desktop size, so there is no jump between breakpoints — the old
			 * hero heading went from `text-[1.2rem]` to `text-5xl` with nothing
			 * in between, and was smaller than the body text beside it on phones.
			 *
			 * Negative tracking on the large steps is what stops big Poppins
			 * settings looking loose and juvenile.
			 */
			fontSize: {
				display: [
					"clamp(2.5rem, 1.4rem + 4.4vw, 4.25rem)",
					{ lineHeight: "1.04", letterSpacing: "-0.035em" },
				],
				h1: [
					"clamp(2rem, 1.35rem + 2.6vw, 3.25rem)",
					{ lineHeight: "1.08", letterSpacing: "-0.03em" },
				],
				h2: [
					"clamp(1.625rem, 1.25rem + 1.5vw, 2.25rem)",
					{ lineHeight: "1.15", letterSpacing: "-0.022em" },
				],
				h3: [
					"clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem)",
					{ lineHeight: "1.35", letterSpacing: "-0.012em" },
				],
				"body-lg": ["1.125rem", { lineHeight: "1.6" }],
				body: ["1rem", { lineHeight: "1.65" }],
				small: ["0.875rem", { lineHeight: "1.55" }],
				eyebrow: [
					"0.75rem",
					{ lineHeight: "1", letterSpacing: "0.14em", fontWeight: "600" },
				],
			},

			maxWidth: {
				/** One content width for every section. */
				container: "72rem",
				/** One measure for running prose — roughly 70 characters. */
				prose: "42rem",
			},

			spacing: {
				/** The single vertical rhythm for section padding. */
				section: "6rem",
				"section-sm": "4rem",
			},

			borderRadius: {
				card: "1rem",
			},

			keyframes: {
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(0.5rem)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				"fade-up": "fade-up 0.4s ease-out both",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
