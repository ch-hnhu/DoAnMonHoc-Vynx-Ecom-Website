import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import {
	getAllProductImages,
	getFinalPrice,
	getProductImage,
	hasDiscount,
	isInStock,
} from "@shared/utils/productHelper.jsx";
import { formatCurrency, formatDate } from "@shared/utils/formatHelper.jsx";
import { renderRating } from "@shared/utils/renderHelper.jsx";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";
import Spinner from "../Partial/Spinner";
import api from "../../services/api";

export default function SingleProduct({ product }) {
	const navigate = useNavigate();
	const [reviews, setReviews] = useState([]);
	const { addToCart } = useCart();
	const { toast, showSuccess, closeToast } = useToast();
	const [quantity, setQuantity] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [featuredLoading, setFeaturedLoading] = useState(false);
	const [categorySlug, setCategorySlug] = useState(null);
	const [priceValue, setPriceValue] = useState(0);
	const priceMax = 100000000;
	const images = useMemo(
		() => getAllProductImages(product?.image_url),
		[product?.image_url]
	);
	const DEFAULT_AVATAR = "https://placehold.co/400?text=Chưa+có+ảnh";
	const getAvatarSrc = () => {
		const raw = reviews.user?.image;
		const src = typeof raw === "string" ? raw.trim() : raw;
		return src ? src : DEFAULT_AVATAR;
	};

	const fetchReviews = () => {
		api.get(`/reviews?product_id=${product.id}`)
			.then((response) => {
				setReviews(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching reviews:", error);
			});
	};

	useEffect(() => {
		fetchReviews();
		if (window.initCarousels?.single) {
			window.initCarousels.single();
		}
	}, [images.length, product.id]);

	useEffect(() => {
		api
			.get("/categories", { params: { flat: 1, per_page: 10000 } })
			.then((res) => {
				if (res?.data?.success) {
					setCategories(res.data.data || []);
				} else {
					setCategories(res?.data?.data || []);
				}
			})
			.catch((error) => {
				console.error("Error fetching categories: ", error);
			});

		api
			.get("/brands", { params: { per_page: 10000 } })
			.then((res) => {
				if (res?.data?.success) {
					setBrands(res.data.data || []);
				} else {
					setBrands(res?.data?.data || []);
				}
			})
			.catch((error) => {
				console.error("Error fetching brands: ", error);
			});
	}, []);

	useEffect(() => {
		let isActive = true;
		queueMicrotask(() => {
			if (!isActive) return;
			setFeaturedLoading(true);
		});
		api
			.get("/products", { params: { page: 1, per_page: 4, featured: 1 } })
			.then((res) => {
				if (!isActive) return;
				setFeaturedProducts(res.data.data || []);
			})
			.catch((error) => {
				if (!isActive) return;
				console.error("Error fetching featured products: ", error);
			})
			.finally(() => {
				if (isActive) setFeaturedLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, []);

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
			addToCart(product, nextQty);
			showSuccess("Đã thêm vào giỏ hàng");
		}
	};

	const handleViewDetails = (item) => {
		if (item?.slug) {
			navigate(`/${item.slug}`);
		}
	};

	const handleSearchSubmit = () => {
		const keyword = searchTerm.trim();
		if (keyword) {
			navigate(`/san-pham?search=${encodeURIComponent(keyword)}`);
			return;
		}
		navigate("/san-pham");
	};

	const handleCategoryChange = (slug) => {
		setCategorySlug(slug);
		if (slug) {
			navigate(`/san-pham?category=${slug}`);
			return;
		}
		navigate("/san-pham");
	};

	const handleTagSearch = (term) => {
		const keyword = (term || "").trim();
		setSearchTerm(keyword);
		if (keyword) {
			navigate(`/san-pham?search=${encodeURIComponent(keyword)}`);
			return;
		}
		navigate("/san-pham");
	};

	const handlePriceChange = (value) => {
		setPriceValue(value);
	};

	const handleApplyPrice = () => {
		if (priceValue > 0) {
			navigate(`/san-pham?max_price=${priceValue}`);
			return;
		}
		navigate("/san-pham");
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
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleSearchSubmit();
										}
									}}
								/>
								<span
									id='search-icon-1'
									className='input-group-text p-3'
									role='button'
									tabIndex={0}
									onClick={handleSearchSubmit}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleSearchSubmit();
										}
									}}
									style={{ cursor: "pointer" }}>
									<i className='fa fa-search'></i>
								</span>
							</div>
							{/* Sidebar */}
								<div className='additional-product mb-4'>
									<h4>Chọn theo danh mục</h4>
									<div className='additional-product-item'>
										<input
											type='radio'
											className='me-2'
											id='Categories-all'
											name='Categories'
											checked={!categorySlug}
											onChange={() => handleCategoryChange(null)}
										/>
										<label htmlFor='Categories-all' className='text-dark'>
											{" "}Tất cả
										</label>
									</div>
									{categories.map((category) => (
										<div className='additional-product-item' key={category.id}>
											<input
												type='radio'
												className='me-2'
												id={`Categories-${category.id}`}
												name='Categories'
												checked={categorySlug === category.slug}
												onChange={() => handleCategoryChange(category.slug)}
											/>
											<label htmlFor={`Categories-${category.id}`} className='text-dark'>
												{" "}{category.name}
											</label>
										</div>
									))}
								</div>

								<div className='price mb-4'>
									<h4 className='mb-2'>Giá</h4>
									<input
										type='range'
										className='form-range w-100'
										id='rangeInput'
										name='rangeInput'
										min='0'
										max={priceMax}
										value={priceValue}
										onChange={(e) => handlePriceChange(Number(e.target.value))}
									/>
									<output id='amount' name='amount' min='0' max={priceMax}>
										{formatCurrency(priceValue)}
									</output>
									<button
										type='button'
										className='btn btn-primary w-100 mt-2'
										onClick={handleApplyPrice}>
										Áp dụng
									</button>
								</div>

								<div className='featured-product mb-4'>
									<h4 className='mb-3'>Sản phẩm nổi bật</h4>
									{featuredLoading ? (
										<div className='py-3'>
											<Spinner />
										</div>
									) : featuredProducts.length > 0 ? (
										featuredProducts.map((item) => (
											<div className='featured-product-item' key={item.id}>
												<div className='rounded me-4' style={{ width: 100, height: 100 }}>
													<img
														src={getProductImage(item.image_url)}
														className='img-fluid rounded'
														alt={item.name}
														onError={(e) => {
														e.target.src = "https://placehold.co/200x200";
													}}
													/>
												</div>
												<div>
													<a
														href='#'
														className='text-dark'
														onClick={(e) => {
														e.preventDefault();
														handleViewDetails(item);
													}}>
														<h6 className='mb-2'>{item.name}</h6>
													</a>
													<div className='d-flex mb-2'>
														<i className='fa fa-star text-secondary'></i>
														<i className='fa fa-star text-secondary'></i>
														<i className='fa fa-star text-secondary'></i>
														<i className='fa fa-star text-secondary'></i>
														<i className='fa fa-star'></i>
													</div>
													<div className='d-flex mb-2'>
														{hasDiscount(item) ? (
															<>
																<h5 className='fw-bold me-2'>
																	{formatCurrency(getFinalPrice(item))}
																</h5>
																<h5 className='text-danger text-decoration-line-through'>
																	{formatCurrency(item.price)}
																</h5>
															</>
														) : (
															<h5 className='fw-bold me-2'>
																{formatCurrency(item.price)}
															</h5>
														)}
													</div>
												</div>
											</div>
										))
									) : (
										<p className='text-muted'>Không có sản phẩm nổi bật</p>
									)}
									<div className='d-flex justify-content-center my-4'>
										<a href='/san-pham' className='btn btn-primary px-4 py-3 rounded-pill w-100'>
											Xem thêm
										</a>
									</div>
								</div>

								<div className='position-relative'>
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
										<h5 className='display-6 text-primary'>GIẢM GIÁ</h5>
										<h4 className='text-secondary'>Giảm đến 50%</h4>
										<a href='/san-pham' className='btn btn-primary rounded-pill px-4'>
											Mua ngay
										</a>
									</div>
								</div>
								<div className='product-tags py-4'>
									<h4 className='mb-3'>TỪ KHÓA</h4>
									<div className='product-tags-items bg-light rounded p-3'>
										<a
											href='#'
											className='border rounded py-1 px-2 mb-2'
											onClick={(e) => {
												e.preventDefault();
												handleTagSearch("");
											}}>
											Tất cả
										</a>
										{brands.map((brand) => (
											<a
												key={brand.id}
												href='#'
												className='border rounded py-1 px-2 mb-2'
												onClick={(e) => {
													e.preventDefault();
													handleTagSearch(brand.name);
												}}>
												{brand.name}
											</a>
										))}
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
										<small>Số lượng tồn kho: {product.stock_quantity ?? 0}</small>
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
											<p className='mb-0'>
												{product.description ||
													product.short_description ||
													"Chưa có mô tả sản phẩm."}
											</p>
										</div>
										<div
											className='tab-pane'
											id='nav-about'
											role='tabpanel'
											aria-labelledby='nav-about-tab'>
											<div className='table-responsive'>
												<table className='table table-bordered mb-0'>
													<tbody>
														{(product.specifications && product.specifications.length > 0) ? (
															product.specifications.map((spec) => (
																<tr key={spec.id || spec.name}>
																	<th scope='row'>{spec.name}</th>
																	<td>{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</td>
																</tr>
															))
														) : (
															<tr>
																<td colSpan='2'>Chưa có thông số kỹ thuật.</td>
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
															{product.rating_average ? Number(product.rating_average).toFixed(1) : '0.0'}
														</h1>
														<div className='d-flex justify-content-center mb-2'>
															{renderRating(product.rating_average || 0)}
														</div>
														<p className='mb-0 text-muted'>
															{product.rating_count || 0} đánh giá
														</p>
													</div>
												</div>
												<div className='col-lg-8'>
													<div className='p-3'>
														{[5, 4, 3, 2, 1].map((star) => {
															const ratingDist = product.rating_distribution || {};
															const count = ratingDist[star] || 0;
															const totalReviews = product.rating_count || 0;
															const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

															return (
																<div key={star} className='d-flex align-items-center mb-2'>
																	<span className='me-2' style={{ minWidth: '60px' }}>
																		{star} <i className='fa fa-star text-warning'></i>
																	</span>
																	<div className='progress flex-grow-1 me-2' style={{ height: '8px' }}>
																		<div
																			className='progress-bar bg-warning'
																			role='progressbar'
																			style={{ width: `${percentage}%` }}
																			aria-valuenow={percentage}
																			aria-valuemin={0}
																			aria-valuemax={100}></div>
																	</div>
																	<span className='text-muted' style={{ minWidth: '40px' }}>{count}</span>
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
													reviews.map((review) => (
														<div key={review.id} className='review-item border rounded p-3 mb-3'>
															<div className='d-flex'>
																<img
																	src={getAvatarSrc()}
																	className='rounded-circle me-3'
																	style={{ width: "60px", height: "60px", objectFit: "cover" }}
																	alt='Avatar'
																/>
																<div className='flex-grow-1'>
																	<div className='d-flex justify-content-between align-items-start mb-2'>
																		<div>
																			<h6 className='mb-1 fw-bold'>
																				{review.user?.full_name || 'Khách hàng'}
																			</h6>
																			<div className='d-flex align-items-center mb-1'>
																				<div className='d-flex me-3'>
																					{renderRating(review.rating)}
																				</div>
																				<small className='text-muted'>
																					{formatDate(review.created_at)}
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
																						<strong className='text-primary'>VYNX Store</strong>
																						<small className='text-muted ms-2'>
																							{review.updated_at && formatDate(review.updated_at)}
																						</small>
																					</p>
																					<p className='mb-0'>
																						{review.review_reply}
																					</p>
																				</div>
																			</div>
																		</div>
																	)}
																</div>
															</div>
														</div>
													))
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
