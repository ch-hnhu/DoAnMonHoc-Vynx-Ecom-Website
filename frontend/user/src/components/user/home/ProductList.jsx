export default function ProductList() {
	return (
		<>
			{/* Product List Start */}
			<div className='container-fluid products productList overflow-hidden'>
				<div className='container products-mini py-5'>
					<div className='mx-auto text-center mb-5' style={{ maxWidth: "900px" }}>
						<h4
							className='text-primary border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp'
							data-wow-delay='0.1s'>
							Products
						</h4>
						<h1 className='mb-0 display-3 wow fadeInUp' data-wow-delay='0.3s'>
							All Product Items
						</h1>
					</div>
					<div
						className='productList-carousel owl-carousel pt-4 wow fadeInUp'
						data-wow-delay='0.3s'>
						<div className='productImg-carousel owl-carousel productList-item'>
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-4.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-4.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-6.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-7.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='productImg-carousel owl-carousel productList-item'>
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-8.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-9.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-10.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-11.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='productImg-carousel owl-carousel productList-item'>
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-12.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-13.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-14.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-15.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='productImg-carousel owl-carousel productList-item'>
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-16.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
								<div className='row g-0'>
									<div className='col-5'>
										<div className='products-mini-img border-end h-100'>
											<img
												src='/img/product-17.png'
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
							<div className='productImg-item products-mini-item border'>
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
											<span className='text-primary fs-5'>$1,050.00</span>
										</div>
									</div>
								</div>
								<div className='products-mini-add border p-3'>
									<a
										href='#'
										className='btn btn-primary border-secondary rounded-pill py-2 px-4'>
										<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
					</div>
				</div>
			</div>
			{/* Product List End */}
		</>
	);
}
