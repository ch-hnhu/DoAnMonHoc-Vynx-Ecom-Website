export default function Header() {
	return (
		<>
			{/* Topbar Start */}
			<div className='container-fluid p-0 d-none border-bottom d-lg-block'>
				<div className='px-5'>
					<div className='row gx-0 align-items-center'>
						<div className='col-lg-4 text-center text-lg-start mb-lg-0'>
							<div
								className='d-inline-flex align-items-center'
								style={{ height: 45 }}>
								<a href='#' className='text-muted me-2'>
									Help
								</a>
								<small> / </small>
								<a href='#' className='text-muted mx-2'>
									Support
								</a>
								<small> / </small>
								<a href='#' className='text-muted ms-2'>
									Contact
								</a>
							</div>
						</div>

						<div className='col-lg-4 text-center d-flex align-items-center justify-content-center'>
							<small className='text-dark'>Call Us:</small>
							<a href='#' className='text-muted ms-1'>
								(+012) 1234 567890
							</a>
						</div>

						<div className='col-lg-4 text-center text-lg-end'>
							<div
								className='d-inline-flex align-items-center'
								style={{ height: 45 }}>
								<div className='dropdown'>
									<a
										href='#'
										className='dropdown-toggle text-muted me-2'
										data-bs-toggle='dropdown'>
										<small>USD</small>
									</a>
									<div className='dropdown-menu rounded'>
										<a href='#' className='dropdown-item'>
											Euro
										</a>
										<a href='#' className='dropdown-item'>
											Dolar
										</a>
									</div>
								</div>

								<div className='dropdown'>
									<a
										href='#'
										className='dropdown-toggle text-muted mx-2'
										data-bs-toggle='dropdown'>
										<small>English</small>
									</a>
									<div className='dropdown-menu rounded'>
										<a href='#' className='dropdown-item'>
											English
										</a>
										<a href='#' className='dropdown-item'>
											Turkish
										</a>
										<a href='#' className='dropdown-item'>
											Spanol
										</a>
										<a href='#' className='dropdown-item'>
											Italiano
										</a>
									</div>
								</div>

								<div className='dropdown'>
									<a
										href='#'
										className='dropdown-toggle text-muted ms-2'
										data-bs-toggle='dropdown'>
										<small>
											<i className='fa fa-home me-2'></i> My Dashboard
										</small>
									</a>
									<div className='dropdown-menu rounded'>
										<a href='#' className='dropdown-item'>
											Login
										</a>
										<a href='#' className='dropdown-item'>
											Wishlist
										</a>
										<a href='#' className='dropdown-item'>
											My Card
										</a>
										<a href='#' className='dropdown-item'>
											Notifications
										</a>
										<a href='#' className='dropdown-item'>
											Account Settings
										</a>
										<a href='#' className='dropdown-item'>
											My Account
										</a>
										<a href='#' className='dropdown-item'>
											Log Out
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Header main */}
			<div className='container-fluid p-0 py-4 d-none d-lg-block'>
				<div className='px-5'>
					<div className='row gx-0 align-items-center text-center'>
						<div className='col-md-4 col-lg-3 text-center text-lg-start'>
							<div className='d-inline-flex align-items-center'>
								<a href='/' className='navbar-brand p-0'>
									<h1 className='display-5 text-primary m-0'>
										<i className='fas fa-shopping-bag text-secondary me-2'></i>
										Electro
									</h1>
								</a>
							</div>
						</div>

						<div className='col-md-4 col-lg-6 text-center'>
							<div className='position-relative ps-4'>
								<div className='d-flex border rounded-pill'>
									<input
										className='form-control border-0 rounded-pill w-100 py-3'
										type='text'
										placeholder='Search Looking For?'
									/>
									<select
										className='form-select text-dark border-0 border-start rounded-0 p-3'
										style={{ width: 200 }}
										defaultValue='All Category'>
										<option value='All Category'>All Category</option>
										<option value='Category 1'>Category 1</option>
										<option value='Category 2'>Category 2</option>
										<option value='Category 3'>Category 3</option>
										<option value='Category 4'>Category 4</option>
									</select>
									<button
										type='button'
										className='btn btn-primary rounded-pill py-3 px-5'
										style={{ border: 0 }}>
										<i className='fas fa-search'></i>
									</button>
								</div>
							</div>
						</div>

						<div className='col-md-4 col-lg-3 text-center text-lg-end'>
							<div className='d-inline-flex align-items-center'>
								<a
									href='#'
									className='text-muted d-flex align-items-center justify-content-center me-3'>
									<span className='rounded-circle btn-md-square border'>
										<i className='fas fa-random'></i>
									</span>
								</a>

								<a
									href='#'
									className='text-muted d-flex align-items-center justify-content-center me-3'>
									<span className='rounded-circle btn-md-square border'>
										<i className='fas fa-heart'></i>
									</span>
								</a>

								<a
									href='#'
									className='text-muted d-flex align-items-center justify-content-center'>
									<span className='rounded-circle btn-md-square border'>
										<i className='fas fa-shopping-cart'></i>
									</span>
									<span className='text-dark ms-2'>$0.00</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Topbar End */}
		</>
	);
}
