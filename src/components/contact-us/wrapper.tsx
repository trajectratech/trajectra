"use client";

import { Toaster } from "react-hot-toast";

import { ContactUsForm } from ".";

export const ContactUsFormWrapper = () => {
	return (
		<>
			<Toaster position="top-right" />
			<ContactUsForm />
		</>
	);
};
