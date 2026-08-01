import Image from "next/image";

import aboutData from "@/contents/about.-us.json";

export const AboutUsCards = () => {
	return (
		// Was a nested <section> with its own aria-labelledby pointing at a
		// commented-out heading, i.e. an accessible name referencing an id that
		// does not exist. The parent section already provides the landmark and
		// the "Who We Are" heading, so this is just a list.
		<ul className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-3">
			{aboutData.map(({ heading, description, photoUrl }) => (
				<li
					key={heading}
					className="max-w-sm w-full mx-auto flex flex-col bg-white rounded-2xl overflow-hidden shadow transition-shadow hover:shadow-lg"
					// The card was `tabIndex={0}`, making every non-interactive card a
					// tab stop. WCAG 2.4.3: only operable elements belong in the tab
					// order, and there is nothing to operate here.
				>
					<div className="relative w-full h-36">
						<Image
							src={photoUrl}
							alt=""
							aria-hidden="true"
							fill
							className="object-cover"
							// Was `sizes="100vw"` with `priority` on all three. These sit
							// well below the fold, so priority made them compete with the
							// hero for bandwidth and delayed LCP; and at three columns
							// inside a max-w-7xl grid they are never viewport-wide.
							sizes="(min-width: 768px) 24rem, 100vw"
						/>
					</div>

					<div className="p-6 flex flex-col justify-center text-left">
						<h3 className="text-xl font-semibold text-secondary mb-2">
							{heading}
						</h3>
						<p className="text-semi-mid text-sm leading-relaxed">
							{description}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
};
