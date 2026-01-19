import { Link } from "react-router-dom";
import { getProductImage, getFinalPrice, hasDiscount } from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";

export default function ProductCardGrid({ product, onAddToCart, onViewDetails }) {
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
		<div className='col-md-6 col-lg-4 col-xl-3'>
			<div className='product-item rounded wow fadeInUp' data-wow-delay='0.1s'>
				<div className='product-item-inner border rounded'>
					<div className='product-item-inner-item'>
						<img
							src={getProductImage(product.image_url)}
							className='img-fluid w-100 rounded-top'
							alt={product.name}
							onError={(e) => {
								e.target.src = "https://placehold.co/400";
							}}
						/>
						{product.is_new && <div className='product-new'>New</div>}
						<div className='product-details'>
							<Link to={`/${product.slug}`} onClick={handleViewDetails}>
								<i className='fa fa-eye fa-1x'></i>
							</Link>
						</div>
					</div>
					<div className='text-center rounded-bottom p-4'>
						<a href='#' className='d-block mb-2'>
							{product.category?.name || "Uncategorized"}
						</a>
						<a href='#' className='d-block h4' onClick={handleViewDetails}>
							{product.name}
						</a>
						{hasDiscount(product) ? (
							<>
								<del className='me-2 fs-5'>{formatCurrency(product.price)}</del>
								<span className='text-primary fs-5'>
									{formatCurrency(getFinalPrice(product))}
								</span>
							</>
						) : (
							<span className='text-primary fs-5'>
								{formatCurrency(product.price)}
							</span>
						)}
					</div>
				</div>
				<div className='product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
					<a
						href='#'
						onClick={handleAddToCart}
						className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
						<i className='fas fa-shopping-cart me-2'></i> Add To Cart
					</a>
					<div className='d-flex justify-content-between align-items-center'>
						<div className='d-flex'>{renderRating(product.rating_average || 0)}</div>
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
		</div>
	);
}
