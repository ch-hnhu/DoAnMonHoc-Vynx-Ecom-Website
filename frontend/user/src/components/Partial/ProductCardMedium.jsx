import { getProductImage, getFinalPrice } from "@shared/utils/productHelper.jsx";
import { Link } from "react-router-dom";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { useWishList } from "../../hooks/useWishList";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";

export default function ProductCardMedium({ product, onAddToCart, onViewDetails }) {
	const { toast, showSuccess, showError, closeToast } = useToast();
	const { isInWishlist, isLoggedIn, handleToggleWishlist } = useWishList(
		product?.id,
		showSuccess,
		showError,
	);
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
								<Link to={`/${product.slug}`} onClick={handleViewDetails}>
									<i className='fa fa-eye fa-1x text-white'></i>
								</Link>
							</div>
						</div>
					</div>
					<div className='col-7'>
						<div className='products-mini-content p-3'>
							<Link to={`/${product.slug}`} className='d-block mb-2'>
								{product.category?.name || "Uncategorized"}
							</Link>
							<Link to={`/${product.slug}`} className='d-block h4' onClick={handleViewDetails}>
								{product.name}
							</Link>
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
				</div>
			</div>

			{/* Toast notification */}
			<Snackbar
				open={toast.open}
				autoHideDuration={2500}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
