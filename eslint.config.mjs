import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * Flat config, replacing `.eslintrc.json`.
 *
 * Two things forced this. ESLint 9 — required by eslint-config-next@16 — reads
 * `eslint.config.mjs` rather than `.eslintrc.*`, and Next 16 removed the
 * `next lint` command entirely, so linting is invoked through the `eslint`
 * binary directly (see the `lint` script in package.json).
 *
 * `eslint-config-next` v16 exports real flat-config arrays from
 * `/core-web-vitals` and `/typescript`, so no `FlatCompat` shim is needed.
 */
const config = [
	...nextCoreWebVitals,
	...nextTypeScript,
	{
		// Flat config has no `.eslintignore`; ignores are declared here.
		ignores: [
			".next/**",
			"out/**",
			"build/**",
			"node_modules/**",
			"next-env.d.ts",
		],
	},
];

export default config;
