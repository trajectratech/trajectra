import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { CONTACT, LEGAL_NAME } from "@/lib/site";

/**
 * Contact-form endpoint.
 *
 * The previous version took `to`, `subject`, `text` and `html` straight from
 * the request body and passed them to `sendMail`. That is an open mail relay:
 * anyone could POST arbitrary HTML to any recipient and it would be delivered
 * from info@trajectra.com over Trajectra's authenticated SMTP session —
 * phishing with genuine domain provenance, and enough volume to get the domain
 * blacklisted. The endpoint now accepts only the four form fields, decides the
 * recipient and subject itself, and escapes everything it renders.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Recipient is fixed server-side. It is never taken from the request. */
const RECIPIENT = process.env.CONTACT_RECIPIENT || CONTACT.email;

const MAX_LENGTHS = {
	name: 100,
	email: 254,
	phone: 32,
	message: 5000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * In-memory throttle: 5 submissions per IP per 10 minutes. Adequate for a
 * single-region deployment; move to a shared store (Upstash/Redis) if the site
 * is ever served from more than one instance, since each instance keeps its
 * own counter.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
	const now = Date.now();
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	recent.push(now);
	hits.set(ip, recent);
	if (hits.size > 5000) hits.clear(); // crude bound on memory growth
	return recent.length > MAX_PER_WINDOW;
}

/** Escapes the five HTML-significant characters before interpolating. */
function escapeHtml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Strips CR/LF. A newline inside a value that ends up in a header (the subject,
 * or a Reply-To built from user input) lets a submitter inject extra headers
 * such as Bcc — classic SMTP header injection.
 */
function singleLine(value: string) {
	return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: Request) {
	try {
		const ip =
			request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			"unknown";
		if (isRateLimited(ip)) {
			return NextResponse.json(
				{ error: "Too many messages. Please try again shortly." },
				{ status: 429 },
			);
		}

		const body = await request.json();
		const name = singleLine(String(body?.name ?? ""));
		const email = singleLine(String(body?.email ?? ""));
		const phone = singleLine(String(body?.phone ?? ""));
		const message = String(body?.message ?? "").trim();
		// Hidden field that real users never see and never fill in.
		const honeypot = String(body?.company ?? "").trim();

		if (honeypot) {
			// Respond as if it worked so bots get no signal to retry.
			return NextResponse.json({ message: "Message sent" }, { status: 200 });
		}

		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: "Name, email and message are required." },
				{ status: 400 },
			);
		}
		if (!EMAIL_RE.test(email)) {
			return NextResponse.json(
				{ error: "Please enter a valid email address." },
				{ status: 400 },
			);
		}
		if (
			name.length > MAX_LENGTHS.name ||
			email.length > MAX_LENGTHS.email ||
			phone.length > MAX_LENGTHS.phone ||
			message.length > MAX_LENGTHS.message
		) {
			return NextResponse.json(
				{ error: "One of the fields is too long." },
				{ status: 400 },
			);
		}

		if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_APP_PASSWORD) {
			console.error("send-email: SMTP credentials are not configured");
			return NextResponse.json(
				{ error: "Messaging is temporarily unavailable." },
				{ status: 503 },
			);
		}

		const transporter = nodemailer.createTransport({
			host: "smtp.zoho.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.ZOHO_EMAIL,
				pass: process.env.ZOHO_APP_PASSWORD,
			},
		});

		await transporter.sendMail({
			// `from` must stay the authenticated mailbox or SPF/DKIM fails and the
			// mail lands in spam. The visitor's address goes in Reply-To instead.
			from: `"${LEGAL_NAME} Website" <${process.env.ZOHO_EMAIL}>`,
			to: RECIPIENT,
			replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
			subject: `Website enquiry from ${name}`,
			text: [
				`Name: ${name}`,
				`Email: ${email}`,
				`Phone: ${phone || "not provided"}`,
				"",
				message,
			].join("\n"),
			html: `
				<p><strong>Name:</strong> ${escapeHtml(name)}</p>
				<p><strong>Email:</strong> ${escapeHtml(email)}</p>
				<p><strong>Phone:</strong> ${escapeHtml(phone) || "not provided"}</p>
				<p><strong>Message:</strong><br/>${escapeHtml(message).replace(
					/\n/g,
					"<br/>",
				)}</p>
			`,
		});

		return NextResponse.json({ message: "Message sent" }, { status: 200 });
	} catch (error) {
		console.error("send-email failed:", error);
		// Deliberately opaque: the caller gets no detail about SMTP internals.
		return NextResponse.json(
			{ error: "Failed to send message. Please email us directly." },
			{ status: 500 },
		);
	}
}
