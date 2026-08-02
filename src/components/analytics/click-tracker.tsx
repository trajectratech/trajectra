"use client";

import { useEffect } from "react";

import { ANALYTICS_ATTR, trackEvent } from "@/lib/analytics";

/**
 * One delegated listener for every tracked click on the site.
 *
 * The alternative is an `onClick` on each CTA, which would force `CTA`, the
 * contact links and the nav button to all become client components — shipping
 * JavaScript for what is otherwise static markup. A single listener on the
 * document keeps every one of them server-rendered; they only need a
 * `data-analytics` attribute.
 *
 * Mounted once in the root layout. `capture: true` so the event fires even if
 * something downstream stops propagation, and the handler never blocks
 * navigation — `trackEvent` is fire-and-forget by design.
 */
/**
 * The label a sighted person sees, with screen-reader-only text removed.
 *
 * Raw `textContent` includes `.sr-only` spans, so events came through labelled
 * "Book a call (opens in a new tab)" and "Email Trajectra at info@…" — accurate
 * but noisy in a GA report where the label is the thing you scan.
 */
function visibleText(el: Element) {
	const clone = el.cloneNode(true) as Element;
	clone.querySelectorAll(".sr-only").forEach((node) => node.remove());
	return (clone.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 100);
}

export function ClickTracker() {
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			const target = (event.target as Element | null)?.closest?.(
				`[${ANALYTICS_ATTR}]`,
			);
			if (!target) return;

			const name = target.getAttribute(ANALYTICS_ATTR);
			if (!name) return;

			trackEvent(name, {
				// Where on the site the click happened, so the same CTA in the hero
				// and in the footer can be told apart.
				location: target.getAttribute("data-analytics-location") ?? "unknown",
				link_text: visibleText(target),
				page_path: window.location.pathname,
			});
		};

		document.addEventListener("click", onClick, { capture: true });
		return () =>
			document.removeEventListener("click", onClick, { capture: true });
	}, []);

	return null;
}
