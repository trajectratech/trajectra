import { headers } from "next/headers";
import Image from "next/image";

export async function generateMetadata() {
	const host = headers().get("host");
	const proto = headers().get("x-forwarded-proto") || "http";
	const baseUrl = `${proto}://${host}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Trajectra Technologies",
		url: baseUrl,
		logo: baseUrl + "/trajectra-full-dark.png",
		description:
			"Trajectra Technologies is a forward-thinking software company specializing in custom software development, technical training, and IT consulting. We empower businesses and individuals to thrive in the digital era by delivering scalable solutions, modern technologies, and expert guidance tailored to your goals. Whether you're a startup in need of a product team, an enterprise modernizing its infrastructure, or a professional seeking to upskill, Trajectra provides the tools, talent, and training to move you forward — with precision and purpose. Driven by innovation. Powered by expertise. Your trajectory starts here.",
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+2347066120776",
			contactType: "Customer Service",
			areaServed: "NG",
			availableLanguage: "English",
		},
		sameAs: [
			"https://twitter.com/trajectra",
			"https://instagram.com/trajectra",
			"https://linkedin.com/company/trajectra",
			"https://facebook.com/trajectra",
		],
		potentialAction: {
			"@type": "Action",
			name: "Contact Us",
			target: "mailto:info@trajectra.com",
		},
		image: baseUrl + "/trajectra-full-dark.png",
	};

	// Keywords related to software, training, consulting, etc.
	const keywords =
		"software development, custom software solutions, IT consulting, technical training, digital transformation, software training school, software consulting, IT education, tech training, software engineers, technology consultancy, Trajectra, trajectory, Trajectra Technologies, software training, tech talent, enterprise software, start-up software, modern technologies, software services, software development company, upskill in technology, career training in tech, project management software, cloud computing, software solutions, business software solutions, software company";

	return {
		title: "Trajectra Technologies - Coming Soon",
		description:
			"Trajectra Technologies is a forward-thinking software company specializing in custom software development, technical training, and IT consulting. We empower businesses and individuals to thrive in the digital era by delivering scalable solutions, modern technologies, and expert guidance tailored to your goals. Whether you're a startup in need of a product team, an enterprise modernizing its infrastructure, or a professional seeking to upskill, Trajectra provides the tools, talent, and training to move you forward — with precision and purpose. Driven by innovation. Powered by expertise. Your trajectory starts here.",
		keywords: keywords, // Adding the keywords field
		openGraph: {
			title: "Trajectra Technologies - Coming Soon",
			description:
				"Trajectra Technologies is a forward-thinking software company specializing in custom software development, technical training, and IT consulting.",
			url: baseUrl,
			siteName: "Trajectra Technologies",
			images: [
				{
					url: baseUrl + "/trajectra-full-dark.png",
					width: 200,
					height: 200,
					alt: "Trajectra Logo",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@trajectra",
			title: "Trajectra Technologies - Coming Soon",
			description:
				"Trajectra Technologies is a forward-thinking software company specializing in custom software development, technical training, and IT consulting.",
			images: [baseUrl + "/trajectra-full-dark.png"],
		},
		other: {
			"application/ld+json": JSON.stringify(jsonLd),
		},
		alternates: {
			canonical: baseUrl,
		},
		robots: "index, follow", // Allows indexing of the page
	};
}

export default function ComingSoon() {
	return (
		<main className="relative flex flex-col items-center justify-center h-screen px-4 text-center overflow-hidden bg-black">
			{/* Animated floating blob background */}
			<div className="absolute inset-0 overflow-hidden z-0">
				<div className="absolute w-[600px] h-[600px] bg-sea-green opacity-20 rounded-full filter blur-3xl animate-blob1" />
				<div className="absolute w-[500px] h-[500px] bg-sea-green opacity-20 rounded-full filter blur-2xl animate-blob2" />
				<div className="absolute w-[400px] h-[400px] bg-white opacity-10 rounded-full filter blur-3xl animate-blob3" />
			</div>

			{/* Main content */}
			<div className="relative z-10 flex flex-col items-center">
				{/* Logo - increase size */}
				<div className="mb-6">
					<Image
						src="/trajectra-full-dark.png"
						alt="Trajectra Logo"
						width={200}
						height={200}
						priority
					/>
				</div>

				<h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow">
					🚀 Coming Soon
				</h1>
				<p className="text-lg text-white/80 mb-6 max-w-xl">
					We&apos;re working hard to launch our site. Stay tuned and connect
					with us!
				</p>

				<div className="flex flex-wrap justify-center gap-4">
					<a
						href="mailto:info@trajectra.com"
						className="text-sea-green font-medium underline hover:text-white transition"
					>
						Contact
					</a>
					<a
						href="https://twitter.com/trajectra"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sea-green font-medium underline hover:text-white transition"
					>
						Twitter
					</a>
					<a
						href="https://instagram.com/trajectra"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sea-green font-medium underline hover:text-white transition"
					>
						Instagram
					</a>
					<a
						href="https://linkedin.com/company/trajectra"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sea-green font-medium underline hover:text-white transition"
					>
						LinkedIn
					</a>
					<a
						href="https://facebook.com/trajectra"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sea-green font-medium underline hover:text-white transition"
					>
						Facebook
					</a>
				</div>
			</div>
		</main>
	);
}
