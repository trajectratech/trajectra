"use client";

import chroma from "chroma-js";
import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import ColorThief from "colorthief";
import Image from "next/image";

interface Props {
	examples: string[];
}

interface Palette {
	label: string;
	color: string;
}

export default function ColorClient({ examples }: Props) {
	const [primary, setPrimary] = useState("");
	const [secondary, setSecondary] = useState("");
	const [tertiary, setTertiary] = useState("");
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [palettes, setPalettes] = useState<Palette[][]>(
		examples.map((color) => buildPalette(color)!),
	);
	const [errors, setErrors] = useState<{
		primary?: string;
		secondary?: string;
		tertiary?: string;
	}>({});

	const imgRef = useRef<HTMLImageElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	function isValidColor(color: string): boolean {
		try {
			chroma(color);
			return true;
		} catch {
			return false;
		}
	}

	function buildPalette(
		baseColor: string,
		sec?: string,
		tert?: string,
	): Palette[] | null {
		if (!isValidColor(baseColor)) return null;
		if (sec && !isValidColor(sec)) return null;
		if (tert && !isValidColor(tert)) return null;

		const primary = chroma(baseColor).hex();
		const secondary = sec
			? chroma(sec).hex()
			: chroma(primary).brighten(1).hex();
		const accent = tert ? chroma(tert).hex() : chroma(primary).darken(1).hex();

		return [
			{ label: "Primary", color: primary },
			{ label: "Secondary", color: secondary },
			{ label: "Accent", color: accent },
			{ label: "Background", color: "#F9FAFB" },
			{ label: "Text", color: "#111827" },
			{ label: "Link", color: chroma(secondary).brighten(0.5).hex() },
			{ label: "Hover", color: chroma(primary).saturate(1).hex() },
			{ label: "Active", color: chroma(accent).darken(0.5).hex() },
			{ label: "Success", color: "#10B981" },
			{ label: "Error", color: "#e74c3c" },
		];
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const newErrors: typeof errors = {};
		if (!isValidColor(primary)) newErrors.primary = "Invalid primary color";
		if (secondary && !isValidColor(secondary))
			newErrors.secondary = "Invalid secondary color";
		if (tertiary && !isValidColor(tertiary))
			newErrors.tertiary = "Invalid tertiary color";

		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		const newPalette = buildPalette(primary, secondary, tertiary);
		if (!newPalette) return;

		const colorKey = newPalette.map((c) => c.color).join("-");
		const alreadyExists = palettes.some(
			(p) => p.map((c) => c.color).join("-") === colorKey,
		);

		if (alreadyExists) {
			toast("⚠️ That palette was already generated.");
			return;
		}

		setPalettes([newPalette, ...palettes]);
		setPrimary("");
		setSecondary("");
		setTertiary("");
		setErrors({});
	}

	function handleCopy(palette: Palette[]) {
		const output = palette.map((c) => `${c.label}: ${c.color}`).join("\n");
		navigator.clipboard.writeText(output);
		toast.success("🎨 Palette copied to clipboard!");
	}

	function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				setImageUrl(reader.result);
				toast("Click 'Generate' to extract colors from the image!");
			}
		};
		reader.readAsDataURL(file);

		// Reset the input so the same file can be uploaded again
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}

	function extractColorsFromImage() {
		if (!imgRef.current) {
			console.error("Color extraction failed:");
			toast.error("Failed to load this image, please try again.");
			return;
		}

		const img = imgRef.current;
		const colorThief = new ColorThief();

		if (img.complete && img.naturalHeight !== 0) {
			extract();
		} else {
			img.onload = extract;
		}

		function extract() {
			try {
				const dominant = colorThief.getColor(img); // [R, G, B]
				const palette = colorThief.getPalette(img, 3); // [[R, G, B], ...]

				const hexPrimary = chroma.rgb(...dominant).hex();
				const hexSecondary = chroma.rgb(...(palette?.[1] || dominant)).hex();
				const hexTertiary = chroma.rgb(...(palette?.[2] || dominant)).hex();

				setPrimary(hexPrimary);
				setSecondary(hexSecondary);
				setTertiary(hexTertiary);
				// toast.success("🎨 Colors extracted from image!");
			} catch (error) {
				console.error("Color extraction failed:", error);
				toast.error("Failed to extract colors from image.");
			}
		}
	}

	return (
		<div>
			<Toaster position="top-right" />

			{/* Image upload */}
			<div className="mb-6">
				<input
					id="logo-upload"
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					ref={inputRef}
					className="hidden"
				/>

				<label
					htmlFor="logo-upload"
					className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#34C759] text-white text-sm font-semibold rounded-md shadow hover:bg-[#2fad49] transition"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3m0-6V5a2 2 0 00-2-2H8a2 2 0 00-2 2v3"
						/>
					</svg>
					Choose Image
				</label>
				{imageUrl && (
					<div className="mt-4">
						<p className="text-xs text-gray-600 mb-1">Preview:</p>
						<Image
							src={imageUrl}
							alt="Preview"
							width={150}
							height={100}
							ref={imgRef}
							crossOrigin="anonymous"
							onLoad={extractColorsFromImage}
							className="max-w-xs rounded-md shadow"
						/>
					</div>
				)}
			</div>

			{/* Manual input + generate */}
			<form onSubmit={handleSubmit} className="mb-10 grid gap-4 sm:grid-cols-4">
				<div className="space-y-1">
					<input
						type="text"
						placeholder="Primary color"
						value={primary}
						onChange={(e) => setPrimary(e.target.value)}
						className="w-full px-4 py-2 border rounded-md text-sm  text-text-default"
					/>
					{errors.primary && (
						<p className="text-xs text-red-600">{errors.primary}</p>
					)}
				</div>

				<div className="space-y-1">
					<input
						type="text"
						placeholder="Secondary (optional)"
						value={secondary}
						onChange={(e) => setSecondary(e.target.value)}
						className="w-full px-4 py-2 border rounded-md text-sm  text-text-default"
					/>
					{errors.secondary && (
						<p className="text-xs text-red-600">{errors.secondary}</p>
					)}
				</div>

				<div className="space-y-1">
					<input
						type="text"
						placeholder="Tertiary (optional)"
						value={tertiary}
						onChange={(e) => setTertiary(e.target.value)}
						className="w-full px-4 py-2 border rounded-md text-sm text-text-default"
					/>
					{errors.tertiary && (
						<p className="text-xs text-red-600">{errors.tertiary}</p>
					)}
				</div>

				<button
					type="submit"
					className="bg-sea-green/90 text-white px-4 py-2 rounded-md hover:bg-sea-green transition"
				>
					Generate
				</button>
			</form>

			{/* Display palettes */}
			<div className="space-y-8">
				{palettes.map((palette, idx) => (
					<div key={idx} className="border p-4 rounded-md shadow-sm">
						<div className="grid sm:grid-cols-5 gap-4 mb-4">
							{palette.map((p, i) => (
								<div key={i} className="text-center">
									<div
										className="w-full h-12 rounded mb-1"
										style={{ backgroundColor: p.color }}
										title={p.color}
									/>
									<p className="text-xs font-medium text-gray-700">{p.label}</p>
									<p className="text-xs text-gray-500">{p.color}</p>
								</div>
							))}
						</div>
						<button
							onClick={() => handleCopy(palette)}
							className="text-xs text-sea-green hover:underline"
						>
							Copy Colors
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
