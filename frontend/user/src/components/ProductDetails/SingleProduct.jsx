import { useEffect, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import {
	getAllProductImages,
	getFinalPrice,
	hasDiscount,
	isInStock,
} from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";

export default function SingleProduct({ product }) {
	const { addToCart } = useCart();
	const { toast, showSuccess, closeToast } = useToast();
	const [quantity, setQuantity] = useState(1);
	const images = useMemo(
		() => getAllProductImages(product?.image_url),
		[product?.image_url]
	);

	useEffect(() => {
		if (window.initCarousels?.single) {
			window.initCarousels.single();
		}
	}, [images.length]);

	const handleDecrease = () => {
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	const handleIncrease = () => {
		setQuantity((prev) => prev + 1);
	};

	const handleAddToCart = (e) => {
		e.preventDefault();
		if (isInStock(product)) {
			addToCart(product, quantity);
			showSuccess("Đã thêm vào giỏ hàng");
		}
	};

	return (
		<>
			<div className='container-fluid shop py-5'>
				<div className='container py-5'>
					<div className='row g-4'>
						<div className='col-lg-5 col-xl-3 wow fadeInUp' data-wow-delay='0.1s'>
							<div className='input-group w-100 mx-auto d-flex mb-4'>
								<input
									type='search'
									className='form-control p-3'
									placeholder='Từ khóa'
									aria-describedby='search-icon-1'
								/>
								<span id='search-icon-1' className='input-group-text p-3'>
									<i className='fa fa-search'></i>
								</span>
							</div>
							<div className='product-categories mb-4'>
								<h4>Danh mục sản phẩm</h4>
								<ul className='list-unstyled'>
									<li>
										<div className='categories-item'>
											<a href='#' className='text-dark'>
												<i className='fas fa-apple-alt text-secondary me-2'></i>
												Phụ kiện
											</a>
											<span>(3)</span>
										</div>
									</li>
									<li>
										<div className='categories-item'>
											<a href='#' className='text-dark'>
												<i className='fas fa-apple-alt text-secondary me-2'></i>
												Đồ điện tử 
											</a>
											<span>(5)</span>
										</div>
									</li>
									<li>
										<div className='categories-item'>
											<a href='#' className='text-dark'>
												<i className='fas fa-apple-alt text-secondary me-2'></i>
												Laptop & Máy tính để bàn
											</a>
											<span>(2)</span>
										</div>
									</li>
									<li>
										<div className='categories-item'>
											<a href='#' className='text-dark'>
												<i className='fas fa-apple-alt text-secondary me-2'></i>
												Điện thoại & Máy tính bảng
											</a>
											<span>(8)</span>
										</div>
									</li>
									<li>
										<div className='categories-item'>
											<a href='#' className='text-dark'>
												<i className='fas fa-apple-alt text-secondary me-2'></i>
												Smart TV
											</a>
											<span>(5)</span>
										</div>
									</li>
								</ul>
							</div>
							<div className='additional-product mb-4'>
								<h4>Lọc theo màu</h4>
								<div className='additional-product-item'>
									<input
										type='radio'
										className='me-2'
										id='Categories-1'
										name='Categories-1'
										value='Beverages'
									/>
									<label htmlFor='Categories-1' className='text-dark'>
										{" "}
										Vàng
									</label>
								</div>
								<div className='additional-product-item'>
									<input
										type='radio'
										className='me-2'
										id='Categories-2'
										name='Categories-1'
										value='Beverages'
									/>
									<label htmlFor='Categories-2' className='text-dark'>
										{" "}
										Xanh lá
									</label>
								</div>
								<div className='additional-product-item'>
									<input
										type='radio'
										className='me-2'
										id='Categories-3'
										name='Categories-1'
										value='Beverages'
									/>
									<label htmlFor='Categories-3' className='text-dark'>
										{" "}
										Trắng
									</label>
								</div>
							</div>
							<div className='featured-product mb-4'>
								<h4 className='mb-3'>Sản phẩm nổi bật</h4>
								<div className='featured-product-item'>
									<div
										className='rounded me-4'
										style={{ width: "100px", height: "100px" }}>
										<img
											src='/img/product-3.png'
											className='img-fluid rounded'
											alt='Image'
										/>
									</div>
									<div>
										<h6 className='mb-2'>SmartPhone</h6>
										<div className='d-flex mb-2'>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star'></i>
										</div>
										<div className='d-flex mb-2'>
											<h5 className='fw-bold me-2'>2.99 $</h5>
											<h5 className='text-danger text-decoration-line-through'>
												4.11 $
											</h5>
										</div>
									</div>
								</div>
								<div className='featured-product-item'>
									<div
										className='rounded me-4'
										style={{ width: "100px", height: "100px" }}>
										<img
											src='/img/product-4.png'
											className='img-fluid rounded'
											alt='Image'
										/>
									</div>
									<div>
										<h6 className='mb-2'>Smart Camera</h6>
										<div className='d-flex mb-2'>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star'></i>
										</div>
										<div className='d-flex mb-2'>
											<h5 className='fw-bold me-2'>2.99 $</h5>
											<h5 className='text-danger text-decoration-line-through'>
												4.11 $
											</h5>
										</div>
									</div>
								</div>
								<div className='featured-product-item'>
									<div
										className='rounded me-4'
										style={{ width: "100px", height: "100px" }}>
										<img
											src='/img/product-5.png'
											className='img-fluid rounded'
											alt='Image'
										/>
									</div>
									<div>
										<h6 className='mb-2'>Smart Camera</h6>
										<div className='d-flex mb-2'>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star'></i>
										</div>
										<div className='d-flex mb-2'>
											<h5 className='fw-bold me-2'>2.99 $</h5>
											<h5 className='text-danger text-decoration-line-through'>
												4.11 $
											</h5>
										</div>
									</div>
								</div>
								<div className='featured-product-item'>
									<div
										className='rounded me-4'
										style={{ width: "100px", height: "100px" }}>
										<img
											src='/img/product-6.png'
											className='img-fluid rounded'
											alt='Image'
										/>
									</div>
									<div>
										<h6 className='mb-2'>Smart Camera</h6>
										<div className='d-flex mb-2'>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star'></i>
										</div>
										<div className='d-flex mb-2'>
											<h5 className='fw-bold me-2'>2.99 $</h5>
											<h5 className='text-danger text-decoration-line-through'>
												4.11 $
											</h5>
										</div>
									</div>
								</div>
								<div className='featured-product-item'>
									<div
										className='rounded me-4'
										style={{ width: "100px", height: "100px" }}>
										<img
											src='/img/product-7.png'
											className='img-fluid rounded'
											alt='Image'
										/>
									</div>
									<div>
										<h6 className='mb-2'>Camera Leance</h6>
										<div className='d-flex mb-2'>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star'></i>
										</div>
										<div className='d-flex mb-2'>
											<h5 className='fw-bold me-2'>2.99 $</h5>
											<h5 className='text-danger text-decoration-line-through'>
												4.11 $
											</h5>
										</div>
									</div>
								</div>
								<div className='featured-product-item'>
									<div
										className='rounded me-4'
										style={{ width: "100px", height: "100px" }}>
										<img
											src='/img/product-8.png'
											className='img-fluid rounded'
											alt='Image'
										/>
									</div>
									<div>
										<h6 className='mb-2'>Smart Camera</h6>
										<div className='d-flex mb-2'>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star text-secondary'></i>
											<i className='fa fa-star'></i>
										</div>
										<div className='d-flex mb-2'>
											<h5 className='fw-bold me-2'>2.99 $</h5>
											<h5 className='text-danger text-decoration-line-through'>
												4.11 $
											</h5>
										</div>
									</div>
								</div>
								<div className='d-flex justify-content-center my-4'>
									<a
										href='#'
										className='btn btn-primary px-4 py-3 rounded-pill w-100'>
										Xem thêm
									</a>
								</div>
							</div>
							<div className='w-100 position-relative'>
								<img
									src='/img/product-banner-2.jpg'
									className='img-fluid w-100 rounded'
									alt='Image'
								/>
								<div
									className='text-center position-absolute d-flex flex-column align-items-center justify-content-center rounded p-4'
									style={{
										width: "100%",
										height: "100%",
										top: 0,
										right: 0,
										background: "rgba(242, 139, 0, 0.3)",
									}}>
									<h5 className='display-6 text-primary'>Giảm giá</h5>
									<h4 className='text-secondary'>Giảm đến 50%</h4>
									<a href='#' className='btn btn-primary rounded-pill px-4'>
										Mua ngay
									</a>
								</div>
							</div>
							<div className='product-tags my-4'>
								<h4 className='mb-3'>Từ khóa sản phẩm</h4>
								<div className='product-tags-items bg-light rounded p-3'>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										New
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										brand
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										black
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										white
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										tablats
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										phone
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										camera
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										drone
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										talevision
									</a>
									<a href='#' className='border rounded py-1 px-2 mb-2'>
										slaes
									</a>
								</div>
							</div>
						</div>
						<div className='col-lg-7 col-xl-9 wow fadeInUp' data-wow-delay='0.1s'>
							<div className='row g-4 single-product'>
								<div className='col-xl-6'>
									<div className='single-carousel owl-carousel'>
										{images.map((image, index) => (
											<div
												key={image}
												className='single-item'
												data-dot={`<img class='img-fluid' src='${image}' alt='' />`}>
												<div className='single-inner bg-light rounded'>
													<img
														src={image}
														className='img-fluid rounded'
														alt={`${product.name} ${index + 1}`}
														onError={(e) => {
															e.target.src = "https://placehold.co/600x400";
														}}
													/>
												</div>
											</div>
										))}
									</div>
								</div>
								<div className='col-xl-6'>
									<h4 className='fw-bold mb-3'>{product.name}</h4>
									<p className='mb-3'>
										Danh mục: {product.category?.name || "Chưa phân loại"}
									</p>
									<h5 className='fw-bold mb-3'>
										{hasDiscount(product) ? (
											<>
												<del className='me-2'>
													{formatCurrency(product.price)}
												</del>
												{formatCurrency(getFinalPrice(product))}
											</>
										) : (
											formatCurrency(product.price)
										)}
									</h5>
									<div className='d-flex mb-4'>
										{renderRating(product.rating_average || 0)}
									</div>
									<div className='mb-3'>
										<div className='btn btn-primary d-inline-block rounded text-white py-1 px-4 me-2'>
											<i className='fab fa-facebook-f me-1'></i> Chia sẻ
										</div>
										<div className='btn btn-secondary d-inline-block rounded text-white py-1 px-4 ms-2'>
											<i className='fab fa-twitter ms-1'></i> Chia sẻ
										</div>
									</div>
									<div className='d-flex flex-column mb-3'>
										<small>Thương hiệu: {product.brand?.name || "Chưa rõ"}</small>
										<small>
											Tình trạng:{" "}
											<strong className='text-primary'>
												{isInStock(product)
													? `Còn hàng`
													: "Hết hàng"}
											</strong>
										</small>
									</div>
									<p className='mb-4'>
										{product.short_description ||
											product.description ||
											"Chưa có mô tả ngắn."}
									</p>
									
									<div
										className='input-group quantity mb-5'
										style={{ width: "100px" }}>
										<div className='input-group-btn'>
											<button
												className='btn btn-sm btn-minus rounded-circle bg-light border'
												type='button'
												onClick={handleDecrease}>
												<i className='fa fa-minus'></i>
											</button>
										</div>
										<input
											type='text'
											className='form-control form-control-sm text-center border-0'
											value={quantity}
											readOnly
										/>
										<div className='input-group-btn'>
											<button
												className='btn btn-sm btn-plus rounded-circle bg-light border'
												type='button'
												onClick={handleIncrease}>
												<i className='fa fa-plus'></i>
											</button>
										</div>
									</div>
									<a
										href='#'
										onClick={handleAddToCart}
										className='btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-primary'>
										<i className='fa fa-shopping-bag me-2 text-white'></i> Thêm vào giỏ hàng
									</a>
								</div>
								<div className='col-lg-12'>
									<nav>
										<div className='nav nav-tabs mb-3'>
											<button
												className='nav-link active border-white border-bottom-0'
												type='button'
												role='tab'
												id='nav-about-tab'
												data-bs-toggle='tab'
												data-bs-target='#nav-about'
												aria-controls='nav-about'
												aria-selected='true'>
												Thông số kỹ thuật
											</button>
										</div>
									</nav>
									<div className='tab-content mb-5'>
										<div
											className='tab-pane active'
											id='nav-about'
											role='tabpanel'
											aria-labelledby='nav-about-tab'>
											<ul className='list-unstyled mb-0'>
												<li>
													<strong>Thương hiệu:</strong>{" "}
													{product.brand?.name || "Chưa rõ"}
												</li>
												<li>
													<strong>Danh mục:</strong>{" "}
													{product.category?.name || "Chưa phân loại"}
												</li>
												<li>
													<strong>Giá:</strong>{" "}
													{formatCurrency(getFinalPrice(product))}
												</li>
												<li>
													<strong>Tồn kho:</strong>{" "}
													{product.stock_quantity ?? 0}
												</li>
												<li>
													<strong>Đánh giá:</strong>{" "}
													{product.rating_average
														? `${product.rating_average}/5`
														: "Chưa có"}
												</li>
											</ul>
										</div>
										<div className='tab-pane' id='nav-vision' role='tabpanel'>
											<p className='text-dark'>
												Tempor erat elitr rebum at clita. Diam dolor diam ipsum
												et tempor sit. Aliqu diam amet diam et eos labore. 3
											</p>
											<p className='mb-0'>
												Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam
												et eos labore. Clita erat ipsum et lorem et sit
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
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
