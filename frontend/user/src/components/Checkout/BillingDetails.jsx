import { useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useCart } from "../Cart/CartContext.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { getFinalPrice } from "@shared/utils/productHelper.jsx";
import { useToast } from "@shared/hooks/useToast.js";

const DEFAULT_FORM = {
	first_name: "",
	last_name: "",
	company: "",
	address: "",
	city: "",
	country: "",
	zip: "",
	phone: "",
	email: "",
	note: "",
};

export default function BillingDetails() {
	const { items, subtotal } = useCart();
	const { toast, showSuccess, showError, closeToast } = useToast();
	const [formData, setFormData] = useState(DEFAULT_FORM);
	const [shippingOption, setShippingOption] = useState("free");
	const [paymentMethod, setPaymentMethod] = useState("cod");

	const shippingFee = useMemo(() => {
		if (shippingOption === "flat") return 15000;
		if (shippingOption === "pickup") return 8000;
		return 0;
	}, [shippingOption]);

	const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!items.length) {
			showError("Giỏ hàng đang trống");
			return;
		}

		const orderItems = items.map((item) => ({
			product_id: item.product.id,
			name: item.product.name,
			quantity: item.quantity,
			price: getFinalPrice(item.product),
		}));

		const payload = {
			customer: { ...formData },
			shipping: {
				option: shippingOption,
				fee: shippingFee,
			},
			payment: {
				method: paymentMethod,
			},
			totals: {
				subtotal,
				shipping_fee: shippingFee,
				total,
			},
			items: orderItems,
		};

		console.log("Order payload:", payload);
		showSuccess("Tạo payload đặt hàng thành công");
	};

	return (
		<>
			<div className='container-fluid bg-light overflow-hidden py-5'>
				<div className='container py-5'>
					<h1 className='mb-4 wow fadeInUp' data-wow-delay='0.1s'>
						Thông tin thanh toán
					</h1>
					<form action='#' onSubmit={handleSubmit}>
						<div className='row g-5'>
							<div
								className='col-md-12 col-lg-6 col-xl-6 wow fadeInUp'
								data-wow-delay='0.1s'>
								<div className='row'>
									<div className='col-md-12 col-lg-6'>
										<div className='form-item w-100'>
											<label className='form-label my-3'>
												Họ<sup>*</sup>
											</label>
											<input
												type='text'
												className='form-control'
												name='first_name'
												value={formData.first_name}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='col-md-12 col-lg-6'>
										<div className='form-item w-100'>
											<label className='form-label my-3'>
												Tên<sup>*</sup>
											</label>
											<input
												type='text'
												className='form-control'
												name='last_name'
												value={formData.last_name}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Tên công ty<sup>*</sup>
									</label>
									<input
										type='text'
										className='form-control'
										name='company'
										value={formData.company}
										onChange={handleChange}
									/>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Địa chỉ <sup>*</sup>
									</label>
									<input
										type='text'
										className='form-control'
										placeholder='Số nhà, tên đường'
										name='address'
										value={formData.address}
										onChange={handleChange}
									/>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Quận/Huyện/Thành phố<sup>*</sup>
									</label>
									<input
										type='text'
										className='form-control'
										name='city'
										value={formData.city}
										onChange={handleChange}
									/>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Quốc gia<sup>*</sup>
									</label>
									<input
										type='text'
										className='form-control'
										name='country'
										value={formData.country}
										onChange={handleChange}
									/>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Mã bưu chính<sup>*</sup>
									</label>
									<input
										type='text'
										className='form-control'
										name='zip'
										value={formData.zip}
										onChange={handleChange}
									/>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Số điện thoại<sup>*</sup>
									</label>
									<input
										type='tel'
										className='form-control'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
									/>
								</div>
								<div className='form-item'>
									<label className='form-label my-3'>
										Email<sup>*</sup>
									</label>
									<input
										type='email'
										className='form-control'
										name='email'
										value={formData.email}
										onChange={handleChange}
									/>
								</div>
								<div className='form-check my-3'>
									<input
										type='checkbox'
										className='form-check-input'
										id='Account-1'
										name='Accounts'
										value='Accounts'
									/>
									<label className='form-check-label' htmlFor='Account-1'>
										Tạo tài khoản?
									</label>
								</div>
								<hr />
								<div className='form-check my-3'>
									<input
										className='form-check-input'
										type='checkbox'
										id='Address-1'
										name='Address'
										value='Address'
									/>
									<label className='form-check-label' htmlFor='Address-1'>
										Giao đến địa chỉ khác?
									</label>
								</div>
								<div className='form-item'>
									<textarea
										name='note'
										className='form-control'
										spellCheck='false'
										cols='30'
										rows='11'
										placeholder='Ghi chú đơn hàng (tùy chọn)'
										value={formData.note}
										onChange={handleChange}></textarea>
								</div>
							</div>
							<div
								className='col-md-12 col-lg-6 col-xl-6 wow fadeInUp'
								data-wow-delay='0.3s'>
								<div className='table-responsive'>
									<table className='table'>
										<thead>
											<tr className='text-center'>
												<th scope='col' className='text-start'>
													Sản phẩm
												</th>
												<th scope='col'>Giá</th>
												<th scope='col'>Số lượng</th>
												<th scope='col'>Thành tiền</th>
											</tr>
										</thead>
										<tbody>
											{items.length === 0 ? (
												<tr className='text-center'>
													<td colSpan='4' className='py-4 text-muted'>
														Giỏ hàng đang trống
													</td>
												</tr>
											) : (
												items.map((item) => {
													const price = getFinalPrice(item.product);
													return (
														<tr
															className='text-center'
															key={item.product.id}>
															<th
																scope='row'
																className='text-start py-4'>
																{item.product.name}
															</th>
															<td className='py-4'>
																{formatCurrency(price)}
															</td>
															<td className='py-4 text-center'>
																{item.quantity}
															</td>
															<td className='py-4'>
																{formatCurrency(
																	price * item.quantity
																)}
															</td>
														</tr>
													);
												})
											)}
											<tr>
												<th scope='row'></th>
												<td className='py-4'></td>
												<td className='py-4'>
													<p className='mb-0 text-dark py-2'>Tạm tính</p>
												</td>
												<td className='py-4'>
													<div className='py-2 text-center border-bottom border-top'>
														<p className='mb-0 text-dark'>
															{formatCurrency(subtotal)}
														</p>
													</div>
												</td>
											</tr>
											<tr>
												<th scope='row'></th>
												<td className='py-4'>
													<p className='mb-0 text-dark py-4'>
														Vận chuyển
													</p>
												</td>
												<td colSpan='2' className='py-4'>
													<div className='form-check text-start'>
														<input
															type='radio'
															className='form-check-input bg-primary border-0'
															id='Shipping-1'
															name='Shipping'
															value='free'
															checked={shippingOption === "free"}
															onChange={() =>
																setShippingOption("free")
															}
														/>
														<label
															className='form-check-label'
															htmlFor='Shipping-1'>
															Miễn phí
														</label>
													</div>
													<div className='form-check text-start'>
														<input
															type='radio'
															className='form-check-input bg-primary border-0'
															id='Shipping-2'
															name='Shipping'
															value='flat'
															checked={shippingOption === "flat"}
															onChange={() =>
																setShippingOption("flat")
															}
														/>
														<label
															className='form-check-label'
															htmlFor='Shipping-2'>
															Đồng giá: {formatCurrency(15000)}
														</label>
													</div>
													<div className='form-check text-start'>
														<input
															type='radio'
															className='form-check-input bg-primary border-0'
															id='Shipping-3'
															name='Shipping'
															value='pickup'
															checked={shippingOption === "pickup"}
															onChange={() =>
																setShippingOption("pickup")
															}
														/>
														<label
															className='form-check-label'
															htmlFor='Shipping-3'>
															Nhận tại cửa hàng:{" "}
															{formatCurrency(8000)}
														</label>
													</div>
												</td>
											</tr>
											<tr>
												<th scope='row'></th>
												<td className='py-4'>
													<p className='mb-0 text-dark text-uppercase py-2'>
														Tổng cộng
													</p>
												</td>
												<td className='py-4'></td>
												<td className='py-4'>
													<div className='py-2 text-center border-bottom border-top'>
														<p className='mb-0 text-dark'>
															{formatCurrency(total)}
														</p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div className='row g-0 text-center align-items-center justify-content-center border-bottom py-2'>
									<div className='col-12'>
										<div className='form-check text-start my-2'>
											<input
												type='radio'
												className='form-check-input bg-primary border-0'
												id='Transfer-1'
												name='Payment'
												value='bank_transfer'
												checked={paymentMethod === "bank_transfer"}
												onChange={() => setPaymentMethod("bank_transfer")}
											/>
											<label
												className='form-check-label'
												htmlFor='Transfer-1'>
												Chuyển khoản ngân hàng
											</label>
										</div>
										<p className='text-start text-dark'>
											Thanh toán trực tiếp vào tài khoản ngân hàng của chúng
											tôi. Vui lòng dùng mã đơn hàng làm nội dung chuyển
											khoản. Đơn hàng sẽ được xử lý sau khi hệ thống nhận được
											thanh toán.
										</p>
									</div>
								</div>
								<div className='row g-4 text-center align-items-center justify-content-center border-bottom py-2'>
									<div className='col-12'>
										<div className='form-check text-start my-2'>
											<input
												type='radio'
												className='form-check-input bg-primary border-0'
												id='Payments-1'
												name='Payment'
												value='check'
												checked={paymentMethod === "check"}
												onChange={() => setPaymentMethod("check")}
											/>
											<label
												className='form-check-label'
												htmlFor='Payments-1'>
												Thanh toán khi nhận hóa đơn
											</label>
										</div>
									</div>
								</div>
								<div className='row g-4 text-center align-items-center justify-content-center border-bottom py-2'>
									<div className='col-12'>
										<div className='form-check text-start my-2'>
											<input
												type='radio'
												className='form-check-input bg-primary border-0'
												id='Delivery-1'
												name='Payment'
												value='cod'
												checked={paymentMethod === "cod"}
												onChange={() => setPaymentMethod("cod")}
											/>
											<label
												className='form-check-label'
												htmlFor='Delivery-1'>
												Thanh toán khi nhận hàng (COD)
											</label>
										</div>
									</div>
								</div>
								<div className='row g-4 text-center align-items-center justify-content-center border-bottom py-2'>
									<div className='col-12'>
										<div className='form-check text-start my-2'>
											<input
												type='radio'
												className='form-check-input bg-primary border-0'
												id='Paypal-1'
												name='Payment'
												value='paypal'
												checked={paymentMethod === "paypal"}
												onChange={() => setPaymentMethod("paypal")}
											/>
											<label className='form-check-label' htmlFor='Paypal-1'>
												Paypal
											</label>
										</div>
									</div>
								</div>
								<div className='row g-4 text-center align-items-center justify-content-center pt-4'>
									<button
										type='submit'
										className='btn btn-primary border-secondary py-3 px-4 text-uppercase w-100 text-primary'>
										Đặt hàng
									</button>
								</div>
							</div>
						</div>
					</form>
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
		</>
	);
}
