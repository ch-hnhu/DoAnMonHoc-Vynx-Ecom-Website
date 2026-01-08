import { useEffect, useState } from "react";

export default function Spinner() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Ẩn spinner sau khi component mount
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	if (!isLoading) return null;

	return (
		<>
			{/* Spinner Start */}
			<div
				id='spinner'
				className='show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center'
				style={{ zIndex: 9999 }}>
				<div
					className='spinner-border text-primary'
					style={{ width: "3rem", height: "3rem" }}
					role='status'>
					<span className='sr-only'>Loading...</span>
				</div>
			</div>
			{/* Spinner End */}
		</>
	);
}
