import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";
import ProductCarouselItem from "./ProductCarouselItem";
import { Snackbar, Alert } from "@mui/material";

export default function ProductCarousel({
	products = [],
	title,
	description = "",
	carouselId = "related",
	showCategory = true,
	showRating = true,
	showActions = true,
	showNewBadge = true,
	containerClass = "container-fluid related-product",
}) {
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const { toast, showSuccess, showError, closeToast } = useToast();

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
		const added = addToCart(product, 1);
		if (!added) {
			showError("Vui lòng đăng nhập để thêm vào giỏ hàng");
			navigate("/dang-nhap");
			return;
		}
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
							<ProductCarouselItem
								key={product.id}
								product={product}
								onViewDetails={handleViewDetails}
								onAddToCart={handleAddToCart}
								showSuccess={showSuccess}
								showError={showError}
								showCategory={showCategory}
								showRating={showRating}
								showActions={showActions}
								showNewBadge={showNewBadge}
							/>
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
