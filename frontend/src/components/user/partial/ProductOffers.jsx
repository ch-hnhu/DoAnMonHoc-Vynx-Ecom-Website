export default function ProductOffers() {
	return (
		<>
			{/* Products Offer Start */}
			<div className='container-fluid bg-light py-5'>
				<div className='container'>
					<div className='row g-4'>
						<div className='col-lg-6 wow fadeInLeft' data-wow-delay='0.2s'>
							<a
								href='#'
								className='d-flex align-items-center justify-content-between border bg-white rounded p-4'>
								<div>
									<p className='text-muted mb-3'>Find The Best Camera for You!</p>
									<h3 className='text-primary'>Smart Camera</h3>
									<h1 className='display-3 text-secondary mb-0'>
										40% <span className='text-primary fw-normal'>Off</span>
									</h1>
								</div>
								<img src='/img/product-1.png' className='img-fluid' alt='' />
							</a>
						</div>
						<div className='col-lg-6 wow fadeInRight' data-wow-delay='0.3s'>
							<a
								href='#'
								className='d-flex align-items-center justify-content-between border bg-white rounded p-4'>
								<div>
									<p className='text-muted mb-3'>
										Find The Best Whatches for You!
									</p>
									<h3 className='text-primary'>Smart Whatch</h3>
									<h1 className='display-3 text-secondary mb-0'>
										20% <span className='text-primary fw-normal'>Off</span>
									</h1>
								</div>
								<img src='/img/product-2.png' className='img-fluid' alt='' />
							</a>
						</div>
					</div>
				</div>
			</div>
			{/* Products Offer End */}
		</>
	);
}
