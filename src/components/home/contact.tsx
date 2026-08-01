import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";

import { ContactUsFormWrapper } from "@/components/contact-us/wrapper";
import { Section, SectionHeading } from "@/components/ui";
import { CONTACT, SITE_NAME } from "@/lib/site";

/**
 * The form is the secondary path — booking a call is primary. A form promises
 * a wait; a calendar promises a time. It stays for people who would rather
 * write than book, which is a real preference and not a small one.
 */
export function Contact() {
	return (
		<Section id="contact" surface="light" labelledBy="contact-heading">
			<div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
				<div>
					<SectionHeading
						id="contact-heading"
						eyebrow="Get in touch"
						title="Prefer to write?"
						lede="Tell us what you're building and we'll come back within one business day."
					/>

					<ul className="mt-10 space-y-4">
						<li>
							<a
								href={`mailto:${CONTACT.email}`}
								className="group flex items-center gap-3 text-body font-medium text-neutral-700 hover:text-brand-strong"
							>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-brand-strong transition group-hover:bg-brand-strong group-hover:text-white">
									<MdOutlineEmail size={18} aria-hidden="true" />
								</span>
								<span>
									<span className="sr-only">Email {SITE_NAME} at </span>
									{CONTACT.email}
								</span>
							</a>
						</li>
						<li>
							<a
								href={`tel:${CONTACT.phone}`}
								className="group flex items-center gap-3 text-body font-medium text-neutral-700 hover:text-brand-strong"
							>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-brand-strong transition group-hover:bg-brand-strong group-hover:text-white">
									<FiPhone size={18} aria-hidden="true" />
								</span>
								<span>
									<span className="sr-only">Call {SITE_NAME} on </span>
									{CONTACT.phoneDisplay}
								</span>
							</a>
						</li>
					</ul>

					<p className="mt-8 max-w-prose text-small text-neutral-500">
						We work West Africa Time (UTC+1). Messages sent during European
						business hours are usually answered the same day.
					</p>
				</div>

				<div className="rounded-card border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
					<ContactUsFormWrapper />
				</div>
			</div>
		</Section>
	);
}
