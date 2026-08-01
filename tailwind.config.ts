import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const tokens = {
	/**
	 * Brand green. 2.22:1 against white — decorative and dark-surface use only.
	 * On #1F2937 it measures 6.61:1, so it is safe for the services section.
	 */
	brandGreen: "#34C759", // formerly brand-200
	/**
	 * Same hue and saturation, darkened until it clears WCAG 2.2 AA against
	 * white (4.60:1). This is the token for green text and for white-on-green
	 * buttons on light surfaces — including every primary CTA, which previously
	 * sat at 2.22:1 and failed 1.4.3 Contrast (Minimum).
	 */
	brandGreenAccessible: "#23863C",
	brandBlue: "#1F2937", // brand-300
	brandGrey: "#515151", // brand-150
	brandSoft: "#E2E8F0", // brand-100
	brandMid: "#ACACAC", // brand-250
	brandSemiMid: "#6B7280",
	brandMuted: "#C4C4C4", // brand-400
	brandAlt: "#858383", // brand-500
	brandSemiGrey: "#F4F5F5",
	white: "#FFFFFF",
	black: "#000000",
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
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				"navy-blue": "#032B44",
				"navy-blue-light": "#245875",
				"sea-green": "#34C759",
				// Brand colors
				primary: tokens.brandGreen,
				"primary-accessible": tokens.brandGreenAccessible,
				secondary: tokens.brandBlue,
				// Backgrounds
				// background: tokens.white,
				"background-alt": tokens.brandSoft,
				"background-dark": tokens.black,
				"background-semi-grey": tokens.brandSemiGrey,

				// Text roles

				"text-default": tokens.brandBlue,
				"text-light": tokens.white,
				"text-muted": tokens.brandGrey,
				"text-accent": tokens.brandAlt,

				// Borders and surfaces
				border: tokens.brandMid,
				surface: tokens.brandMuted,

				"semi-mid": tokens.brandSemiMid,
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-out": {
					"0%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
				"slide-in": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				scaleX: {
					"0%": { transform: "scaleX(0)" },
					"100%": { transform: "scaleX(1)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"slide-in": "slide-in 0.3s ease-out",
				scaleX: "scaleX 0.3s ease-out",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
