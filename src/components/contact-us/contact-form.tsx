"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import { CheckCircle } from "@/components/ui";

/** Mirrors the caps enforced server-side in /api/send-email. */
const MAX_LENGTHS = {
	name: 100,
	email: 254,
	phone: 32,
	message: 5000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "name" | "email" | "phone" | "message";
type FormValues = Record<Field | "company", string>;
type FormErrors = Partial<Record<Field, string>>;

const EMPTY: FormValues = {
	name: "",
	email: "",
	phone: "",
	message: "",
	company: "",
};

/** Ordered, so the error summary lists problems in the order they appear. */
const FIELDS: Field[] = ["name", "email", "phone", "message"];

const fieldBase =
	"block w-full rounded-lg border bg-white px-4 py-3 text-body text-ink placeholder:text-neutral-500 shadow-sm outline-none transition focus:border-brand-strong focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-neutral-100";
const fieldValid = "border-neutral-200";
const fieldInvalid = "border-red-500 focus:border-red-600 focus:ring-red-500/20";

function validate(values: FormValues): FormErrors {
	const errors: FormErrors = {};
	const name = values.name.trim();
	const email = values.email.trim();
	const phone = values.phone.trim();
	const message = values.message.trim();

	if (!name) errors.name = "Enter your name.";
	else if (name.length > MAX_LENGTHS.name)
		errors.name = `Your name is too long — ${MAX_LENGTHS.name} characters maximum.`;

	if (!email) errors.email = "Enter your email address.";
	else if (!EMAIL_RE.test(email))
		errors.email = "Enter an email address in the format name@example.com.";
	else if (email.length > MAX_LENGTHS.email)
		errors.email = `That email address is too long — ${MAX_LENGTHS.email} characters maximum.`;

	if (phone.length > MAX_LENGTHS.phone)
		errors.phone = `That phone number is too long — ${MAX_LENGTHS.phone} characters maximum.`;

	if (!message) errors.message = "Tell us what you're building.";
	else if (message.length > MAX_LENGTHS.message)
		errors.message = `Your message is too long — ${MAX_LENGTHS.message} characters maximum.`;

	return errors;
}

export function ContactForm() {
	const [values, setValues] = useState<FormValues>(EMPTY);
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [sendError, setSendError] = useState<string | null>(null);
	const [sent, setSent] = useState(false);

	const summaryRef = useRef<HTMLDivElement>(null);
	const successRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	/**
	 * `useId` rather than hard-coded ids. The previous version used literals like
	 * `contact-name`, which collide the moment the form appears twice on a page —
	 * and duplicate ids silently break every label and aria-describedby pairing.
	 */
	const uid = useId();
	const fieldId = (field: Field) => `${uid}-${field}`;
	const errorId = (field: Field) => `${uid}-${field}-error`;

	const onChange =
		(key: keyof FormValues) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setValues((v) => ({ ...v, [key]: event.target.value }));
			if (errors[key as Field])
				setErrors((e) => ({ ...e, [key]: undefined }));
		};

	const focusField = (field: Field) => {
		formRef.current
			?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(field))}`)
			?.focus();
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSendError(null);

		const nextErrors = validate(values);
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			// Focus the summary rather than the first field: it names every
			// problem at once, and each entry links to its input. Focusing the
			// first field instead would announce one error and hide the rest.
			requestAnimationFrame(() => summaryRef.current?.focus());
			return;
		}

		setSubmitting(true);
		// A client-side ceiling as well as the server's SMTP timeouts. If the
		// route itself stalls — cold start, platform hiccup — the visitor still
		// gets an outcome instead of an indefinite spinner.
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 20_000);

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
				signal: controller.signal,
			});
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				setSendError(
					typeof data?.error === "string"
						? data.error
						: "Something went wrong sending your message.",
				);
				return;
			}

			setValues(EMPTY);
			setSent(true);
			requestAnimationFrame(() => successRef.current?.focus());
		} catch (error) {
			setSendError(
				error instanceof DOMException && error.name === "AbortError"
					? "That took too long. Please try again, or email us directly at info@trajectra.com."
					: "We couldn't reach the server. Check your connection and try again, or email us directly at info@trajectra.com.",
			);
		} finally {
			clearTimeout(timeout);
			setSubmitting(false);
		}
	};

	/**
	 * Success replaces the form.
	 *
	 * The previous version called `toast.success()` — but no `<Toaster />` was
	 * mounted anywhere in the app, so nothing was rendered and a visitor who
	 * submitted got no feedback at all. A persistent panel is a better answer
	 * than remounting the toaster: a toast for a form submission disappears
	 * after a few seconds, is easy to miss, and leaves the filled-in form on
	 * screen looking like nothing happened.
	 */
	if (sent) {
		return (
			<div
				ref={successRef}
				tabIndex={-1}
				role="status"
				className="rounded-card border border-brand-strong/25 bg-white p-8 text-center outline-none"
			>
				<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-strong/10">
					<CheckCircle className="h-7 w-7 text-brand-strong" />
				</span>
				<h3 className="mt-5 text-h3 font-semibold">Message sent</h3>
				<p className="mx-auto mt-2 max-w-sm text-body text-neutral-600">
					Thanks — we read every enquiry and reply within one business day. If
					it&rsquo;s urgent, book a call instead and pick a time that suits you.
				</p>
				<button
					type="button"
					onClick={() => setSent(false)}
					className="mt-6 text-small font-semibold text-brand-strong underline underline-offset-4 hover:brightness-110"
				>
					Send another message
				</button>
			</div>
		);
	}

	const invalidFields = FIELDS.filter((field) => errors[field]);

	return (
		<form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
			{/*
			 * Error summary. One live region naming every problem, rather than a
			 * `role="alert"` on each field — four alerts firing at once queue
			 * unpredictably in screen readers and the visitor hears fragments.
			 */}
			{invalidFields.length > 0 && (
				<div
					ref={summaryRef}
					tabIndex={-1}
					role="alert"
					className="rounded-lg border border-red-300 bg-red-50 p-4 outline-none"
				>
					<h3 className="text-small font-semibold text-red-800">
						{invalidFields.length === 1
							? "There is a problem with one field"
							: `There are problems with ${invalidFields.length} fields`}
					</h3>
					<ul className="mt-2 space-y-1 text-small">
						{invalidFields.map((field) => (
							<li key={field}>
								<button
									type="button"
									onClick={() => focusField(field)}
									className="text-red-800 underline underline-offset-2 hover:no-underline"
								>
									{errors[field]}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{sendError && (
				<div
					role="alert"
					className="rounded-lg border border-red-300 bg-red-50 p-4 text-small text-red-800"
				>
					{sendError}
				</div>
			)}

			{/*
			 * Honeypot. `absolute` needs a positioned ancestor to behave
			 * predictably, which the form did not guarantee, so this is moved
			 * off-screen with a transform-free clip instead — no layout
			 * dependency, still invisible, still unreachable.
			 */}
			<div aria-hidden="true" className="sr-only">
				<label htmlFor={`${uid}-company`}>Leave this field empty</label>
				<input
					id={`${uid}-company`}
					name="company"
					type="text"
					autoComplete="off"
					tabIndex={-1}
					value={values.company}
					onChange={onChange("company")}
				/>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<Field
					id={fieldId("name")}
					errorId={errorId("name")}
					label="Name"
					required
					error={errors.name}
				>
					<input
						id={fieldId("name")}
						name="name"
						type="text"
						autoComplete="name"
						required
						disabled={submitting}
						maxLength={MAX_LENGTHS.name}
						value={values.name}
						onChange={onChange("name")}
						aria-invalid={errors.name ? true : undefined}
						aria-describedby={errors.name ? errorId("name") : undefined}
						className={`${fieldBase} ${errors.name ? fieldInvalid : fieldValid}`}
					/>
				</Field>

				<Field
					id={fieldId("email")}
					errorId={errorId("email")}
					label="Email"
					required
					error={errors.email}
				>
					<input
						id={fieldId("email")}
						name="email"
						type="email"
						inputMode="email"
						autoComplete="email"
						required
						disabled={submitting}
						maxLength={MAX_LENGTHS.email}
						value={values.email}
						onChange={onChange("email")}
						aria-invalid={errors.email ? true : undefined}
						aria-describedby={errors.email ? errorId("email") : undefined}
						className={`${fieldBase} ${errors.email ? fieldInvalid : fieldValid}`}
					/>
				</Field>
			</div>

			<Field
				id={fieldId("phone")}
				errorId={errorId("phone")}
				label="Phone"
				optional
				error={errors.phone}
			>
				<input
					id={fieldId("phone")}
					name="phone"
					type="tel"
					inputMode="tel"
					autoComplete="tel"
					disabled={submitting}
					maxLength={MAX_LENGTHS.phone}
					value={values.phone}
					onChange={onChange("phone")}
					aria-invalid={errors.phone ? true : undefined}
					aria-describedby={errors.phone ? errorId("phone") : undefined}
					className={`${fieldBase} ${errors.phone ? fieldInvalid : fieldValid}`}
				/>
			</Field>

			<Field
				id={fieldId("message")}
				errorId={errorId("message")}
				label="Message"
				required
				error={errors.message}
			>
				<textarea
					id={fieldId("message")}
					name="message"
					rows={5}
					required
					disabled={submitting}
					maxLength={MAX_LENGTHS.message}
					value={values.message}
					onChange={onChange("message")}
					// A prompt, not decoration: it shapes the enquiry into something
					// answerable, which is most of what makes a contact form useful.
					placeholder="What are you building, where are you stuck, and when does it need to be live?"
					aria-invalid={errors.message ? true : undefined}
					aria-describedby={errors.message ? errorId("message") : undefined}
					className={`${fieldBase} min-h-[150px] resize-y ${
						errors.message ? fieldInvalid : fieldValid
					}`}
				/>
			</Field>

			<div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
				<button
					type="submit"
					disabled={submitting}
					className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-strong px-7 py-3.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{submitting && (
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							className="h-4 w-4 animate-spin"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="3"
								fill="none"
								opacity="0.25"
							/>
							<path
								d="M12 2a10 10 0 0 1 10 10"
								stroke="currentColor"
								strokeWidth="3"
								fill="none"
								strokeLinecap="round"
							/>
						</svg>
					)}
					{submitting ? "Sending…" : "Send message"}
				</button>
				<p className="text-small text-neutral-500">
					We reply within one business day.
				</p>
			</div>
		</form>
	);
}

/** Label + error scaffolding, so each field is not 20 lines of repetition. */
function Field({
	id,
	errorId,
	label,
	required,
	optional,
	error,
	children,
}: {
	id: string;
	errorId: string;
	label: string;
	required?: boolean;
	optional?: boolean;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-2 block text-small font-semibold text-neutral-800"
			>
				{label}
				{required && (
					<>
						<span className="text-red-600" aria-hidden="true">
							{" "}
							*
						</span>
						<span className="sr-only"> (required)</span>
					</>
				)}
				{optional && (
					<span className="font-normal text-neutral-500"> (optional)</span>
				)}
			</label>
			{children}
			{error && (
				<p id={errorId} className="mt-1.5 text-small text-red-700">
					{error}
				</p>
			)}
		</div>
	);
}
