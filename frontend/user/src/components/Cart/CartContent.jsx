import { useMemo } from "react";
import { useCart } from "./CartContext.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { getFinalPrice } from "@shared/utils/productHelper.jsx";

export default function CartContent() {
	const { items, updateQuantity, removeFromCart, subtotal } = useCart();

	const total = useMemo(() => subtotal, [subtotal]);

	if (!items.length) {
		return (
			<div className='container-fluid py-5'>
				<div className='container py-5 text-center'>
					<h4 className='mb-3'>Giỏ hàng đang trống</h4>
					<a href='/san-pham' className='btn btn-primary rounded-pill px-4 py-3'>
						Tiếp tục mua sắm
					</a>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Cart Content */}
			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='table-responsive'>
						<table className='table'>
							<thead>
								<tr>
									<th>Tên sản phẩm</th>
									<th>Giá</th>
									<th>Số lượng</th>
									<th>Thành tiền</th>
									<th>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{items.map((item) => {
									const price = getFinalPrice(item.product);
									return (
										<tr key={item.product.id}>
											<th>
												<p className='mb-0 py-4'>{item.product.name}</p>
											</th>
											<td>
												<p className='mb-0 py-4'>{formatCurrency(price)}</p>
											</td>
											<td>
												<div
													className='input-group quantity py-4'
													style={{ width: "100px" }}>
													<button
														className='btn btn-sm btn-minus rounded-circle bg-light border'
														type='button'
														onClick={() =>
															updateQuantity(item.product.id, item.quantity - 1)
														}>
														<i className='fa fa-minus'></i>
													</button>

													<input
														type='text'
														className='form-control form-control-sm text-center border-0'
														value={item.quantity}
														readOnly
													/>

													<button
														className='btn btn-sm btn-plus rounded-circle bg-light border'
														type='button'
														onClick={() =>
															updateQuantity(item.product.id, item.quantity + 1)
														}>
														<i className='fa fa-plus'></i>
													</button>
												</div>
											</td>
											<td>
												<p className='mb-0 py-4'>
													{formatCurrency(price * item.quantity)}
												</p>
											</td>
											<td className='py-4'>
												<button
													className='btn btn-md rounded-circle bg-light border'
													type='button'
													onClick={() => removeFromCart(item.product.id)}>
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
							placeholder='Mã giảm giá'
						/>
						<button className='btn btn-primary rounded-pill px-4 py-3'>
							Áp dụng
						</button>
					</div>

					{/* Cart Total */}
					<div className='row g-4 justify-content-end'>
						<div className='col-sm-8 col-md-7 col-lg-6 col-xl-4'>
							<div className='bg-light rounded'>
								<div className='p-4'>
									<h1 className='display-6 mb-4'>
										<span className='fw-normal'>Tổng thành tiền</span>
									</h1>

									<div className='d-flex justify-content-between mb-4'>
										<h5>Tạm tính:</h5>
										<p>{formatCurrency(subtotal)}</p>
									</div>

									<div className='d-flex justify-content-between'>
										<h5>Vận chuyển</h5>
										<p>{formatCurrency(0)}</p>
									</div>

									<p className='mb-0 text-end'>Tính phí khi thanh toán.</p>
								</div>

								<div className='py-4 mb-4 border-top border-bottom d-flex justify-content-between'>
									<h5 className='mb-0 ps-4'>Tổng cộng</h5>
									<p className='mb-0 pe-4'>{formatCurrency(total)}</p>
								</div>

								<a
									href='/thanh-toan'
									className='btn btn-primary rounded-pill px-4 py-3 text-uppercase mb-4 ms-4'>
									Thanh toán
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
