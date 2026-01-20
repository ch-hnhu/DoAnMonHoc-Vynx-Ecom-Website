import { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	getProductImage,
	getFinalPrice,
	hasDiscount,
} from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";

export default function ProductCarousel({ 
	products = [],
	title,
	description = "",
	carouselId = "related",
	showCategory = true,
	showRating = true,
	showActions = true,
	showNewBadge = true,
	containerClass = "container-fluid related-product"
}) {
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const { toast, showSuccess, closeToast } = useToast();
	
	const carouselClass = `${carouselId}-carousel`;

	useEffect(() => {
		if (!products.length) return;

		const initFunc = window.initCarousels?.[carouselId];
		if (!initFunc) return;

		// Đợi React render + CSS + layout xong
		requestAnimationFrame(() => {
			setTimeout(() => {
				initFunc();
			}, 120);
		});
	}, [products, carouselId]);

	const handleViewDetails = (product) => {
		if (product?.slug) {
			navigate(`/${product.slug}`);
		}
	};

	const handleAddToCart = (product, event) => {
		if (event) event.preventDefault();
		addToCart(product, 1);
		showSuccess("Đã thêm vào giỏ hàng");
	};

	if (!products.length) {
		return null;
	}

	return (
		<>
			<div className={containerClass}>
				<div className='container'>
					{/* Section Header */}
					<div className='mx-auto text-center pb-5' style={{ maxWidth: 700 }}>
						<h4
							className='text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp'
							data-wow-delay='0.1s'>
							{title}
						</h4>
						{description && (
							<p className='wow fadeInUp' data-wow-delay='0.2s'>
								{description}
							</p>
						)}
					</div>

					{/* Carousel */}
					<div className={`${carouselClass} owl-carousel pt-4`}>
						{products.map((product) => (
							<div key={product.id} className='related-item rounded'>
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
										{showNewBadge && product.is_new && (
											<div className='related-new'>New</div>
										)}
										<div className='related-details'>
											<a
												href='#'
												onClick={(e) => {
													e.preventDefault();
													handleViewDetails(product);
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
												handleViewDetails(product);
											}}>
											{product.name}
										</a>

										{/* Price */}
										{hasDiscount(product) ? (
											<>
												<del className='me-2 fs-5'>
													{formatCurrency(product.price)}
												</del>
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

								{/* Actions */}
								<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
									<a
										href='#'
										onClick={(e) => handleAddToCart(product, e)}
										className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
										<i className='fas fa-shopping-cart me-2'></i> Thêm vào giỏ
										hàng
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
											)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Toast Notification */}
			<Snackbar
				open={toast.open}
				autoHideDuration={2500}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
