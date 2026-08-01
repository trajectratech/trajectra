"use client";

import React, { useId, useRef, useState } from "react";
import toast from "react-hot-toast";

type Field = "name" | "email" | "phone" | "message";
type Values = Record<Field, string>;

const EMPTY: Values = { name: "", email: "", phone: "", message: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

function validate(values: Values): Partial<Record<Field, string>> {
	const errors: Partial<Record<Field, string>> = {};

	if (!values.name.trim()) errors.name = "Please enter your name.";
	if (!values.email.trim()) errors.email = "Please enter your email address.";
	else if (!EMAIL_RE.test(values.email))
		errors.email = "That doesn't look like a valid email address.";
	// Phone is now optional: it was required, which cost conversions from
	// visitors who would happily give an email but not a number.
	if (values.phone.trim() && !PHONE_RE.test(values.phone))
		errors.phone = "Please enter a valid phone number, or leave it blank.";
	if (!values.message.trim()) errors.message = "Please tell us about your project.";

	return errors;
}

export const ContactUsForm = () => {
	const [values, setValues] = useState<Values>(EMPTY);
	const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
	const [loading, setLoading] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	/** Uncontrolled: only ever read, never rendered back. */
	const honeypotRef = useRef<HTMLInputElement>(null);

	// Stable ids so the labels, inputs and error messages stay wired together
	// even if the form is ever rendered more than once on a page.
	const id = useId();
	const fieldId = (field: Field) => `${id}-${field}`;
	const errorId = (field: Field) => `${id}-${field}-error`;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const field = e.target.name as Field;
		setValues((prev) => ({ ...prev, [field]: e.target.value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const nextErrors = validate(values);
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			// WCAG 3.3.1: move focus to the first field in error so the message is
			// announced. Previously errors only appeared visually and a screen
			// reader user got no feedback that submission had failed at all.
			const first = Object.keys(nextErrors)[0] as Field;
			formRef.current
				?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)
				?.focus();
			return;
		}

		setLoading(true);
		const toastId = toast.loading("Sending message…");

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// Only the form fields. The endpoint decides the recipient and
				// subject itself; it used to accept both from here, which made it
				// an open mail relay.
				body: JSON.stringify({
					...values,
					company: honeypotRef.current?.value ?? "",
				}),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.error || "Failed to send message.");
			}

			toast.success("Thanks — we'll be in touch within one business day.", {
				id: toastId,
			});
			setValues(EMPTY);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Something went wrong.",
				{ id: toastId },
			);
		} finally {
			setLoading(false);
		}
	};

	const inputClass = (field: Field) =>
		`mt-1 block w-full rounded-2xl px-4 border bg-background-semi-grey shadow-sm placeholder:text-sm placeholder:text-semi-mid focus:border-primary-accessible focus:ring-primary-accessible ${
			errors[field] ? "border-red-600" : "border-background-semi-grey"
		}`;

	const describedBy = (field: Field) =>
		errors[field] ? errorId(field) : undefined;

	const ErrorText = ({ field }: { field: Field }) =>
		errors[field] ? (
			<p id={errorId(field)} className="text-red-700 text-xs mt-1">
				{errors[field]}
			</p>
		) : null;

	return (
		<form
			ref={formRef}
			className="flex flex-col space-y-6"
			onSubmit={handleSubmit}
			noValidate
		>
			{/*
			 * Honeypot. Hidden from sighted users by position rather than
			 * `display: none` (which some bots detect), and removed from the
			 * accessibility tree and the tab order so it can never trap a real
			 * visitor.
			 */}
			<div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
				<label htmlFor={fieldId("name") + "-company"}>Company</label>
				<input
					ref={honeypotRef}
					id={fieldId("name") + "-company"}
					name="company"
					type="text"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex flex-col space-y-4 flex-1">
					<div>
						<label
							htmlFor={fieldId("name")}
							className="block text-sm font-medium text-secondary"
						>
							Name <span className="text-red-700">*</span>
						</label>
						<input
							type="text"
							id={fieldId("name")}
							name="name"
							value={values.name}
							onChange={handleChange}
							placeholder="Enter your name"
							disabled={loading}
							required
							autoComplete="name"
							aria-invalid={errors.name ? true : undefined}
							aria-describedby={describedBy("name")}
							className={`h-12 ${inputClass("name")}`}
						/>
						<ErrorText field="name" />
					</div>

					<div>
						<label
							htmlFor={fieldId("email")}
							className="block text-sm font-medium text-secondary"
						>
							Email <span className="text-red-700">*</span>
						</label>
						<input
							type="email"
							id={fieldId("email")}
							name="email"
							value={values.email}
							onChange={handleChange}
							placeholder="you@company.com"
							disabled={loading}
							required
							autoComplete="email"
							aria-invalid={errors.email ? true : undefined}
							aria-describedby={describedBy("email")}
							className={`h-12 ${inputClass("email")}`}
						/>
						<ErrorText field="email" />
					</div>

					<div>
						<label
							htmlFor={fieldId("phone")}
							className="block text-sm font-medium text-secondary"
						>
							Phone number{" "}
							<span className="text-semi-mid font-normal">(optional)</span>
						</label>
						<input
							type="tel"
							id={fieldId("phone")}
							name="phone"
							value={values.phone}
							onChange={handleChange}
							placeholder="+234 …"
							disabled={loading}
							autoComplete="tel"
							aria-invalid={errors.phone ? true : undefined}
							aria-describedby={describedBy("phone")}
							className={`h-12 ${inputClass("phone")}`}
						/>
						<ErrorText field="phone" />
					</div>
				</div>

				<div className="flex-1 flex flex-col">
					<label
						htmlFor={fieldId("message")}
						className="block text-sm font-medium text-secondary"
					>
						Message <span className="text-red-700">*</span>
					</label>
					<textarea
						id={fieldId("message")}
						name="message"
						value={values.message}
						onChange={handleChange}
						placeholder="What are you building, and what's the deadline?"
						rows={9}
						disabled={loading}
						required
						aria-invalid={errors.message ? true : undefined}
						aria-describedby={describedBy("message")}
						className={`flex-1 py-3 resize-none ${inputClass("message")}`}
					/>
					<ErrorText field="message" />
				</div>
			</div>

			<div className="flex justify-center">
				<button
					type="submit"
					disabled={loading}
					className="bg-primary-accessible text-white px-8 py-3 rounded-2xl font-semibold hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
				>
					{loading ? "Sending…" : "Send message"}
				</button>
			</div>
		</form>
	);
};
