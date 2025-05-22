import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
	FaFacebookF,
	FaInstagram,
	FaTwitter,
	FaLinkedinIn,
	FaYoutube,
	FaTiktok,
} from "react-icons/fa";

import data from "@/contents/footer.json";

const FooterLinks = dynamic(
	() => import("./footer-links").then((mod) => mod.FooterLinks),
	{
		ssr: false,
	},
);

const socialIcons: Record<string, JSX.Element> = {
	facebook: <FaFacebookF className="w-4 h-4" />,
	instagram: <FaInstagram className="w-4 h-4" />,
	x: <FaTwitter className="w-4 h-4" />,
	linkedin: <FaLinkedinIn className="w-4 h-4" />,
	youtube: <FaYoutube className="w-4 h-4" />,
	tiktok: <FaTiktok className="w-4 h-4" />,
};

export const Footer = () => {
	return (
		<footer
			id="footer"
			className="bg-background-dark text-white px-6 md:px-16 py-12 space-y-8"
		>
			{/* Catchphrase and CTA */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<p className="text-xl font-semibold text-left w-full md:w-auto">
					{data.catchphrase}
				</p>
				<div className="flex gap-4 w-full md:w-auto justify-start md:justify-end">
					<Link
						target="_blank"
						href={data.book}
						className="inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium bg-primary shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:scale-95"
					>
						Let&apos;s talk
					</Link>
					<Link
						href="#contact"
						className="px-4 py-2 rounded-full font-semibold text-secondary bg-surface hover:opacity-90 transition"
					>
						Contact us
					</Link>
				</div>
			</div>

			<hr className="border-white/20" />

			<div className="flex justify-between gap-4 flex-col md:flex-row">
				{/* Logo and Description */}
				<div className="flex flex-1 flex-col md:flex-row md:items-start gap-6">
					<div className="flex flex-col flex-1 items-start">
						<Image
							src={data.logo.src}
							alt={data.logo.alt}
							width={140}
							height={40}
							priority
						/>
						{data.description && (
							<p className="mt-6 text-white/80 text-left w-full md:w-auto">
								{data.description}
							</p>
						)}
					</div>
				</div>

				<hr className=" block md:hidden border-white/20" />

				{/* Company Links + Social + Address */}
				<div className="flex flex-1 flex-col md:flex-row gap-10 md:gap-16">
					{/* Company Links */}
					<div className="flex-1">
						<h3 className="font-semibold text-white mb-4">Company</h3>
						<FooterLinks links={data.links} />
					</div>

					<hr className="border-white/20" />

					{/* Social Links + Address */}
					<div className="flex-1">
						<h3 className="font-semibold text-white mb-4">Follow Us</h3>
						<div className="flex flex-wrap gap-4 mb-4">
							{data.socialLinks.map((social) => (
								<Link
									key={social.id}
									href={social.url || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="rounded-full bg-primary text-secondary p-2 inline-flex items-center justify-center transition-transform duration-300 ease-in-out hover:text-white hover:scale-110"
								>
									{socialIcons[social.id]}
								</Link>
							))}
						</div>
						<p className="text-white/80">{data.companyAddress}</p>
						<p className="text-white/80">
							<a href={`mailto:${data.email}`} className="hover:underline">
								{data.email}
							</a>
						</p>
						<p className="text-white/80">
							<a href={`tel:${data.phone}`} className="hover:underline">
								{data.phone}
							</a>
						</p>
					</div>
				</div>
			</div>

			<hr className="border-white/20" />

			<div className="flex flex-col-reverse md:flex-row justify-between gap-4">
				{/* Copyright and Company Name */}
				<div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/60 gap-2">
					<p className="text-left w-full md:w-auto">
						© {new Date().getFullYear()} {data.compayName}
					</p>
				</div>

				{/* Policies and Terms */}
				<div className="flex gap-4 text-xs text-white/60">
					<Link
						href={data.policies.href}
						className="hover:text-white text-left md:text-right w-full md:w-auto"
						prefetch
					>
						{data.policies.label}
					</Link>
					<Link
						href={data.termsOfServices.href}
						className="hover:text-white text-left md:text-right w-full md:w-auto"
						prefetch
					>
						{data.termsOfServices.label}
					</Link>
				</div>
			</div>
		</footer>
	);
};
