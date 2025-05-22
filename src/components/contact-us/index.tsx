"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export const ContactUsForm = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const [errors, setErrors] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);

	const validate = () => {
		const newErrors: typeof errors = {
			name: "",
			email: "",
			phone: "",
			message: "",
		};
		let valid = true;

		if (!form.name.trim()) {
			newErrors.name = "Name is required";
			valid = false;
		}

		if (!form.email.trim()) {
			newErrors.email = "Email is required";
			valid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			newErrors.email = "Invalid email address";
			valid = false;
		}

		if (!form.phone.trim()) {
			newErrors.phone = "Phone number is required";
			valid = false;
		} else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) {
			newErrors.phone = "Invalid phone number";
			valid = false;
		}

		if (!form.message.trim()) {
			newErrors.message = "Message is required";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setForm({ ...form, [e.target.id]: e.target.value });
		setErrors({ ...errors, [e.target.id]: "" });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		setLoading(true);
		const toastId = toast.loading("Sending message...");

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@trajectra.com",
					subject: `Contact Form Message from ${form.name}`,
					text: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`,
					html: `
					<p><strong>Name:</strong> ${form.name}</p>
					<p><strong>Email:</strong> ${form.email}</p>
					<p><strong>Phone:</strong> ${form.phone}</p>
            		<p><strong>Message:</strong><br/>${form.message.replace(
									/\n/g,
									"<br/>",
								)}</p>
          `,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to send message");
			}

			toast.success("Message sent successfully!", { id: toastId });
			setForm({ name: "", email: "", phone: "", message: "" });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message || "An error occurred", { id: toastId });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col space-y-6"
			onSubmit={handleSubmit}
			noValidate
		>
			<div className="flex flex-col lg:flex-row gap-6 mb-4">
				<div className="flex flex-col space-y-4 flex-1">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Enter your name"
							disabled={loading}
							className={`mt-1 block w-full h-12 rounded-2xl px-4 border ${
								errors.name ? "border-red-500" : "border-background-semi-grey"
							} bg-background-semi-grey shadow-sm focus:border-primary focus:ring-primary placeholder:text-sm placeholder:text-gray-500`}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1">{errors.name}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							value={form.email}
							onChange={handleChange}
							placeholder="Enter your email"
							disabled={loading}
							className={`mt-1 block w-full h-12 rounded-2xl px-4 border ${
								errors.email ? "border-red-500" : "border-background-semi-grey"
							} bg-background-semi-grey shadow-sm focus:border-primary focus:ring-primary placeholder:text-sm placeholder:text-gray-500`}
						/>
						{errors.email && (
							<p className="text-red-500 text-xs mt-1">{errors.email}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700"
						>
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							value={form.phone}
							onChange={handleChange}
							placeholder="Enter your phone number"
							disabled={loading}
							className={`mt-1 block w-full h-12 rounded-2xl px-4 border ${
								errors.phone ? "border-red-500" : "border-background-semi-grey"
							} bg-background-semi-grey shadow-sm focus:border-primary focus:ring-primary placeholder:text-sm placeholder:text-gray-500`}
						/>
						{errors.phone && (
							<p className="text-red-500 text-xs mt-1">{errors.phone}</p>
						)}
					</div>
				</div>

				<div className="flex-1">
					<label
						htmlFor="message"
						className="block text-sm font-medium text-gray-700"
					>
						Message
					</label>
					<textarea
						id="message"
						value={form.message}
						onChange={handleChange}
						placeholder="Type Message"
						rows={9}
						disabled={loading}
						className={`mt-1 block w-full h-full rounded-2xl px-4 py-3 border ${
							errors.message ? "border-red-500" : "border-background-semi-grey"
						} bg-background-semi-grey shadow-sm resize-none focus:border-primary focus:ring-primary placeholder:text-sm placeholder:text-gray-500`}
					/>
					{errors.message && (
						<p className="text-red-500 text-xs mt-1">{errors.message}</p>
					)}
				</div>
			</div>

			<div className="flex justify-center my-2">
				<button
					type="submit"
					disabled={loading}
					className="bg-primary text-white px-6 py-2 rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? "Processing..." : "Send Message"}
				</button>
			</div>
		</form>
	);
};
