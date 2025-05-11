import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "Trajectra Technologies",
	description: `
          Trajectra Technologies is a forward-thinking software company specializing in custom software development, technical training, and IT consulting. We empower businesses and individuals to thrive in the digital era by delivering scalable solutions, modern technologies, and expert guidance tailored to your goals.
          Whether you're a startup in need of a product team, an enterprise modernizing its infrastructure, or a professional seeking to upskill, Trajectra provides the tools, talent, and training to move you forward — with precision and purpose.
          Driven by innovation. Powered by expertise. Your trajectory starts here.
           `,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased`}>{children}</body>
		</html>
	);
}
