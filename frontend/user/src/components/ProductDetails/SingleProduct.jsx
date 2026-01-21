import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import {
	getAllProductImages,
	getFinalPrice,
	hasDiscount,
	isInStock,
} from "@shared/utils/productHelper.jsx";
import { formatCurrency, formatDate } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";
import { isAuthenticated } from "../../services/authService";
import api from "../../services/api";
import Pagination from "../Partial/Pagination.jsx";

import { useWishlist } from "../Wishlist/WishlistContext.jsx";

export default function SingleProduct({ product }) {
	const [reviews, setReviews] = useState([]);
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { addToCart } = useCart();
	const { updateWishlistCount } = useWishlist();
	const { toast, showSuccess, showError, closeToast } = useToast();
	const [quantity, setQuantity] = useState(1);
	const images = useMemo(() => getAllProductImages(product?.image_url), [product?.image_url]);
	const DEFAULT_AVATAR = "https://placehold.co/400?text=Chưa+có+ảnh";
	const getAvatarSrc = () => {
		const raw = reviews.user?.image;
		const src = typeof raw === "string" ? raw.trim() : raw;
		return src ? src : DEFAULT_AVATAR;
	};

	// Pagination logic for reviews
	const [reviewPage, setReviewPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const REVIEWS_PER_PAGE = 5;

	const handleReviewPageChange = (page) => {
		setReviewPage(page);
		const reviewSection = document.getElementById("nav-review");
		if (reviewSection) {
			reviewSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	const fetchReviews = (page) => {
		api.get(`/reviews`, {
			params: {
				product_id: product.id,
				page: page,
				per_page: REVIEWS_PER_PAGE,
			},
		})
			.then((response) => {
				setReviews(response.data.data || []);
				if (response.data.pagination) {
					setTotalPages(response.data.pagination.last_page);
				} else {
					// Fallback if no pagination data
					setTotalPages(1);
				}
			})
			.catch((error) => {
				console.error("Error fetching reviews:", error);
			});
	};

	useEffect(() => {
		fetchReviews(reviewPage);
	}, [reviewPage, product.id]);

	useEffect(() => {
		const loggedIn = isAuthenticated();
		setIsLoggedIn(loggedIn);

		setReviewPage(1);

		if (loggedIn) {
			checkInWishlist();
		}

		if (window.initCarousels?.single) {
			window.initCarousels.single();
		}
	}, [images.length, product.id]);

	const handleToggleWishlist = () => {
		if (isInWishlist) {
			// Xóa khỏi wishlist
			api.delete(`/wishlists/${product.id}`)
				.then((response) => {
					setIsInWishlist(false);
					showSuccess("Đã xóa khỏi danh sách yêu thích");
					updateWishlistCount();
				})
				.catch((error) => {
					console.error("Error removing from wishlist:", error);
					showError("Lỗi khi xóa khỏi danh sách yêu thích");
				});
		} else {
			// Thêm vào wishlist
			api.post(`/wishlists/`, { product_id: product.id })
				.then((response) => {
					setIsInWishlist(true);
					showSuccess("Đã thêm vào danh sách yêu thích");
					updateWishlistCount();
				})
				.catch((error) => {
					console.error("Error adding to wishlist:", error);
					showError("Lỗi khi thêm vào danh sách yêu thích");
				});
		}
	};

	const checkInWishlist = () => {
		api.get(`/wishlists/check/${product.id}`)
			.then((response) => {
				setIsInWishlist(response.data.data.is_in_wishlist);
			})
			.catch((error) => {
				console.error("Error fetching wishlist:", error);
				setIsInWishlist(false);
			});
	};

	const getMaxQuantity = () => {
		const stock = Number(product?.stock_quantity ?? 0);
		return stock > 0 ? stock : 1;
	};

	const handleDecrease = () => {
		if (quantity <= 1) return;
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	const handleQuantityChange = (e) => {
		const raw = Number(e.target.value);
		if (!Number.isFinite(raw)) return;
		const nextQty = Math.min(Math.max(raw, 1), getMaxQuantity());
		setQuantity(nextQty);
	};

	const handleIncrease = () => {
		const maxQty = getMaxQuantity();
		setQuantity((prev) => Math.min(maxQty, prev + 1));
	};

	const handleAddToCart = (e) => {
		e.preventDefault();
		if (isInStock(product)) {
			const nextQty = Math.min(Math.max(quantity, 1), getMaxQuantity());
			setQuantity(nextQty);
			const added = addToCart(product, nextQty);
			if (!added) {
				showError("Vui lòng đăng nhập để thêm vào giỏ hàng");
				navigate("/dang-nhap");
				return;
			}
			showSuccess("Đã thêm vào giỏ hàng");
		}
	};

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			showSuccess("\u0110\u00e3 sao ch\u00e9p \u0111\u01b0\u1eddng link s\u1ea3n ph\u1ea9m");
		} catch {
			const tempInput = document.createElement("input");
			tempInput.value = window.location.href;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand("copy");
			document.body.removeChild(tempInput);
			showSuccess("\u0110\u00e3 sao ch\u00e9p \u0111\u01b0\u1eddng link s\u1ea3n ph\u1ea9m");
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
															e.target.src =
																"https://placehold.co/600x400";
														}}
													/>
												</div>
											</div>
										))}
									</div>
								</div>
								<div className='col-xl-6'>
									<h4 className='fw-bold mb-3'>{product.name}</h4>
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
										<button
											type='button'
											onClick={handleCopyLink}
											className='btn btn-primary d-inline-block rounded text-white py-1 px-4 me-2'>
											<i className='fa fa-link me-1'></i> Sao chép liên kết
										</button>
										{isLoggedIn && (
											<button
												type='button'
												onClick={handleToggleWishlist}
												className={`btn ${isInWishlist ? "btn-danger" : "btn-outline-danger"} d-inline-block rounded py-1 px-4`}>
												<i
													className={`fa${isInWishlist ? "s" : "r"} fa-heart me-1`}></i>
												{isInWishlist ? "Đã yêu thích" : "Yêu thích"}
											</button>
										)}
									</div>
									<div className='d-flex flex-column mb-3'>
										<small>
											Thương hiệu: {product.brand?.name || "Chưa rõ"}
										</small>
										<small>
											Tình trạng:{" "}
											<strong className='text-primary'>
												{isInStock(product) ? `Còn hàng` : "Hết hàng"}
											</strong>
										</small>
										<small>
											Số lượng tồn kho: {product.stock_quantity ?? 0}
										</small>
									</div>
									<div
										className='input-group quantity mb-5'
										style={{ width: "140px" }}>
										<div className='input-group-btn'>
											<button
												className='btn btn-sm btn-minus rounded-circle bg-light border'
												type='button'
												disabled={quantity <= 1}
												onClick={handleDecrease}>
												<i className='fa fa-minus'></i>
											</button>
										</div>
										<input
											type='number'
											min={1}
											max={getMaxQuantity()}
											className='form-control form-control-sm text-center border-0'
											style={{ height: "40px", padding: "0 8px" }}
											value={quantity}
											onChange={handleQuantityChange}
										/>
										<div className='input-group-btn'>
											<button
												className='btn btn-sm btn-plus rounded-circle bg-light border'
												type='button'
												disabled={quantity >= getMaxQuantity()}
												onClick={handleIncrease}>
												<i className='fa fa-plus'></i>
											</button>
										</div>
									</div>
									<a
										href='#'
										onClick={handleAddToCart}
										className='btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-primary'>
										<i className='fa fa-shopping-bag me-2 text-white'></i> Thêm
										vào giỏ hàng
									</a>
								</div>
								<div className='col-lg-12'>
									<nav>
										<div className='nav nav-tabs mb-3'>
											<button
												className='nav-link active border-white border-bottom-0'
												type='button'
												role='tab'
												id='nav-desc-tab'
												data-bs-toggle='tab'
												data-bs-target='#nav-desc'
												aria-controls='nav-desc'
												aria-selected='true'>
												Mô tả sản phẩm
											</button>
											<button
												className='nav-link border-white border-bottom-0'
												type='button'
												role='tab'
												id='nav-about-tab'
												data-bs-toggle='tab'
												data-bs-target='#nav-about'
												aria-controls='nav-about'
												aria-selected='false'>
												Thông số kỹ thuật
											</button>
											<button
												className='nav-link border-white border-bottom-0'
												type='button'
												role='tab'
												id='nav-review-tab'
												data-bs-toggle='tab'
												data-bs-target='#nav-review'
												aria-controls='nav-review'
												aria-selected='false'>
												Đánh giá
											</button>
										</div>
									</nav>
									<div className='tab-content mb-5'>
										<div
											className='tab-pane active'
											id='nav-desc'
											role='tabpanel'
											aria-labelledby='nav-desc-tab'>
											{product.description ? (
												<div
													className='mb-0'
													dangerouslySetInnerHTML={{
														__html: product.description,
													}}
												/>
											) : (
												<p className='mb-0'>Chưa có mô tả sản phẩm.</p>
											)}
										</div>
										<div
											className='tab-pane'
											id='nav-about'
											role='tabpanel'
											aria-labelledby='nav-about-tab'>
											<div className='table-responsive'>
												<table className='table table-bordered mb-0'>
													<tbody>
														{product.specifications &&
														product.specifications.length > 0 ? (
															product.specifications.map((spec) => (
																<tr key={spec.id || spec.name}>
																	<th scope='row'>{spec.name}</th>
																	<td>
																		{spec.value}
																		{spec.unit
																			? ` ${spec.unit}`
																			: ""}
																	</td>
																</tr>
															))
														) : (
															<tr>
																<td colSpan='2'>
																	Chưa có thông số kỹ thuật.
																</td>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</div>
										<div
											className='tab-pane'
											id='nav-review'
											role='tabpanel'
											aria-labelledby='nav-review-tab'>
											{/* Rating Summary */}
											<div className='row mb-4'>
												<div className='col-lg-4'>
													<div className='bg-light rounded p-4 text-center'>
														<h1 className='display-4 fw-bold text-primary mb-2'>
															{product.rating_average
																? Number(
																		product.rating_average,
																	).toFixed(1)
																: "0.0"}
														</h1>
														<div className='d-flex justify-content-center mb-2'>
															{renderRating(
																product.rating_average || 0,
															)}
														</div>
														<p className='mb-0 text-muted'>
															{product.rating_count || 0} đánh giá
														</p>
													</div>
												</div>
												<div className='col-lg-8'>
													<div className='p-3'>
														{[5, 4, 3, 2, 1].map((star) => {
															const ratingDist =
																product.rating_distribution || {};
															const count = ratingDist[star] || 0;
															const totalReviews =
																product.rating_count || 0;
															const percentage =
																totalReviews > 0
																	? (count / totalReviews) * 100
																	: 0;

															return (
																<div
																	key={star}
																	className='d-flex align-items-center mb-2'>
																	<span
																		className='me-2'
																		style={{
																			minWidth: "60px",
																		}}>
																		{star}{" "}
																		<i className='fa fa-star text-warning'></i>
																	</span>
																	<div
																		className='progress flex-grow-1 me-2'
																		style={{ height: "8px" }}>
																		<div
																			className='progress-bar bg-warning'
																			role='progressbar'
																			style={{
																				width: `${percentage}%`,
																			}}
																			aria-valuenow={
																				percentage
																			}
																			aria-valuemin={0}
																			aria-valuemax={
																				100
																			}></div>
																	</div>
																	<span
																		className='text-muted'
																		style={{
																			minWidth: "40px",
																		}}>
																		{count}
																	</span>
																</div>
															);
														})}
													</div>
												</div>
											</div>

											{/* Review List */}
											<div className='reviews-list mb-4'>
												<h5 className='mb-4'>
													Đánh giá từ khách hàng ({reviews.length})
												</h5>

												{reviews.length > 0 ? (
													<>
														{reviews.map((review) => (
															<div
																key={review.id}
																className='review-item border rounded p-3 mb-3'>
																<div className='d-flex'>
																	<img
																		src={getAvatarSrc()}
																		className='rounded-circle me-3'
																		style={{
																			width: "60px",
																			height: "60px",
																			objectFit: "cover",
																		}}
																		alt='Avatar'
																	/>
																	<div className='flex-grow-1'>
																		<div className='d-flex justify-content-between align-items-start mb-2'>
																			<div>
																				<h6 className='mb-1 fw-bold'>
																					{review.user
																						?.full_name ||
																						"Khách hàng"}
																				</h6>
																				<div className='d-flex align-items-center mb-1'>
																					<div className='d-flex me-3'>
																						{renderRating(
																							review.rating,
																						)}
																					</div>
																					<small className='text-muted'>
																						{formatDate(
																							review.created_at,
																						)}
																					</small>
																				</div>
																			</div>
																		</div>
																		<p className='mb-2'>
																			{review.content}
																		</p>

																		{/* Reply from Shop */}
																		{review.review_reply && (
																			<div className='reply-section bg-light rounded p-3 ms-4 mt-3'>
																				<div className='d-flex'>
																					<i className='fas fa-reply text-primary me-2 mt-1'></i>
																					<div className='flex-grow-1'>
																						<p className='mb-1'>
																							<strong className='text-primary'>
																								VYNX
																								Store
																							</strong>
																							<small className='text-muted ms-2'>
																								{review.updated_at &&
																									formatDate(
																										review.updated_at,
																									)}
																							</small>
																						</p>
																						<p className='mb-0'>
																							{
																								review.review_reply
																							}
																						</p>
																					</div>
																				</div>
																			</div>
																		)}
																	</div>
																</div>
															</div>
														))}
														<Pagination
															currentPage={reviewPage}
															lastPage={totalPages}
															onPageChange={handleReviewPageChange}
														/>
													</>
												) : (
													<div className='text-center py-5'>
														<i className='fas fa-comments fa-3x text-muted mb-3'></i>
														<p className='text-muted'>
															Chưa có đánh giá nào cho sản phẩm này.
															<br />
															Hãy là người đầu tiên đánh giá!
														</p>
													</div>
												)}
											</div>

											{/* Write Review Form */}
											{/* <div className='write-review bg-light rounded p-4'>
												<h5 className='mb-4'>Viết đánh giá của bạn</h5>
												<form>
													<div className='mb-3'>
														<label className='form-label fw-bold'>
															Đánh giá của bạn <span className='text-danger'>*</span>
														</label>
														<div className='d-flex gap-2'>
															{[1, 2, 3, 4, 5].map((star) => (
																<i
																	key={star}
																	className='fa fa-star text-muted'
																	style={{ fontSize: '24px', cursor: 'pointer' }}
																	onMouseEnter={(e) => e.target.classList.replace('text-muted', 'text-warning')}
																	onMouseLeave={(e) => e.target.classList.replace('text-warning', 'text-muted')}></i>
															))}
														</div>
													</div>
													<div className='mb-3'>
														<label htmlFor='reviewName' className='form-label fw-bold'>
															Tên của bạn <span className='text-danger'>*</span>
														</label>
														<input
															type='text'
															className='form-control'
															id='reviewName'
															placeholder='Nhập tên của bạn'
														/>
													</div>
													<div className='mb-3'>
														<label htmlFor='reviewContent' className='form-label fw-bold'>
															Nội dung đánh giá <span className='text-danger'>*</span>
														</label>
														<textarea
															className='form-control'
															id='reviewContent'
															rows='4'
															placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm này...'></textarea>
													</div>
													<div className='mb-3'>
														<label htmlFor='reviewImages' className='form-label fw-bold'>
															Hình ảnh (Tùy chọn)
														</label>
														<input
															type='file'
															className='form-control'
															id='reviewImages'
															multiple
															accept='image/*'
														/>
														<small className='text-muted'>Tối đa 5 ảnh</small>
													</div>
													<button type='submit' className='btn btn-primary rounded-pill px-4'>
														<i className='fa fa-paper-plane me-2'></i>
														Gửi đánh giá
													</button>
												</form>
											</div> */}
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
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
