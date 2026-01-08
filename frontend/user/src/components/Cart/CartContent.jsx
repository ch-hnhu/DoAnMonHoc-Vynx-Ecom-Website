export default function CartContent() {
	return (
		<>
			{/* Cart Content */}
			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='table-responsive'>
						<table className='table'>
							<thead>
								<tr>
									<th>Name</th>
									<th>Model</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Total</th>
									<th>Handle</th>
								</tr>
							</thead>
							<tbody>
								{[1, 2, 3].map(function (item) {
									return (
										<tr key={item}>
											<th>
												<p className='mb-0 py-4'>Apple iPad Mini</p>
											</th>
											<td>
												<p className='mb-0 py-4'>G2356</p>
											</td>
											<td>
												<p className='mb-0 py-4'>2.99 $</p>
											</td>
											<td>
												<div
													className='input-group quantity py-4'
													style={{ width: "100px" }}>
													<button className='btn btn-sm btn-minus rounded-circle bg-light border'>
														<i className='fa fa-minus'></i>
													</button>

													<input
														type='text'
														className='form-control form-control-sm text-center border-0'
														defaultValue='1'
													/>

													<button className='btn btn-sm btn-plus rounded-circle bg-light border'>
														<i className='fa fa-plus'></i>
													</button>
												</div>
											</td>
											<td>
												<p className='mb-0 py-4'>2.99 $</p>
											</td>
											<td className='py-4'>
												<button className='btn btn-md rounded-circle bg-light border'>
													<i className='fa fa-times text-danger'></i>
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Coupon */}
					<div className='mt-5'>
						<input
							type='text'
							className='border-0 border-bottom rounded me-5 py-3 mb-4'
							placeholder='Coupon Code'
						/>
						<button className='btn btn-primary rounded-pill px-4 py-3'>
							Apply Coupon
						</button>
					</div>

					{/* Cart Total */}
					<div className='row g-4 justify-content-end'>
						<div className='col-sm-8 col-md-7 col-lg-6 col-xl-4'>
							<div className='bg-light rounded'>
								<div className='p-4'>
									<h1 className='display-6 mb-4'>
										Cart <span className='fw-normal'>Total</span>
									</h1>

									<div className='d-flex justify-content-between mb-4'>
										<h5>Subtotal:</h5>
										<p>$96.00</p>
									</div>

									<div className='d-flex justify-content-between'>
										<h5>Shipping</h5>
										<p>Flat rate: $3.00</p>
									</div>

									<p className='mb-0 text-end'>Shipping to Ukraine.</p>
								</div>

								<div className='py-4 mb-4 border-top border-bottom d-flex justify-content-between'>
									<h5 className='mb-0 ps-4'>Total</h5>
									<p className='mb-0 pe-4'>$99.00</p>
								</div>

								<button
									className='btn btn-primary rounded-pill px-4 py-3 text-uppercase mb-4 ms-4'
									type='button'>
									Proceed Checkout
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
