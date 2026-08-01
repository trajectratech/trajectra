// app/tools/color-generator/page.tsx

import ColorClient from "@/components/tools/color-generator";
import { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

const TITLE = "Website Color Palette Generator";
const DESCRIPTION =
	"Free colour palette generator. Enter any hex, RGB, HSL or named colour — or upload your logo — and get a complete, harmonious palette for your website.";
const PATH = "/tools/color-generator";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
};

const examples = ["#0F172A", "tomato", "hsl(200, 70%, 40%)", "skyblue"];

export default function ColorGenerator() {
	return (
		<main className="max-w-4xl mx-auto px-4  py-24 lg:px-32 mt-6 bg-white">
			<JsonLd
				data={webPageSchema({
					name: TITLE,
					description: DESCRIPTION,
					path: PATH,
				})}
			/>
			{/*
			 * No intermediate "Tools" level: there is no /tools hub page yet, and a
			 * breadcrumb item pointing at the same URL as its own child is invalid.
			 * Add the level back when the hub page exists (roadmap item 44).
			 */}
			<JsonLd
				data={breadcrumbSchema([
					{ name: "Color Palette Generator", path: PATH },
				])}
			/>
			<h1 className="text-3xl font-bold text-center mb-6 text-black">
				Website Color Palette Generator
			</h1>
			<p className="text-center text-gray-600 mb-10">
				Start with a single color — in hex, HSL, RGB, or even by name — and
				we’ll generate a complete, harmonious palette for your website. Or, just
				upload your logo and we’ll extract its dominant color to build your
				color system automatically.
			</p>

			<ColorClient examples={examples} />
		</main>
	);
}
