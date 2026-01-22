import { useWishList } from "../../hooks/useWishList";
import { getProductImage, getFinalPrice, hasDiscount } from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";

export default function ProductCarouselItem({
	product,
	onViewDetails,
	onAddToCart,
	showSuccess,
	showError,
	showCategory = true,
	showRating = true,
	showActions = true,
	showNewBadge = true,
}) {
	const { isInWishlist, isLoggedIn, handleToggleWishlist } = useWishList(
		product?.id,
		showSuccess,
		showError,
	);

	return (
		<div className='related-item rounded'>
			<div className='related-item-inner border rounded'>
				{/* Product Image */}
				<div className='related-item-inner-item'>
					<img
						src={getProductImage(product.image_url)}
						className='img-fluid w-100 rounded-top'
						alt={product.name}
						onError={(e) => {
							e.target.src = "https://placehold.co/400";
						}}
					/>
					{showNewBadge && product.is_new && <div className='related-new'>New</div>}
					<div className='related-details'>
						<a
							href={`/${product.slug}`}
							onClick={(e) => {
								e.preventDefault();
								onViewDetails?.(product);
							}}>
							<i className='fa fa-eye fa-1x'></i>
						</a>
					</div>
				</div>

				{/* Product Info */}
				<div className='text-center rounded-bottom p-4'>
					{showCategory && (
						<a href='#' className='d-block mb-2'>
							{product.category?.name || "Chưa phân loại"}
						</a>
					)}
					<a
						href='#'
						className='d-block h4'
						onClick={(e) => {
							e.preventDefault();
							onViewDetails?.(product);
						}}>
						{product.name}
					</a>

					{/* Price */}
					{hasDiscount(product) ? (
						<>
							<del className='me-2 fs-5'>{formatCurrency(product.price)}</del>
							<span className='text-primary fs-5'>
								{formatCurrency(getFinalPrice(product))}
							</span>
						</>
					) : (
						<span className='text-primary fs-5'>{formatCurrency(product.price)}</span>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
				<a
					href='#'
					onClick={(e) => {
						e.preventDefault();
						onAddToCart?.(product, e);
					}}
					className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
					<i className='fas fa-shopping-cart me-2'></i> Thêm vào giỏ hàng
				</a>

				{(showRating || showActions) && (
					<div className='d-flex justify-content-between align-items-center'>
						{showRating && (
							<div className='d-flex'>
								{renderRating(product.rating_average || 0)}
							</div>
						)}
						{showActions && (
							<div className='d-flex'>
								{isLoggedIn && (
									<a
										href='#'
										onClick={handleToggleWishlist}
										className='text-primary d-flex align-items-center justify-content-center me-0'>
										<span className='rounded-circle btn-sm-square border'>
											<i
												className={
													isInWishlist ? "fas fa-heart" : "far fa-heart"
												}></i>
										</span>
									</a>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
