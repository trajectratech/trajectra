import type { Thing, WithContext } from "@/lib/structured-data";

/**
 * Renders structured data the only way search engines actually read it:
 * `<script type="application/ld+json">`.
 *
 * This previously went through Next's `metadata.other`, which emits
 * `<meta name="application/ld+json" content="...">`. Google's parsers ignore
 * `<meta>` entirely for JSON-LD, so the site shipped with zero machine-readable
 * structured data despite the payload being present in the HTML.
 *
 * `dangerouslySetInnerHTML` is required — React escapes text children, which
 * would corrupt the JSON. The `<` escape guards against a string in the payload
 * closing the script tag early.
 */
export function JsonLd({ data }: { data: WithContext<Thing> | Thing }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
