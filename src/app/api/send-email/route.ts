// app/api/send-email/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { to, subject, text, html } = body;

		if (!to || !subject || (!text && !html)) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Create reusable transporter object using Zoho SMTP
		const transporter = nodemailer.createTransport({
			host: "smtp.zoho.com",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.ZOHO_EMAIL,
				pass: process.env.ZOHO_APP_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: `"Trajectra Technologies" <${process.env.ZOHO_EMAIL}>`,
			to,
			subject,
			text,
			html,
		});

		return NextResponse.json(
			{ message: "Email sent successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error sending email:", error);
		return NextResponse.json(
			{ error: "Failed to send email" },
			{ status: 500 },
		);
	}
}
