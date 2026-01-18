import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import Pagination from "../Partial/Pagination";
import ProductCardLarge from "../Partial/ProductCardLarge";
import ProductCardMedium from "../Partial/ProductCardMedium";
import Spinner from "../Partial/Spinner";
import api from "../../services/api";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";

export default function ShopPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { addToCart } = useCart();
	const { toast, showSuccess, closeToast } = useToast();
	const navigate = useNavigate();
	const [pagination, setPagination] = useState({
		currentPage: 1,
		lastPage: 1,
		perPage: 9,
		total: 0,
	});

	useEffect(() => {
		setLoading(true);
		api.get(`/products/paginated?page=${pagination.currentPage}&per_page=${pagination.perPage}`)
			.then((res) => {
				setProducts(res.data.data || []);
				setPagination((prev) => ({
					...prev,
					currentPage: res.data.pagination.current_page,
					lastPage: res.data.pagination.last_page,
					total: res.data.pagination.total,
				}));
			})
			.catch((error) => {
				console.error("Error fetching products: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [pagination.currentPage]);

	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, currentPage: page }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleAddToCart = (product) => {
		addToCart(product, 1);
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
						<div className='product-categories mb-4'>
							<h4>Danh mục sản phẩm</h4>
							<ul className='list-unstyled'>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Phụ kiện
										</a>
										<span>(3)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Điện tử &amp; Máy tính
										</a>
										<span>(5)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>
											Laptop &amp; Máy tính để bàn
										</a>
										<span>(2)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Điện thoại &amp; Máy tính bảng
										</a>
										<span>(8)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Điện thoại &amp; TV th?ng minh
										</a>
										<span>(5)</span>
									</div>
								</li>
							</ul>
						</div>

						{/* Gi? */}
						<div className='price mb-4'>
							<h4 className='mb-2'>Giá</h4>
							<input
								type='range'
								className='form-range w-100'
								id='rangeInput'
								name='rangeInput'
								min='0'
								max='500'
								defaultValue='0'
								onInput={(e) => {
									const out = document.getElementById("amount");
									if (out) out.value = e.target.value;
								}}
							/>
							<output id='amount' name='amount' min='0' max='500'>
								0
							</output>
						</div>

						{/* Product Color */}
						<div className='product-color mb-3'>
							<h4>Chọn theo màu</h4>
							<ul className='list-unstyled'>
								<li>
									<div className='product-color-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Vàng
										</a>
										<span>(1)</span>
									</div>
								</li>
								<li>
									<div className='product-color-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Xanh lá
										</a>
										<span>(1)</span>
									</div>
								</li>
								<li>
									<div className='product-color-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Trắng
										</a>
										<span>(1)</span>
									</div>
								</li>
							</ul>
						</div>

						{/* Chọn theo danh mục */}
						<div className='additional-product mb-4'>
							<h4>Chọn theo danh mục</h4>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-1'
									name='Categories'
									value='Phụ kiện'
								/>
								<label htmlFor='Categories-1' className='text-dark'>
									{" "}
									Phụ kiện
								</label>
							</div>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-2'
									name='Categories'
									value='Electronics & Computer'
								/>
								<label htmlFor='Categories-2' className='text-dark'>
									{" "}
									Điện tử &amp; Máy tính
								</label>
							</div>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-3'
									name='Categories'
									value='Laptops & Desktops'
								/>
								<label htmlFor='Categories-3' className='text-dark'>
									{" "}
									Laptop &amp; Máy tính để bàn
								</label>
							</div>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-4'
									name='Categories'
									value='Mobiles & Tablets'
								/>
								<label htmlFor='Categories-4' className='text-dark'>
									{" "}
									Điện thoại &amp; Máy tính bảng
								</label>
							</div>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-5'
									name='Categories'
									value='Điện thoại & TV th?ng minh'
								/>
								<label htmlFor='Categories-5' className='text-dark'>
									{" "}
									Điện thoại &amp; TV th?ng minh
								</label>
							</div>
						</div>

						{/* Featured Product */}
						<div className='featured-product mb-4'>
							<h4 className='mb-3'>Sản phẩm nổi bật</h4>

							<div className='featured-product-item'>
								<div className='rounded me-4' style={{ width: 100, height: 100 }}>
									<img
										src='/img/product-3.png'
										className='img-fluid rounded'
										alt='Image'
									/>
								</div>
								<div>
									<h6 className='mb-2'>Điện thoại</h6>
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
								<div className='rounded me-4' style={{ width: 100, height: 100 }}>
									<img
										src='/img/product-4.png'
										className='img-fluid rounded'
										alt='Image'
									/>
								</div>
								<div>
									<h6 className='mb-2'>Camera thông minh</h6>
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
								<div className='rounded me-4' style={{ width: 100, height: 100 }}>
									<img
										src='/img/product-5.png'
										className='img-fluid rounded'
										alt='Image'
									/>
								</div>
								<div>
									<h6 className='mb-2'>Ống kính camera</h6>
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
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									Mới
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									thương hiệu
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									đen
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									trắng
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									máy tính bảng
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									Điện thoại
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									camera
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									drone
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									tivi
								</a>
								<a href='#' className='border rounded py-1 px-2 mb-2'>
									giảm giá
								</a>
							</div>
						</div>
					</div>

					{/* Main content */}
					<div className='col-lg-9 wow fadeInUp' data-wow-delay='0.1s'>
						<div className='rounded mb-4 position-relative'>
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
						</div>

						<div className='row g-4'>
							<div className='col-xl-7'>
								<div className='input-group w-100 mx-auto d-flex'>
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
							</div>

							<div className='col-xl-3 text-end'>
								<div className='bg-light ps-3 py-3 rounded d-flex justify-content-between'>
									<label htmlFor='electronics'>Sắp xếp:</label>
									<select
										id='electronics'
										name='electronicslist'
										className='border-0 form-select-sm bg-light me-3'>
										<option value='default'>Mặc định</option>
										<option value='nothing'>Không sắp xếp</option>
										<option value='popularity'>Phổ biến</option>
										<option value='newness'>Mới nh?t</option>
										<option value='rating'>Đánh giá</option>
										<option value='lowtohigh'>Giá tăng dần</option>
										<option value='hightolow'>Giá giảm dần</option>
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
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
