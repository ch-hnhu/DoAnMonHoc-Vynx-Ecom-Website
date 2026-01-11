export default function Pagination({ currentPage = 1, lastPage = 1, onPageChange }) {
	if (lastPage <= 1) return null;

	const handlePageClick = (e, page) => {
		e.preventDefault();
		if (page >= 1 && page <= lastPage && page !== currentPage) {
			onPageChange(page);
		}
	};

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;

		if (lastPage <= maxVisible) {
			// Show all pages if total is less than max visible
			for (let i = 1; i <= lastPage; i++) {
				pages.push(i);
			}
		} else {
			// Show pages around current page
			let start = Math.max(1, currentPage - 2);
			let end = Math.min(lastPage, currentPage + 2);

			// Adjust if at the beginning or end
			if (currentPage <= 3) {
				end = maxVisible;
			} else if (currentPage >= lastPage - 2) {
				start = lastPage - maxVisible + 1;
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className='col-12 wow fadeInUp' data-wow-delay='0.1s'>
			<div className='pagination d-flex justify-content-center mt-5'>
				{/* Previous button */}
				<a
					href='#'
					className={`rounded ${currentPage === 1 ? "disabled" : ""}`}
					onClick={(e) => handlePageClick(e, currentPage - 1)}
					style={{
						pointerEvents: currentPage === 1 ? "none" : "auto",
						opacity: currentPage === 1 ? 0.5 : 1,
					}}>
					&laquo;
				</a>

				{/* Page numbers */}
				{pageNumbers.map((page) => (
					<a
						key={page}
						href={`/products?page=${page}`}
						className={`rounded ${page === currentPage ? "active" : ""}`}
						onClick={(e) => handlePageClick(e, page)}>
						{page}
					</a>
				))}

				{/* Next button */}
				<a
					href='#'
					className={`rounded ${currentPage === lastPage ? "disabled" : ""}`}
					onClick={(e) => handlePageClick(e, currentPage + 1)}
					style={{
						pointerEvents: currentPage === lastPage ? "none" : "auto",
						opacity: currentPage === lastPage ? 0.5 : 1,
					}}>
					&raquo;
				</a>
			</div>
		</div>
	);
}
