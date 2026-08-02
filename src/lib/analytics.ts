/**
 * GA4 event tracking.
 *
 * The site had only `gtag('config', …)` — pageviews and nothing else. Every
 * booking-link click and every form submission was untracked, so the site's
 * conversion rate was literally unknown and no change to the page could be
 * judged against the one before it.
 *
 * Event names follow GA4's recommended set where one exists (`generate_lead`),
 * because recommended events populate the standard reports; custom names only
 * appear once you build an exploration for them.
 */

/** The subset of gtag we use. GA loads lazily, so it may not exist yet. */
type Gtag = (
	command: "event",
	eventName: string,
	params?: Record<string, unknown>,
) => void;

declare global {
	interface Window {
		gtag?: Gtag;
		dataLayer?: unknown[];
	}
}

export const ANALYTICS_ATTR = "data-analytics";

/**
 * Fires an event, or does nothing if GA has not loaded.
 *
 * Deliberately silent on failure: analytics must never be able to break a
 * booking link or a form submission. GA is `lazyOnload`, so a very fast click
 * can genuinely land before gtag exists — the queue below covers that.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
	if (typeof window === "undefined") return;

	if (typeof window.gtag === "function") {
		window.gtag("event", name, params);
		return;
	}

	// gtag.js defines `gtag` itself, but pushing the same argument shape onto
	// dataLayer before it loads is the documented way to queue early events.
	// Without this, a click in the first second of the page is lost — which is
	// exactly when an impatient visitor clicks.
	if (Array.isArray(window.dataLayer)) {
		window.dataLayer.push(["event", name, params]);
	}
}

/** Events used on the site. Kept in one place so names cannot drift. */
export const EVENTS = {
	/** GA4 recommended event. Mark this one as a key event in the GA4 UI. */
	generateLead: "generate_lead",
	bookCallClick: "book_call_click",
	emailClick: "contact_email_click",
	phoneClick: "contact_phone_click",
	formError: "contact_form_error",
} as const;
