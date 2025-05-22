import React from "react";
import services from "@/contents/services.json";
import Image from "next/image";

export const Services = () => {
	const columns = 3;

	// Split services into rows based on columns count
	const rows = [];
	for (let i = 0; i < services.length; i += columns) {
		rows.push(services.slice(i, i + columns));
	}

	return (
		<div className="max-w-7xl mx-auto px-0 md:px-2 sm:px-4 lg:px-6">
			<div className="flex flex-col  rounded-md">
				{rows.map((row, rowIndex) => (
					<React.Fragment key={rowIndex}>
						{/* Row container with grid columns */}
						<div
							className={`grid grid-cols-1 md:grid-cols-${columns}  rounded-md`}
						>
							{row.map(({ heading, description, iconUrl }, colIndex) => (
								<div
									key={heading}
									className={`
                    flex items-start space-x-6
                    p-1
                    md:p-6
                    md:py-8 md:px-6
                    bg-transparent
                    ${
											colIndex !== row.length - 1
												? "md:border-r-4  md:border-primary md:rounded-r-lg"
												: ""
										}
                  `}
								>
									{/* Icon */}
									<div className="flex-shrink-0 w-14 h-14 text-indigo-600">
										<Image
											src={iconUrl}
											alt={heading}
											height={56}
											width={56}
											className="w-14 h-14"
											aria-hidden="true"
										/>
									</div>

									{/* Text content */}
									<div>
										<h3 className="text-lg md:text-xl font-semibold text-primary">
											{heading}
										</h3>
										<p className="mt-2 text-xs md:text-sm text-white">
											{description}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Horizontal divider between rows only (not top or bottom) */}
						{rowIndex !== rows.length - 1 && (
							<div className="hidden md:flex justify-center my-8">
								<hr className="w-[calc(100%-8rem)] border-t-4 border-primary rounded-full" />
							</div>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
