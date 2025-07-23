// app/tools/color-generator/page.tsx

import ColorClient from "@/components/tools/color-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Color Palette Generator - Trajectra Tools",
	description:
		"Generate beautiful color palettes using any base color (hex, rgb, hsl, or color names).",
};

const examples = ["#0F172A", "tomato", "hsl(200, 70%, 40%)", "skyblue"];

export default function ColorGenerator() {
	return (
		<main className="max-w-4xl mx-auto px-4  py-24 lg:px-32 mt-6 bg-white">
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
