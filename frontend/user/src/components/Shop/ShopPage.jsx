import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import Pagination from "../Partial/Pagination";
import ProductCardLarge from "../Partial/ProductCardLarge";
import ProductCardMedium from "../Partial/ProductCardMedium";
import Spinner from "../Partial/Spinner";
import api from "../../services/api";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";
import { getFinalPrice, getProductImage, hasDiscount } from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";

export default function ShopPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { addToCart } = useCart();
	const { toast, showSuccess, showError, closeToast } = useToast();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [pagination, setPagination] = useState({
		currentPage: 1,
		lastPage: 1,
		perPage: 6,
		total: 0,
	});
	const keyword = (searchParams.get("search") || "").trim();
	const categoryParam = (searchParams.get("category") || "").trim();
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [featuredLoading, setFeaturedLoading] = useState(false);
	const [filters, setFilters] = useState(() => ({
		categorySlug: categoryParam || null,
		brandId: null,
		maxPrice: null,
	}));
	const [sortBy, setSortBy] = useState("newest");
	const [priceValue, setPriceValue] = useState(0);
	const priceMax = 100000000;
	const searchInputRef = useRef(null);

	useEffect(() => {
		api.get("/categories", { params: { flat: 1, per_page: 10000 } })
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

		api.get("/brands", { params: { per_page: 10000 } })
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
		setSearchTerm(keyword);
		setPagination((prev) => ({ ...prev, currentPage: 1 }));
	}, [keyword]);

	useEffect(() => {
		setFilters((prev) => ({
			...prev,
			categorySlug: categoryParam || null,
		}));
		setPagination((prev) => ({ ...prev, currentPage: 1 }));
	}, [categoryParam]);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			const params = {
				page: pagination.currentPage,
				per_page: pagination.perPage,
				search: keyword || undefined,
				sort: sortBy === "nothing" ? undefined : sortBy,
				category_slug: filters.categorySlug || undefined,
				brand_id: filters.brandId || undefined,
				max_price: filters.maxPrice || undefined,
			};
			try {
				const res = await api.get("/products", { params });
				setProducts(res.data.data || []);
				setPagination((prev) => ({
					...prev,
					currentPage: res.data.pagination.current_page,
					lastPage: res.data.pagination.last_page,
					total: res.data.pagination.total,
				}));
			} catch (error) {
				console.error("Error fetching products: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [
		pagination.currentPage,
		pagination.perPage,
		filters.categorySlug,
		filters.brandId,
		filters.maxPrice,
		sortBy,
		keyword,
	]);

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			setFeaturedLoading(true);
			const params = {
				page: 1,
				per_page: 4,
				featured: 1,
				search: keyword || undefined,
				category_slug: filters.categorySlug || undefined,
				brand_id: filters.brandId || undefined,
				max_price: filters.maxPrice || undefined,
			};
			try {
				const res = await api.get("/products", { params });
				setFeaturedProducts(res.data.data || []);
			} catch (error) {
				console.error("Error fetching featured products: ", error);
			} finally {
				setFeaturedLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, [filters.categorySlug, filters.brandId, filters.maxPrice, keyword]);

	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, currentPage: page }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSearchSubmit = () => {
		const nextKeyword = searchTerm.trim();
		setPagination((prev) => ({ ...prev, currentPage: 1 }));
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (nextKeyword) {
				next.set("search", nextKeyword);
			} else {
				next.delete("search");
			}
			return next;
		});
	};

	const handleTagSearch = (term) => {
		const nextKeyword = (term || "").trim();
		setSearchTerm(nextKeyword);
		setPagination((prev) => ({ ...prev, currentPage: 1 }));
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (nextKeyword) {
				next.set("search", nextKeyword);
			} else {
				next.delete("search");
			}
			return next;
		});
		if (searchInputRef.current) {
			searchInputRef.current.focus();
			searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	const handleCategoryChange = (categorySlug) => {
		setFilters((prev) => ({
			...prev,
			categorySlug,
			brandId: categorySlug === null ? null : prev.brandId,
		}));
		setPagination((prev) => ({ ...prev, currentPage: 1 }));
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (categorySlug) {
				next.set("category", categorySlug);
			} else {
				next.delete("category");
			}
			return next;
		});
		if (categorySlug === null) {
			setSearchTerm("");
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				next.delete("search");
				return next;
			});
		}
	};

	const handlePriceChange = (value) => {
		setPriceValue(value);
	};

	const handleApplyPrice = () => {
		setFilters((prev) => ({
			...prev,
			maxPrice: priceValue > 0 ? priceValue : null,
		}));
		setPagination((prev) => ({ ...prev, currentPage: 1 }));
	};

	const handleAddToCart = (product) => {
		const added = addToCart(product, 1);
		if (!added) {
			showError("Vui lòng đăng nhập để thêm vào giỏ hàng");
			navigate("/dang-nhap");
			return;
		}
		showSuccess("Đã thêm vào giỏ hàng");
	};

	const handleViewDetails = (product) => {
		if (product?.slug) {
			navigate(`/${product.slug}`);
		}
	};

	return (
		<div className='container-fluid shop py-5'>
			<div className='container py-5'>
				<div className='row g-4'>
					{/* Sidebar */}
					<div className='col-lg-3 wow fadeInUp' data-wow-delay='0.1s'>
						{/* Chọn theo danh mục */}
						<div className='additional-product mb-4'>
							<h4>Chọn theo danh mục</h4>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-all'
									name='Categories'
									checked={!filters.categorySlug}
									onChange={() => handleCategoryChange(null)}
								/>
								<label htmlFor='Categories-all' className='text-dark'>
									{" "}
									Tất cả
								</label>
							</div>

							{categories.map((category) => (
								<div className='additional-product-item' key={category.id}>
									<input
										type='radio'
										className='me-2'
										id={`Categories-${category.id}`}
										name='Categories'
										checked={filters.categorySlug === category.slug}
										onChange={() => handleCategoryChange(category.slug)}
									/>
									<label
										htmlFor={`Categories-${category.id}`}
										className='text-dark'>
										{" "}
										{category.name}
									</label>
								</div>
							))}
						</div>

						{/* Giá */}
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

						{/* Featured Product */}
						<div className='featured-product mb-4'>
							<h4 className='mb-3'>Sản phẩm nổi bật</h4>
							{featuredLoading ? (
								<div className='py-3'>
									<Spinner />
								</div>
							) : featuredProducts.length > 0 ? (
								featuredProducts.map((product) => (
									<div className='featured-product-item' key={product.id}>
										<div
											className='rounded me-4'
											style={{ width: 100, height: 100 }}>
											<img
												src={getProductImage(product.image_url)}
												className='img-fluid rounded'
												alt={product.name}
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
													handleViewDetails(product);
												}}>
												<h6 className='mb-2'>{product.name}</h6>
											</a>
											<div className='d-flex mb-2'>
												<i className='fa fa-star text-secondary'></i>
												<i className='fa fa-star text-secondary'></i>
												<i className='fa fa-star text-secondary'></i>
												<i className='fa fa-star text-secondary'></i>
												<i className='fa fa-star'></i>
											</div>
											<div className='d-flex mb-2'>
												{hasDiscount(product) ? (
													<>
														<h5 className='fw-bold me-2'>
															{formatCurrency(getFinalPrice(product))}
														</h5>
														<h5 className='text-danger text-decoration-line-through'>
															{formatCurrency(product.price)}
														</h5>
													</>
												) : (
													<h5 className='fw-bold me-2'>
														{formatCurrency(product.price)}
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
								<a
									href='#'
									className='btn btn-primary px-4 py-3 rounded-pill w-100'>
									Xem thêm
								</a>
							</div>
						</div>

						{/* Banner side */}
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
								<a href='#' className='btn btn-primary rounded-pill px-4'>
									Mua ngay
								</a>
							</div>
						</div>
						{/* Tags */}
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

					{/* Main content */}
					<div className='col-lg-9 wow fadeInUp' data-wow-delay='0.1s'>
						{/* <div className='rounded mb-4 position-relative'>
							<img
								src='/img/product-banner-3.jpg'
								className='img-fluid rounded w-100'
								style={{ height: 250 }}
								alt='Image'
							/>
							<div
								className='position-absolute rounded d-flex flex-column align-items-center justify-content-center text-center'
								style={{
									width: "100%",
									height: 250,
									top: 0,
									left: 0,
									background: "rgba(242, 139, 0, 0.3)",
								}}>
								<h4 className='display-5 text-primary'>GIẢM GIÁ</h4>
								<h3 className='display-4 text-white mb-4'>Giảm đến 50%</h3>
								<a href='#' className='btn btn-primary rounded-pill'>
									Mua ngay
								</a>
							</div>
						</div> */}

						<div className='row g-4'>
							<div className='col-xl-7'>
								<div className='input-group w-100 mx-auto d-flex'>
									<input
										type='search'
										className='form-control p-3'
										placeholder='Từ khóa'
										aria-describedby='search-icon-1'
										ref={searchInputRef}
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
							</div>

							<div className='col-xl-3 text-end'>
								<div className='bg-light ps-3 py-3 rounded d-flex justify-content-between'>
									<label htmlFor='electronics'>Sắp xếp:</label>
									<select
										id='electronics'
										name='electronicslist'
										className='border-0 form-select-sm bg-light me-3'
										value={sortBy}
										onChange={(e) => {
											setSortBy(e.target.value);
											setPagination((prev) => ({ ...prev, currentPage: 1 }));
										}}>
										<option value='newest'>Mặc định</option>
										<option value='nothing'>Không sắp xếp</option>
										<option value='bestseller'>Phổ biến</option>
										<option value='newest'>Mới nhất</option>
										<option value='rating'>Đánh giá</option>
										<option value='price_asc'>Giá tăng dần</option>
										<option value='price_desc'>Giá giảm dần</option>
									</select>
								</div>
							</div>

							<div className='col-lg-4 col-xl-2'>
								<ul className='nav nav-pills d-inline-flex text-center py-2 px-2 rounded bg-light mb-4'>
									<li className='nav-item me-4'>
										<a className='bg-light' data-bs-toggle='pill' href='#tab-5'>
											<i className='fas fa-th fa-3x text-primary'></i>
										</a>
									</li>
									<li className='nav-item'>
										<a className='bg-light' data-bs-toggle='pill' href='#tab-6'>
											<i className='fas fa-bars fa-3x text-primary'></i>
										</a>
									</li>
								</ul>
							</div>
						</div>

						{/* Tabs */}
						<div className='tab-content'>
							{/* Grid */}
							<div id='tab-5' className='tab-pane fade show p-0 active'>
								<div className='row g-4 product'>
									{loading ? (
										<Spinner />
									) : products.length > 0 ? (
										products.map((product) => (
											<ProductCardLarge
												key={product.id}
												product={product}
												onAddToCart={handleAddToCart}
												onViewDetails={handleViewDetails}
											/>
										))
									) : (
										<div className='col-12 text-center py-5'>
											<p>Không có sản phẩm nào</p>
										</div>
									)}

									{/* Pagination */}
									<Pagination
										currentPage={pagination.currentPage}
										lastPage={pagination.lastPage}
										onPageChange={handlePageChange}
									/>
								</div>
							</div>

							{/* List view */}
							<div id='tab-6' className='products tab-pane fade show p-0'>
								<div className='row g-4 products-mini'>
									{/* Mini item 1 */}
									{loading ? (
										<Spinner />
									) : products.length > 0 ? (
										products.map((product) => (
											<ProductCardMedium
												key={product.id}
												product={product}
												onAddToCart={handleAddToCart}
												onViewDetails={handleViewDetails}
											/>
										))
									) : (
										<div className='col-12 text-center py-5'>
											<p>Không có sản phẩm nào</p>
										</div>
									)}

									{/* Pagination */}
									<Pagination
										currentPage={pagination.currentPage}
										lastPage={pagination.lastPage}
										onPageChange={handlePageChange}
									/>
								</div>
							</div>
						</div>
						{/* End Tabs */}
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
		</div>
	);
}
