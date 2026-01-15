import { getProductImage, getFinalPrice } from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";

export default function ProductCardMedium({ product, onAddToCart, onViewDetails }) {
	const handleAddToCart = (e) => {
		e.preventDefault();
		if (onAddToCart) {
			onAddToCart(product);
		}
	};

	const handleViewDetails = (e) => {
		e.preventDefault();
		if (onViewDetails) {
			onViewDetails(product);
		}
	};
	return (
		<div className='col-lg-6'>
			<div className='products-mini-item border'>
				<div className='row g-0'>
					<div className='col-5'>
						<div className='products-mini-img border-end h-100'>
							<img
								src={getProductImage(product.image_url)}
								className='img-fluid w-100 h-100'
								alt={product.name}
								onError={(e) => {
									e.target.src = "https://placehold.co/400";
								}}
							/>
							<div className='products-mini-icon rounded-circle bg-primary'>
								<a href='#' onClick={handleViewDetails}>
									<i className='fa fa-eye fa-1x text-white'></i>
								</a>
							</div>
						</div>
					</div>
					<div className='col-7'>
						<div className='products-mini-content p-3'>
							<a href='#' className='d-block mb-2'>
								{product.category?.name || "Uncategorized"}
							</a>
							<a href='#' className='d-block h4'>
								{product.name}
							</a>
							<del className='me-2 fs-5'>{formatCurrency(product.price)}</del>
							<span className='text-primary fs-5'>
								{formatCurrency(getFinalPrice(product))}
							</span>
						</div>
					</div>
				</div>

				<div className='products-mini-add border p-3'>
					<a
						href='#'
						className='btn btn-primary border-secondary rounded-pill py-2 px-4'
						onClick={handleAddToCart}>
						<i className='fas fa-shopping-cart me-2'></i> Add To Cart
					</a>
					<div className='d-flex'>
						<a
							href='#'
							className='text-primary d-flex align-items-center justify-content-center me-3'>
							<span className='rounded-circle btn-sm-square border'>
								<i className='fas fa-random'></i>
							</span>
						</a>
						<a
							href='#'
							className='text-primary d-flex align-items-center justify-content-center me-0'>
							<span className='rounded-circle btn-sm-square border'>
								<i className='fas fa-heart'></i>
							</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
