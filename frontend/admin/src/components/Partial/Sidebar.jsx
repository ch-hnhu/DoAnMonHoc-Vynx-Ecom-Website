export default function Sidebar() {
	return (
		<aside className='app-sidebar bg-body-secondary shadow' data-bs-theme='dark'>
			<div className='sidebar-brand'>
				<a href='#' className='brand-link'>
					<img
						src='/assets/img/AdminLTELogo.png'
						alt='AdminLTE Logo'
						className='brand-image opacity-75 shadow'
					/>
					<span className='brand-text fw-light'>AdminLTE 4</span>
				</a>
			</div>

			<div className='sidebar-wrapper'>
				<nav className='mt-2'>
					<ul
						className='nav sidebar-menu flex-column'
						data-lte-toggle='treeview'
						role='navigation'
						aria-label='Main navigation'
						data-accordion='false'
						id='navigation'>
						<li className='nav-item menu-open'>
							<a href='#' className='nav-link active'>
								<i className='nav-icon bi bi-speedometer'></i>
								<p>
									Dashboard
									<i className='nav-arrow bi bi-chevron-right'></i>
								</p>
							</a>
							<ul className='nav nav-treeview'>
								<li className='nav-item'>
									<a href='/' className='nav-link active'>
										<i className='nav-icon bi bi-circle'></i>
										<p>Dashboard v1</p>
									</a>
								</li>
								<li className='nav-item'>
									<a href='/table' className='nav-link'>
										<i className='nav-icon bi bi-circle'></i>
										<p>Dashboard v2</p>
									</a>
								</li>
								<li className='nav-item'>
									<a href='./index3.html' className='nav-link'>
										<i className='nav-icon bi bi-circle'></i>
										<p>Dashboard v3</p>
									</a>
								</li>
							</ul>
						</li>

						<li className='nav-item'>
							<a href='/products' className='nav-link'>
								<i className='nav-icon bi bi-box-seam' />
								<p>Products</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-receipt' />
								<p>Orders</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-people' />
								<p>Users</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-grid' />
								<p>Categories</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-tags' />
								<p>Brands</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-sliders' />
								<p>Attributes</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-chat-left-text' />
								<p>Reviews</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-ticket-perforated' />
								<p>Coupons</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link'>
								<i className='nav-icon bi bi-gear' />
								<p>Settings</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='#' className='nav-link text-danger'>
								<i className='nav-icon bi bi-box-arrow-right text-danger' />
								<p>Logout</p>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	);
}
