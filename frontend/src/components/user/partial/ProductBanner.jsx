export default function ProductBanner() {
	return (
		<>
			{/* Product Banner Start */}
			<div className='container-fluid py-5'>
				<div className='container'>
					<div className='row g-4'>
						<div className='col-lg-6 wow fadeInLeft' data-wow-delay='0.1s'>
							<div style={{ cursor: "pointer" }}>
								<div className='bg-primary rounded position-relative'>
									<img
										src='/img/product-banner.jpg'
										className='img-fluid w-100 rounded'
										alt=''
									/>
									<div
										className='position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center rounded p-4'
										style={{ background: "rgba(255, 255, 255, 0.5)" }}>
										<h3 className='display-5 text-primary'>
											EOS Rebel <br /> <span>T7i Kit</span>
										</h3>
										<p className='fs-4 text-muted'>$899.99</p>
										<a
											href='#'
											className='btn btn-primary rounded-pill align-self-start py-2 px-4'>
											Shop Now
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className='col-lg-6 wow fadeInRight' data-wow-delay='0.2s'>
							<div style={{ cursor: "pointer" }}>
								<div className='text-center bg-primary rounded position-relative'>
									<img
										src='/img/product-banner-2.jpg'
										className='img-fluid w-100'
										alt=''
									/>
									<div
										className='position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center rounded p-4'
										style={{ background: "rgba(242, 139, 0, 0.5)" }}>
										<h2 className='display-2 text-secondary'>SALE</h2>
										<h4 className='display-5 text-white mb-4'>
											Get UP To 50% Off
										</h4>
										<a
											href='#'
											className='btn btn-secondary rounded-pill align-self-center py-2 px-4'>
											Shop Now
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Product Banner End */}
		</>
	);
}
