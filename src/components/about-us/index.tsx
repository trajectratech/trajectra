import Image from "next/image";
import aboutData from "@/contents/about.-us.json";

export const AboutUsCards = () => {
	return (
		<section
			aria-labelledby="mission-section"
			className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-12"
		>
			{/* <h2
				id="mission-section"
				className="text-3xl font-bold text-center mb-10 text-primary"
			>
				Who We Are
			</h2> */}

			<div className="grid gap-8 md:grid-cols-3">
				{aboutData.map(({ heading, description, photoUrl }) => (
					<article
						key={heading}
						className="
                        max-w-sm w-full mx-auto 
                        group flex flex-col bg-white rounded-2xl overflow-hidden 
                        shadow transition-shadow hover:shadow-lg hover:scale-[1.02]
                        focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary
                    "
						tabIndex={0}
						aria-labelledby={`card-${heading.toLowerCase()}`}
					>
						{/* Image */}
						<div className="relative w-full h-36">
							<Image
								src={photoUrl}
								alt={`${heading} illustration`}
								fill
								className="object-cover"
								sizes="100vw"
								priority
							/>
						</div>

						{/* Text Content */}
						<div className="p-6 flex flex-col justify-center text-left">
							<h3
								id={`card-${heading.toLowerCase()}`}
								className="text-xl font-semibold text-secondary mb-2"
							>
								{heading}
							</h3>
							<p className="text-semi-mid text-sm leading-relaxed">
								{description}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};
