import { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

const TITLE = "Terms of Service";
const DESCRIPTION =
	"The terms that govern your use of Trajectra's website and services.";
const PATH = "/terms-of-service";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
};

export default function TermsOfServicePage() {
	return (
		<main className="min-h-screen bg-white text-gray-800 px-6 py-24 lg:px-32 mt-6">
			<JsonLd
				data={webPageSchema({
					name: TITLE,
					description: DESCRIPTION,
					path: PATH,
				})}
			/>
			<JsonLd data={breadcrumbSchema([{ name: TITLE, path: PATH }])} />
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-6 text-center">
					Terms of Service
				</h1>

				<p className="mb-4">
					Effective Date: <strong>5/21/2025</strong>
				</p>

				<p className="mb-6">
					Welcome to <strong>Trajectra Technologies</strong>. By accessing or
					using our services, you agree to comply with and be bound by these
					Terms of Service.
				</p>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">1. Use of Service</h2>
					<p>
						You may use our services only for lawful purposes and in accordance
						with these Terms. You agree not to misuse the service or interfere
						with its normal operation.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						2. User Responsibilities
					</h2>
					<p>
						You are responsible for maintaining the confidentiality of your
						account credentials and for all activities under your account.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">3. Data and Privacy</h2>
					<p>
						We handle your data only to facilitate the services provided. Please
						see our
						<a href="/privacy-policy" className="text-blue-600 underline ml-1">
							Privacy Policy
						</a>{" "}
						for details.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						4. Intellectual Property
					</h2>
					<p>
						All content, features, and functionality provided by Trajectra
						Technologies, including but not limited to text, graphics, logos,
						and software, are our exclusive property or licensed to us.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">5. Termination</h2>
					<p>
						We reserve the right to suspend or terminate your access to the
						service at any time, without notice, for conduct that we believe
						violates these Terms or is harmful to other users.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						6. Disclaimer of Warranties
					</h2>
					<p>
						Our service is provided &quot;as is&quot; without warranties of any
						kind, either express or implied. We do not guarantee the service
						will be uninterrupted or error-free.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">
						7. Limitation of Liability
					</h2>
					<p>
						To the fullest extent permitted by law, Trajectra Technologies will
						not be liable for any damages arising out of your use or inability
						to use the service.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
					<p>
						We may update these Terms from time to time. We will notify you by
						posting the new Terms on this page. Continued use of the service
						after changes indicates your acceptance.
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
							href="https://wwww.trajectra.com"
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
