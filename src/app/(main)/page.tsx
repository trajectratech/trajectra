import { headers } from "next/headers";
import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import dynamic from "next/dynamic";

import { HeroSlider } from "@/components/hero-slider";
import { Navbar } from "@/navbar";
import homeContent from "@/contents/home.json";

// const HeroSlider = dynamic(
// 	() => import("@/components/hero-slider").then((mod) => mod.HeroSlider),
// 	{
// 		ssr: false,
// 	},
// );

const ContactUsFormWrapper = dynamic(
	() =>
		import("@/components/contact-us/wrapper").then(
			(mod) => mod.ContactUsFormWrapper,
		),
	{
		ssr: false,
	},
);

const Services = dynamic(
	() => import("@/components/services").then((mod) => mod.Services),
	{
		ssr: true,
	},
);

const AboutUsCards = dynamic(
	() => import("@/components/about-us").then((mod) => mod.AboutUsCards),
	{
		ssr: true,
	},
);

export async function generateMetadata() {
	const host = headers().get("host");
	const proto = headers().get("x-forwarded-proto") || "http";
	const baseUrl = `${proto}://${host}`;

	const services = [
		{
			"@type": "Service",
			name: "Custom Software Development",
			serviceType: "Software Development",
			description:
				"Our custom software development services provide tailored, scalable, and innovative software solutions designed to solve your unique business challenges. We specialize in building high-performance applications, enterprise software, and cloud-based solutions that boost efficiency and drive digital transformation.",
			provider: { "@type": "Organization", name: "Trajectra Technologies" },
			areaServed: "Worldwide",
			keywords:
				"custom software, software development, cloud solutions, enterprise software",
		},
		{
			"@type": "Service",
			name: "Expert Technical Training",
			serviceType: "Technical Education",
			description:
				"Boost your team's productivity with our expert technical training programs. We offer hands-on workshops and courses in software development, programming languages, system architecture, and emerging technologies to enhance your employees’ skills and keep your business competitive.",
			provider: { "@type": "Organization", name: "Trajectra Technologies" },
			areaServed: "Worldwide",
			keywords:
				"technical training, software workshops, programming courses, employee skill development",
		},
		{
			"@type": "Service",
			name: "Advisory Role",
			serviceType: "IT Consulting",
			description:
				"Gain strategic advantage with our technology advisory services. Our software consultants provide expert guidance on software project management, IT strategy, digital transformation, and technology investments to help you optimize resources, reduce risks, and accelerate business growth.",
			provider: { "@type": "Organization", name: "Trajectra Technologies" },
			areaServed: "Worldwide",
			keywords:
				"technology advisory, IT consulting, project management, digital transformation consulting",
		},
		{
			"@type": "Service",
			name: "Software Redesign & Maintenance",
			serviceType: "Software Maintenance",
			description:
				"Ensure your software stays reliable and up-to-date with our software redesign and maintenance services. We specialize in legacy system modernization, bug fixing, feature enhancements, and performance optimization to keep your applications secure, efficient, and aligned with evolving business goals.",
			provider: { "@type": "Organization", name: "Trajectra Technologies" },
			areaServed: "Worldwide",
			keywords:
				"software maintenance, legacy system modernization, bug fixing, feature enhancement",
		},
		{
			"@type": "Service",
			name: "Computer Networking & Design",
			serviceType: "Network Design",
			description:
				"Design and implement secure and scalable computer networking solutions customized for your organization. Our services include network architecture design, infrastructure optimization, network security, and connectivity solutions that enable seamless communication and data flow across your business.",
			provider: { "@type": "Organization", name: "Trajectra Technologies" },
			areaServed: "Worldwide",
			keywords:
				"network design, network security, infrastructure optimization, connectivity solutions",
		},
		{
			"@type": "Service",
			name: "Digital Transformation for Enterprises",
			serviceType: "Digital Transformation",
			description:
				"Empower your business to thrive in the digital age with our enterprise-grade digital transformation services. We help organizations modernize legacy systems, migrate to the cloud, automate workflows, and integrate cutting-edge technologies like AI and IoT. Our holistic approach includes strategic consulting, implementation, and training to drive innovation and long-term growth.",
			provider: { "@type": "Organization", name: "Trajectra Technologies" },
			areaServed: "Worldwide",
			keywords:
				"digital transformation, cloud migration, AI integration, enterprise modernization",
		},
	];

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				name: "Trajectra Technologies",
				url: baseUrl,
				logo: baseUrl + "/trajectra-full-dark.png",
				description:
					"Trajectra Technologies offers world-class custom software development, elite tech training, software consulting, digital transformation, cloud migration, network design, and ongoing software support worldwide.",
				contactPoint: {
					"@type": "ContactPoint",
					telephone: "+2347066120776",
					contactType: "Customer Support",
					availableLanguage: ["English"],
				},
				address: {
					"@type": "PostalAddress",
					streetAddress: "9b Ewusu Otaiku Street, Alapere",
					addressLocality: "Ketu",
					addressRegion: "Lagos",
					postalCode: "100244",
					addressCountry: "Nigeria",
				},
				sameAs: [
					"https://twitter.com/trajectra",
					"https://instagram.com/trajectra",
					"https://linkedin.com/company/trajectra",
					"https://web.facebook.com/people/Trajectra/61575689502633",
					"https://youtube.com/@trajectra",
				],
				image: baseUrl + "/trajectra-full-dark.png",
				makesOffer: services,
			},
			{
				"@type": "LocalBusiness",
				name: "Trajectra Technologies",
				image: baseUrl + "/trajectra-full-dark.png",
				telephone: "+2347066120776",
				address: {
					"@type": "PostalAddress",
					streetAddress: "9b Ewusu Otaiku Street, Alapere",
					addressLocality: "Ketu",
					addressRegion: "Lagos",
					postalCode: "100244",
					addressCountry: "Nigeria",
				},
				url: baseUrl,
				sameAs: [
					"https://twitter.com/trajectra",
					"https://instagram.com/trajectra",
					"https://linkedin.com/company/trajectra",
					"https://web.facebook.com/people/Trajectra/61575689502633",
					"https://youtube.com/@trajectra",
				],
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: "4.9",
					reviewCount: "25",
				},
				areaServed: "Worldwide",
			},
			{
				"@type": "VideoObject",
				name: "Trajectra Technologies Official YouTube Channel",
				description:
					"Videos about software development tutorials, tech training, digital transformation, and more by Trajectra Technologies.",
				thumbnailUrl: baseUrl + "/trajectra-full-dark.png",
				uploadDate: "2023-01-01T08:00:00+00:00",
				contentUrl: "https://www.youtube.com/@trajectra",
				// embedUrl: "https://www.youtube.com/embed/your-channel-video-id",
				embedUrl: "https://www.youtube.com/@trajectra",

				publisher: {
					"@type": "Organization",
					name: "Trajectra Technologies",
					logo: {
						"@type": "ImageObject",
						url: baseUrl + "/trajectra-full-dark.png",
					},
				},
			},
		],
	};

	const keywords = [
		"global software company",
		"custom software development worldwide",
		"international software consulting",
		"tech training online",
		"software development company",
		"cloud migration services global",
		"enterprise digital transformation",
		"software redesign and maintenance",
		"network design and security",
		"IT consulting worldwide",
		"software partner global",
		"tech upskilling online",
	].join(", ");

	return {
		title:
			"Global Custom Software, Digital Transformation & Tech Training | Trajectra Technologies",
		description:
			"Trajectra Technologies delivers scalable software, elite tech training, IT advisory, cloud solutions, digital transformation, and ongoing software maintenance worldwide.",
		keywords,
		openGraph: {
			title:
				"Global Custom Software, Digital Transformation & Tech Training | Trajectra",
			description:
				"Partner with Trajectra Technologies to develop custom software, train your tech teams, redesign legacy systems, and transform digitally worldwide.",
			url: baseUrl,
			siteName: "Trajectra Technologies",
			images: [
				{
					url: baseUrl + "/trajectra-full-dark.png",
					width: 1200,
					height: 630,
					alt: "Trajectra Technologies Logo",
				},
			],
			type: "website",
			locale: "en_US",
		},
		twitter: {
			card: "summary_large_image",
			site: "@trajectra",
			title:
				"Global Custom Software, Digital Transformation & Tech Training | Trajectra",
			description:
				"Build custom apps, train tech teams, and transform your business with Trajectra Technologies worldwide.",
			images: [baseUrl + "/trajectra-full-dark.png"],
		},
		robots: "index, follow",
		alternates: {
			canonical: baseUrl,
		},
		other: {
			"application/ld+json": JSON.stringify(jsonLd),
		},
	};
}

export default function Index() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />

			{/* HERO Section */}
			<section role="region" aria-label="Hero Section" className="relative">
				<HeroSlider />
				<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>
			</section>

			<section
				role="region"
				aria-label="Take Action"
				className="relative my-16 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden"
			>
				<div className="absolute inset-0 pointer-events-none">
					{/* Decorative Gradient Blobs */}
					<div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-200"></div>
				</div>

				<div className="relative flex flex-col items-center justify-center text-center text-secondary">
					<h1 className="text-[1.2rem] sm:text-5xl font-extrabold leading-tight mb-6 max-w-3xl">
						Custom Software, Training & Consulting for Growth
					</h1>

					<p className="text-lg sm:text-xl text-secondary/70 mb-8 max-w-2xl">
						Trajectra Technologies helps you scale through expertly built
						digital products and talent development tailored to your business.
					</p>

					<a
						target="_blank"
						href={homeContent.book}
						className="inline-block bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
					>
						Get a Free Consultation
					</a>
				</div>
			</section>

			{/* ABOUT Section */}
			<section
				id="about"
				role="region"
				aria-label="About Trajectra"
				className="relative py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url('/art-scene.jpg')",
				}}
			>
				<div className="absolute inset-0 bg-black bg-opacity-40"></div>
				<div className="relative max-w-7xl mx-auto z-10 text-white text-center">
					<h2 className="text-3xl sm:text-4xl font-bold mb-8">Who We Are</h2>
					<p className="max-w-2xl mx-auto mb-12 text-lg">
						We specialize in building scalable software solutions, empowering
						African tech talent, and offering expert IT consulting.
					</p>
					<AboutUsCards />
				</div>
			</section>

			{/* SERVICES Section */}
			<section
				id="services"
				role="region"
				aria-label="Our Services"
				className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary text-white"
			>
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl font-bold text-center mb-12 text-primary">
						Our Core Services
					</h2>
					<Services />
				</div>
			</section>

			{/* CONTACT Section */}
			<section
				id="contact"
				role="region"
				aria-label="Contact Trajectra"
				className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center px-4 sm:px-6">
						<h2 className="text-4xl sm:text-5xl font-extrabold text-secondary mb-4">
							Let’s Work Together
						</h2>
						<p className="text-lg sm:text-xl text-secondary/70 mb-10 max-w-2xl mx-auto leading-relaxed">
							Have a project in mind or want to learn more? Reach out and let’s
							build something amazing together.
						</p>
					</div>

					{/* Quick Contact Links */}
					<div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mb-12">
						<div className="flex justify-center md:justify-between flex-col md:flex-row gap-6">
							<a
								className="font-bold p-4 rounded flex flex-col items-center text-primary hover:bg-primary hover:text-white transition"
								href={`tel:${homeContent.phone}`}
								aria-label="Call us"
							>
								<FiPhone size={24} />
								<p>{homeContent.phone}</p>
							</a>
							<a
								className="font-bold p-4 rounded flex flex-col items-center text-primary hover:bg-primary hover:text-white transition"
								href={`mailto:${homeContent.email}`}
								aria-label="Email us"
							>
								<MdOutlineEmail size={24} />
								<p>{homeContent.email}</p>
							</a>
						</div>
					</div>

					{/* Contact Form */}
					<div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl">
						<h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
						<ContactUsFormWrapper />
					</div>
				</div>
			</section>
		</div>
	);
}
