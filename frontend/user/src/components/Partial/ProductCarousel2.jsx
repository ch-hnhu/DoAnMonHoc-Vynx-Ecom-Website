import { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getProductImage, getFinalPrice, hasDiscount } from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";
import ProductCarouselItem from "./ProductCarouselItem";

export default function ProductCarousel2({
	products = [],
	title,
	description = "",
	carouselId = "related",
	showCategory = true,
	showRating = true,
	showActions = true,
	showNewBadge = true,
	containerClass = "container-fluid related-product",
	maxWidth = 900,
}) {
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const { toast, showSuccess, showError, closeToast } = useToast();

	const carouselClass = `${carouselId}-carousel`;

	useEffect(() => {
		if (!products.length) {
			return;
		}

		const initFunc = window.initCarousels?.[carouselId];
		if (!initFunc) {
			return;
		}

		requestAnimationFrame(() => {
			setTimeout(() => {
				try {
					initFunc();
				} catch (error) {}
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
				<div className='container products-mini py-5'>
					{/* Section Header */}
					<div className='mx-auto text-center mb-5' style={{ maxWidth: `${maxWidth}px` }}>
						<h4
							className='text-primary border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp'
							data-wow-delay='0.1s'>
							{title}
						</h4>
						{description && (
							<h1
								className='mb-0 display-3 text-primary wow fadeInUp'
								data-wow-delay='0.3s'>
								{description}
							</h1>
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
