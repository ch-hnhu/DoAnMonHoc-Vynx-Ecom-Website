import React, { useEffect } from "react";

export default function RelatedProducts() {
	useEffect(() => {
		// Call the carousel init function from main.js
		if (window.initCarousels?.related) {
			window.initCarousels.related();
		}
	}, []);

	return (
		<>
			<div className='container-fluid related-product'>
				<div className='container'>
					<div className='mx-auto text-center pb-5' style={{ maxWidth: 700 }}>
						<h4
							className='text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp'
							data-wow-delay='0.1s'>
							Related Products
						</h4>
						<p className='wow fadeInUp' data-wow-delay='0.2s'>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi,
							asperiores ducimus sint quos tempore officia similique quia? Libero,
							pariatur consectetur?
						</p>
					</div>
					<div className='related-carousel owl-carousel pt-4'>
						<div className='related-item rounded'>
							<div className='related-item-inner border rounded'>
								<div className='related-item-inner-item'>
									<img
										src='/img/product-3.png'
										className='img-fluid w-100 rounded-top'
										alt=''
									/>
									<div className='related-new'>New</div>
									<div className='related-details'>
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
									<span className='text-primary fs-5'>$1,050.00</span>
								</div>
							</div>
							<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
								<a
									href='#'
									className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
									<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='related-item rounded'>
							<div className='related-item-inner border rounded'>
								<div className='related-item-inner-item'>
									<img
										src='/img/product-3.png'
										className='img-fluid w-100 rounded-top'
										alt=''
									/>
									<div className='related-new'>New</div>
									<div className='related-details'>
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
									<span className='text-primary fs-5'>$1,050.00</span>
								</div>
							</div>
							<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
								<a
									href='#'
									className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
									<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='related-item rounded'>
							<div className='related-item-inner border rounded'>
								<div className='related-item-inner-item'>
									<img
										src='/img/product-3.png'
										className='img-fluid w-100 rounded-top'
										alt=''
									/>
									<div className='related-new'>New</div>
									<div className='related-details'>
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
									<span className='text-primary fs-5'>$1,050.00</span>
								</div>
							</div>
							<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
								<a
									href='#'
									className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
									<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='related-item rounded'>
							<div className='related-item-inner border rounded'>
								<div className='related-item-inner-item'>
									<img
										src='/img/product-3.png'
										className='img-fluid w-100 rounded-top'
										alt=''
									/>
									<div className='related-new'>New</div>
									<div className='related-details'>
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
									<span className='text-primary fs-5'>$1,050.00</span>
								</div>
							</div>
							<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
								<a
									href='#'
									className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
									<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
						<div className='related-item rounded'>
							<div className='related-item-inner border rounded'>
								<div className='related-item-inner-item'>
									<img
										src='/img/product-3.png'
										className='img-fluid w-100 rounded-top'
										alt=''
									/>
									<div className='related-new'>New</div>
									<div className='related-details'>
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
									<span className='text-primary fs-5'>$1,050.00</span>
								</div>
							</div>
							<div className='related-item-add border border-top-0 rounded-bottom text-center p-4 pt-0'>
								<a
									href='#'
									className='btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4'>
									<i className='fas fa-shopping-cart me-2'></i> Add To Cart
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
				</div>
			</div>
		</>
	);
}
