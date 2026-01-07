export default function ShopPage() {
	return (
		<div className='container-fluid shop py-5'>
			<div className='container py-5'>
				<div className='row g-4'>
					{/* Sidebar */}
					<div className='col-lg-3 wow fadeInUp' data-wow-delay='0.1s'>
						<div className='product-categories mb-4'>
							<h4>Products Categories</h4>
							<ul className='list-unstyled'>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Accessories
										</a>
										<span>(3)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Electronics &amp; Computer
										</a>
										<span>(5)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>
											Laptops &amp; Desktops
										</a>
										<span>(2)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Mobiles &amp; Tablets
										</a>
										<span>(8)</span>
									</div>
								</li>
								<li>
									<div className='categories-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											SmartPhone &amp; Smart TV
										</a>
										<span>(5)</span>
									</div>
								</li>
							</ul>
						</div>

						{/* Price */}
						<div className='price mb-4'>
							<h4 className='mb-2'>Price</h4>
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
							<h4>Select By Color</h4>
							<ul className='list-unstyled'>
								<li>
									<div className='product-color-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Gold
										</a>
										<span>(1)</span>
									</div>
								</li>
								<li>
									<div className='product-color-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											Green
										</a>
										<span>(1)</span>
									</div>
								</li>
								<li>
									<div className='product-color-item'>
										<a href='#' className='text-dark'>
											<i className='fas fa-apple-alt text-secondary me-2'></i>{" "}
											White
										</a>
										<span>(1)</span>
									</div>
								</li>
							</ul>
						</div>

						{/* Additional Products */}
						<div className='additional-product mb-4'>
							<h4>Additional Products</h4>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-1'
									name='Categories'
									value='Accessories'
								/>
								<label htmlFor='Categories-1' className='text-dark'>
									{" "}
									Accessories
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
									Electronics &amp; Computer
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
									Laptops &amp; Desktops
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
									Mobiles &amp; Tablets
								</label>
							</div>

							<div className='additional-product-item'>
								<input
									type='radio'
									className='me-2'
									id='Categories-5'
									name='Categories'
									value='SmartPhone & Smart TV'
								/>
								<label htmlFor='Categories-5' className='text-dark'>
									{" "}
									SmartPhone &amp; Smart TV
								</label>
							</div>
						</div>

						{/* Featured Product */}
						<div className='featured-product mb-4'>
							<h4 className='mb-3'>Featured products</h4>

							<div className='featured-product-item'>
								<div className='rounded me-4' style={{ width: 100, height: 100 }}>
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
								<div className='rounded me-4' style={{ width: 100, height: 100 }}>
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
								<div className='rounded me-4' style={{ width: 100, height: 100 }}>
									<img
										src='/img/product-5.png'
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

							<div className='d-flex justify-content-center my-4'>
								<a
									href='#'
									className='btn btn-primary px-4 py-3 rounded-pill w-100'>
									Vew More
								</a>
							</div>
						</div>

						{/* Banner side */}
						<a href='#'>
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
									<h5 className='display-6 text-primary'>SALE</h5>
									<h4 className='text-secondary'>Get UP To 50% Off</h4>
									<a href='#' className='btn btn-primary rounded-pill px-4'>
										Shop Now
									</a>
								</div>
							</div>
						</a>

						{/* Tags */}
						<div className='product-tags py-4'>
							<h4 className='mb-3'>PRODUCT TAGS</h4>
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
								<h4 className='display-5 text-primary'>SALE</h4>
								<h3 className='display-4 text-white mb-4'>Get UP To 50% Off</h3>
								<a href='#' className='btn btn-primary rounded-pill'>
									Shop Now
								</a>
							</div>
						</div>

						<div className='row g-4'>
							<div className='col-xl-7'>
								<div className='input-group w-100 mx-auto d-flex'>
									<input
										type='search'
										className='form-control p-3'
										placeholder='keywords'
										aria-describedby='search-icon-1'
									/>
									<span id='search-icon-1' className='input-group-text p-3'>
										<i className='fa fa-search'></i>
									</span>
								</div>
							</div>

							<div className='col-xl-3 text-end'>
								<div className='bg-light ps-3 py-3 rounded d-flex justify-content-between'>
									<label htmlFor='electronics'>Sort By:</label>
									<select
										id='electronics'
										name='electronicslist'
										className='border-0 form-select-sm bg-light me-3'>
										<option value='default'>Default Sorting</option>
										<option value='nothing'>Nothing</option>
										<option value='popularity'>Popularity</option>
										<option value='newness'>Newness</option>
										<option value='rating'>Average Rating</option>
										<option value='lowtohigh'>Low to high</option>
										<option value='hightolow'>High to low</option>
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
									{/* Bạn có thể tách thành component ProductCard sau cho gọn */}
									<div className='col-lg-4'>
										<div
											className='product-item rounded wow fadeInUp'
											data-wow-delay='0.1s'>
											<div className='product-item-inner border rounded'>
												<div className='product-item-inner-item'>
													<img
														src='/img/product-3.png'
														className='img-fluid w-100 rounded-top'
														alt=''
													/>
													<div className='product-new'>New</div>
													<div className='product-details'>
														<a href='#'>
															<i className='fa fa-eye fa-1x'></i>
														</a>
													</div>
												</div>
												<div className='text-center rounded-bottom p-4'>
													<a href='#' className='d-block mb-2'>
														SmartPhone
													</a>
													<a href='#' className='d-block h4'>
														Apple iPad Mini <br /> G2356
													</a>
													<del className='me-2 fs-5'>$1,250.00</del>
													<span className='text-primary fs-5'>
														$1,050.00
													</span>
												</div>
											</div>
											<div className='product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
												<a
													href='#'
													className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
													<i className='fas fa-shopping-cart me-2'></i>{" "}
													Add To Cart
												</a>

												<div className='d-flex justify-content-between align-items-center'>
													<div className='d-flex'>
														<i className='fas fa-star text-primary'></i>
														<i className='fas fa-star text-primary'></i>
														<i className='fas fa-star text-primary'></i>
														<i className='fas fa-star text-primary'></i>
														<i className='fas fa-star'></i>
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
									</div>

									{/* Các card còn lại: giữ y chang, chỉ đổi class->className (như trên) */}
									{/* ... */}
									{/* Pagination */}
									<div className='col-12 wow fadeInUp' data-wow-delay='0.1s'>
										<div className='pagination d-flex justify-content-center mt-5'>
											<a href='#' className='rounded'>
												&laquo;
											</a>
											<a href='#' className='active rounded'>
												1
											</a>
											<a href='#' className='rounded'>
												2
											</a>
											<a href='#' className='rounded'>
												3
											</a>
											<a href='#' className='rounded'>
												4
											</a>
											<a href='#' className='rounded'>
												5
											</a>
											<a href='#' className='rounded'>
												6
											</a>
											<a href='#' className='rounded'>
												&raquo;
											</a>
										</div>
									</div>
								</div>
							</div>

							{/* List view */}
							<div id='tab-6' className='products tab-pane fade show p-0'>
								<div className='row g-4 products-mini'>
									{/* Mini item 1 */}
									<div className='col-lg-6'>
										<div className='products-mini-item border'>
											<div className='row g-0'>
												<div className='col-5'>
													<div className='products-mini-img border-end h-100'>
														<img
															src='/img/product-3.png'
															className='img-fluid w-100 h-100'
															alt='Image'
														/>
														<div className='products-mini-icon rounded-circle bg-primary'>
															<a href='#'>
																<i className='fa fa-eye fa-1x text-white'></i>
															</a>
														</div>
													</div>
												</div>
												<div className='col-7'>
													<div className='products-mini-content p-3'>
														<a href='#' className='d-block mb-2'>
															SmartPhone
														</a>
														<a href='#' className='d-block h4'>
															Apple iPad Mini <br /> G2356
														</a>
														<del className='me-2 fs-5'>$1,250.00</del>
														<span className='text-primary fs-5'>
															$1,050.00
														</span>
													</div>
												</div>
											</div>

											<div className='products-mini-add border p-3'>
												<a
													href='#'
													className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
													<i className='fas fa-shopping-cart me-2'></i>{" "}
													Add To Cart
												</a>
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

									{/* Các mini item còn lại tương tự */}
									{/* ... */}

									<div className='col-12 wow fadeInUp' data-wow-delay='0.1s'>
										<div className='pagination d-flex justify-content-center mt-5'>
											<a href='#' className='rounded'>
												&laquo;
											</a>
											<a href='#' className='active rounded'>
												1
											</a>
											<a href='#' className='rounded'>
												2
											</a>
											<a href='#' className='rounded'>
												3
											</a>
											<a href='#' className='rounded'>
												4
											</a>
											<a href='#' className='rounded'>
												5
											</a>
											<a href='#' className='rounded'>
												6
											</a>
											<a href='#' className='rounded'>
												&raquo;
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* End Tabs */}
					</div>
				</div>
			</div>
		</div>
	);
}
