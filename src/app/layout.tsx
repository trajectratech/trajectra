import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";

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
	icons: [
		{
			rel: "icon",
			url: "/trajectra-closeup.svg",
		},
		{
			rel: "apple-touch-icon",
			url: "/apple-touch-icon.png",
			sizes: "180x180",
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased`}>
				{children}
				{/* ✅ Google Analytics Scripts */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-R4DRJDDZSD"
					strategy="afterInteractive"
				/>
				<Script id="ga4-init" strategy="afterInteractive">
					{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'G-R4DRJDDZSD', {
				page_path: window.location.pathname,
				});
          			`}
				</Script>
			</body>
		</html>
	);
}
