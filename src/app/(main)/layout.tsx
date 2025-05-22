import dynamic from "next/dynamic";
import { headers } from "next/headers";

const Navbar = dynamic(() => import("@/navbar").then((mod) => mod.Navbar), {
	ssr: false,
});

const Footer = dynamic(() => import("@/footer").then((mod) => mod.Footer), {
	ssr: true,
});

const ScrollToTopButton = dynamic(
	() => import("@/scroll-to-top").then((mod) => mod.ScrollToTopButton),
	{
		ssr: false,
	},
);

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = headers();

	const pathname = headersList.get("x-current-path");

	return (
		<>
			<Navbar />
			{children}
			<Footer pathname={pathname} />
			<ScrollToTopButton />
		</>
	);
}
