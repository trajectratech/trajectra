import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy | Trajectra Technologies",
	description:
		"Read how Trajectra Technologies handles your data with care and transparency.",
};

export default function PrivacyPolicyPage() {
	return (
		<main className="min-h-screen bg-white text-gray-800 px-6 py-12 lg:px-32  mt-6">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

				<p className="mb-4">
					Effective Date: <strong>5/21/2025</strong>
				</p>

				<p className="mb-6">
					At <strong>Trajectra Technologies</strong>, we are committed to
					protecting your privacy. This policy outlines how we handle your
					personal information.
				</p>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						1. Information We Collect
					</h2>
					<ul className="list-disc list-inside space-y-2">
						<li>Account details (e.g., email, name, company name)</li>
						{/* <li>Device and usage data (e.g., IP address, browser type)</li> */}
						<li>Media input/output data required to render the service</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						2. How We Use Your Data
					</h2>
					<p>
						We use your information strictly to operate, maintain, and improve
						our services. We do
						<strong> not sell or share</strong> your data for marketing or
						profiling.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						3. Data Sharing and Disclosure
					</h2>
					<p>Your data is never sold. It may only be disclosed:</p>
					<ul className="list-disc list-inside mt-2 space-y-2">
						<li>To comply with legal obligations</li>
						<li>To protect the rights and safety of users</li>
						<li>If you give explicit consent</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						4. Data Storage and Security
					</h2>
					<p>
						We use industry-standard security practices to protect your data,
						including HTTPS, encryption where applicable, and strict access
						controls.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
					<p>
						You have the right to access, correct, or delete your data. You can
						make requests by contacting us at{" "}
						<a
							href="mailto:info@trajectra.com"
							className="text-blue-600 underline"
						>
							info@trajectra.com
						</a>
						.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">6. Cookies</h2>
					<p>
						We do not use third-party cookies. Any cookies we use are essential
						to service functionality.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						7. Third-Party Services
					</h2>
					<p>
						If we integrate with external services (e.g., payments), they are
						governed by their own privacy policies.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">8. Policy Updates</h2>
					<p>
						We may update this policy. When we do, we’ll post changes here.
						Continued use of our service means you accept the revised terms.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-3">9. Contact</h2>
					<p>
						If you have any questions about these Terms, please contact us at:
						<br />
						📧{" "}
						<a
							href="mailto:info@trajectra.com"
							className="text-blue-600 underline"
						>
							info@trajectra.com
						</a>
						<br />
						🏢 Trajectra Technologies
						<br />
						🌐{" "}
						<a
							href="https://trajectra.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline"
						>
							trajectra.com
						</a>
					</p>
				</section>
			</div>
		</main>
	);
}
