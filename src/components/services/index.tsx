import Image from "next/image";

import services from "@/contents/services.json";

/**
 * The previous implementation chunked the services into rows of three and drew
 * borders and <hr> separators between them by index. That reimplemented what
 * `gap` and `divide-*` do natively, and — more importantly — built its column
 * class as `` `md:grid-cols-${columns}` ``. Tailwind resolves classes by
 * scanning source text, so that string never produced a rule; the layout only
 * worked because an unrelated component elsewhere happened to use the literal
 * `md:grid-cols-3`. A single flat grid removes the row bookkeeping and the
 * hidden coupling.
 */
export const Services = () => {
	return (
		<ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
			{services.map(({ heading, description, iconUrl }) => (
				<li key={heading} className="flex items-start gap-5">
					<Image
						src={iconUrl}
						// Decorative — the heading immediately beside it carries the
						// meaning. It previously had both a real `alt` and
						// `aria-hidden`, which contradict each other.
						alt=""
						aria-hidden="true"
						height={56}
						width={56}
						className="flex-shrink-0 w-14 h-14"
					/>

					<div>
						<h3 className="text-lg md:text-xl font-semibold text-primary">
							{heading}
						</h3>
						<p className="mt-2 text-sm text-white/80 leading-relaxed">
							{description}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
};
