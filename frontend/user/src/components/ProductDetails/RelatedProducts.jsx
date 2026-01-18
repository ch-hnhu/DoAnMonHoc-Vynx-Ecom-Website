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

export default function RelatedProducts({ products = [] }) {
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const { toast, showSuccess, closeToast } = useToast();

	useEffect(() => {
		if (window.initCarousels?.related) {
			window.initCarousels.related();
		}
	}, [products.length]);

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
			<div className='container-fluid related-product'>
				<div className='container'>
					<div className='mx-auto text-center pb-5' style={{ maxWidth: 700 }}>
						<h4
							className='text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp'
							data-wow-delay='0.1s'>
							Sản phẩm liên quan
						</h4>
						<p className='wow fadeInUp' data-wow-delay='0.2s'>
							Khám phá thêm sản phẩm cùng danh mục.
						</p>
					</div>
					<div className='related-carousel owl-carousel pt-4'>
						{products.map((product) => (
							<div key={product.id} className='related-item rounded'>
								<div className='related-item-inner border rounded'>
									<div className='related-item-inner-item'>
										<img
											src={getProductImage(product.image_url)}
											className='img-fluid w-100 rounded-top'
											alt={product.name}
											onError={(e) => {
												e.target.src = "https://placehold.co/400";
											}}
										/>
										{product.is_new && <div className='related-new'>New</div>}
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
									<div className='text-center rounded-bottom p-4'>
										<a href='#' className='d-block mb-2'>
										{product.category?.name || "Chưa phân loại"}
										</a>
										<a
											href='#'
											className='d-block h4'
											onClick={(e) => {
												e.preventDefault();
												handleViewDetails(product);
											}}>
											{product.name}
										</a>
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
								<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
									<a
										href='#'
										onClick={(e) => handleAddToCart(product, e)}
										className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
										<i className='fas fa-shopping-cart me-2'></i> Thêm vào giỏ
										hàng
									</a>
									<div className='d-flex justify-content-between align-items-center'>
										<div className='d-flex'>
											{renderRating(product.rating_average || 0)}
										</div>
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
						))}
					</div>
				</div>
			</div>
			<Snackbar
				open={toast.open}
				autoHideDuration={2500}
				onClose={closeToast}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
