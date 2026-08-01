"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

const MAX_LENGTHS = {
	name: 100,
	email: 254,
	phone: 32,
	message: 5000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormValues = {
	name: string;
	email: string;
	phone: string;
	message: string;
	company: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const fieldBase =
	"block w-full rounded-lg border bg-white px-4 py-3 text-body text-ink placeholder:text-neutral-500 shadow-sm outline-none transition focus:border-brand-strong focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-neutral-100";
const fieldValid = "border-neutral-200";
const fieldInvalid = "border-red-400 focus:border-red-500 focus:ring-red-500/20";

function validate(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	const name = values.name.trim();
	const email = values.email.trim();
	const phone = values.phone.trim();
	const message = values.message.trim();

	if (!name) errors.name = "Please enter your name.";
	else if (name.length > MAX_LENGTHS.name)
		errors.name = `Name is too long (max ${MAX_LENGTHS.name}).`;

	if (!email) errors.email = "Please enter your email.";
	else if (!EMAIL_RE.test(email))
		errors.email = "Please enter a valid email address.";
	else if (email.length > MAX_LENGTHS.email)
		errors.email = `Email is too long (max ${MAX_LENGTHS.email}).`;

	if (phone.length > MAX_LENGTHS.phone)
		errors.phone = `Phone is too long (max ${MAX_LENGTHS.phone}).`;

	if (!message) errors.message = "Please tell us what you're building.";
	else if (message.length > MAX_LENGTHS.message)
		errors.message = `Message is too long (max ${MAX_LENGTHS.message}).`;

	return errors;
}

export function ContactUsFormWrapper() {
	const [values, setValues] = useState<FormValues>({
		name: "",
		email: "",
		phone: "",
		message: "",
		company: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitting, setSubmitting] = useState(false);

	const onChange =
		(key: keyof FormValues) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setValues((v) => ({ ...v, [key]: event.target.value }));
			if (errors[key]) {
				setErrors((e) => ({ ...e, [key]: undefined }));
			}
		};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const nextErrors = validate(values);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		setSubmitting(true);
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json().catch(() => ({} as never));
			const error = typeof data?.error === "string" ? data.error : null;

			if (!response.ok) {
				toast.error(error ?? "Something went wrong. Please try again.");
				return;
			}

			toast.success("Message sent — we'll get back to you shortly.");
			setValues({
				name: "",
				email: "",
				phone: "",
				message: "",
				company: "",
			});
		} catch {
			toast.error("Network error. Please try again or email us directly.");
		} finally {
			setSubmitting(false);
		}
	};

	const describedBy = (key: keyof FormValues) =>
		errors[key] ? `contact-error-${key}` : undefined;

	return (
		<form
			onSubmit={onSubmit}
			noValidate
			className="space-y-5"
			aria-describedby="contact-note"
		>
			<p id="contact-note" className="sr-only">
				We reply to messages submitted here within one business day.
			</p>

			{/* Honeypot: bots fill it; humans never see it. */}
			<div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" tabIndex={-1}>
				<label htmlFor="contact-company">
					Do not fill this field in.
					<input
						id="contact-company"
						name="company"
						type="text"
						autoComplete="off"
						tabIndex={-1}
						value={values.company}
						onChange={onChange("company")}
					/>
				</label>
			</div>

			<div>
				<label
					htmlFor="contact-name"
					className="mb-2 block text-small font-semibold text-neutral-800"
				>
					Name <span className="text-red-500" aria-hidden="true">*</span>
					<span className="sr-only"> (required)</span>
				</label>
				<input
					id="contact-name"
					name="name"
					type="text"
					autoComplete="name"
					required
					disabled={submitting}
					maxLength={MAX_LENGTHS.name}
					value={values.name}
					onChange={onChange("name")}
					aria-invalid={!!errors.name}
					aria-describedby={describedBy("name")}
					className={`${fieldBase} ${errors.name ? fieldInvalid : fieldValid}`}
				/>
				{errors.name && (
					<p
						id="contact-error-name"
						className="mt-1.5 text-small text-red-600"
						role="alert"
					>
						{errors.name}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="contact-email"
					className="mb-2 block text-small font-semibold text-neutral-800"
				>
					Email <span className="text-red-500" aria-hidden="true">*</span>
					<span className="sr-only"> (required)</span>
				</label>
				<input
					id="contact-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					disabled={submitting}
					maxLength={MAX_LENGTHS.email}
					value={values.email}
					onChange={onChange("email")}
					aria-invalid={!!errors.email}
					aria-describedby={describedBy("email")}
					className={`${fieldBase} ${errors.email ? fieldInvalid : fieldValid}`}
				/>
				{errors.email && (
					<p
						id="contact-error-email"
						className="mt-1.5 text-small text-red-600"
						role="alert"
					>
						{errors.email}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="contact-phone"
					className="mb-2 block text-small font-semibold text-neutral-800"
				>
					Phone <span className="font-normal text-neutral-500">(optional)</span>
				</label>
				<input
					id="contact-phone"
					name="phone"
					type="tel"
					autoComplete="tel"
					disabled={submitting}
					maxLength={MAX_LENGTHS.phone}
					value={values.phone}
					onChange={onChange("phone")}
					aria-invalid={!!errors.phone}
					aria-describedby={describedBy("phone")}
					className={`${fieldBase} ${errors.phone ? fieldInvalid : fieldValid}`}
				/>
				{errors.phone && (
					<p
						id="contact-error-phone"
						className="mt-1.5 text-small text-red-600"
						role="alert"
					>
						{errors.phone}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="contact-message"
					className="mb-2 block text-small font-semibold text-neutral-800"
				>
					Message <span className="text-red-500" aria-hidden="true">*</span>
					<span className="sr-only"> (required)</span>
				</label>
				<textarea
					id="contact-message"
					name="message"
					rows={5}
					required
					disabled={submitting}
					maxLength={MAX_LENGTHS.message}
					value={values.message}
					onChange={onChange("message")}
					aria-invalid={!!errors.message}
					aria-describedby={describedBy("message")}
					className={`${fieldBase} resize-y min-h-[140px] ${
						errors.message ? fieldInvalid : fieldValid
					}`}
				/>
				{errors.message && (
					<p
						id="contact-error-message"
						className="mt-1.5 text-small text-red-600"
						role="alert"
					>
						{errors.message}
					</p>
				)}
			</div>

			<button
				type="submit"
				disabled={submitting}
				className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-7 py-3.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:brightness-75 sm:w-auto"
			>
				{submitting ? "Sending…" : "Send message"}
			</button>
		</form>
	);
}
