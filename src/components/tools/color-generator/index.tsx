"use client";

import chroma from "chroma-js";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
	const [palettes, setPalettes] = useState<Palette[][]>(
		examples.map((color) => buildPalette(color)!),
	);
	const [errors, setErrors] = useState<{
		primary?: string;
		secondary?: string;
		tertiary?: string;
	}>({});

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

	return (
		<div>
			<Toaster position="top-right" />

			<form onSubmit={handleSubmit} className="mb-10 grid gap-4 sm:grid-cols-4">
				<div className="space-y-1">
					<input
						type="text"
						placeholder="Primary color"
						value={primary}
						onChange={(e) => setPrimary(e.target.value)}
						className="w-full px-4 py-2 border rounded-md text-sm"
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
						className="w-full px-4 py-2 border rounded-md text-sm"
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
						className="w-full px-4 py-2 border rounded-md text-sm"
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
