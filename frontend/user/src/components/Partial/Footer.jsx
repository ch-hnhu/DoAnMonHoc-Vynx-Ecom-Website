export default function Footer() {
	return (
		<>
			{/* Footer Start */}
			<div className='container-fluid footer py-5 wow fadeIn' data-wow-delay='0.2s'>
				<div className='container py-5'>
					<div
						className='row g-4 rounded mb-5'
						style={{ background: "rgba(255, 255, 255, .03)" }}>
						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='rounded p-4'>
								<div
									className='rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4'
									style={{ width: 70, height: 70 }}>
									<i className='fas fa-map-marker-alt fa-2x text-primary'></i>
								</div>
								<div>
									<h4 className='text-white'>Địa chỉ</h4>
									<p className='mb-2'>123 Street New York.USA</p>
								</div>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='rounded p-4'>
								<div
									className='rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4'
									style={{ width: 70, height: 70 }}>
									<i className='fas fa-envelope fa-2x text-primary'></i>
								</div>
								<div>
									<h4 className='text-white'>Email</h4>
									<p className='mb-2'>info@example.com</p>
								</div>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='rounded p-4'>
								<div
									className='rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4'
									style={{ width: 70, height: 70 }}>
									<i className='fa fa-phone-alt fa-2x text-primary'></i>
								</div>
								<div>
									<h4 className='text-white'>Điện thoại</h4>
									<p className='mb-2'>(+012) 3456 7890</p>
								</div>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='rounded p-4'>
								<div
									className='rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4'
									style={{ width: 70, height: 70 }}>
									<i className='fab fa-firefox-browser fa-2x text-primary'></i>
								</div>
								<div>
									<h4 className='text-white'>Yoursite@ex.com</h4>
									<p className='mb-2'>(+012) 3456 7890</p>
								</div>
							</div>
						</div>
					</div>

					<div className='row g-5'>
						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='footer-item d-flex flex-column'>
								<div className='footer-item'>
									<h4 className='text-primary mb-4'>Bản tin</h4>

									{/* ✅ Template gốc: không có text-white */}
									<p className='mb-3'>
										Đăng ký để nhận tin mới nhất về sản phẩm, ưu đãi và các
										chương trình đặc biệt từ Electro.
									</p>

									<div className='position-relative mx-auto rounded-pill'>
										<input
											className='form-control rounded-pill w-100 py-3 ps-4 pe-5'
											type='text'
											placeholder='Nhập email của bạn'
										/>
										<button
											type='button'
											className='btn btn-primary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2'>
											Đăng ký
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='footer-item d-flex flex-column'>
								<h4 className='text-primary mb-4'>Chăm sóc khách hàng</h4>
								<a href='/lien-he'>
									<i className='fas fa-angle-right me-2'></i> Liên hệ
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Đổi trả
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Lịch sử đơn hàng
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Sơ đồ website
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Đánh giá
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Tài khoản của tôi
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Hủy nhận thông báo
								</a>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='footer-item d-flex flex-column'>
								<h4 className='text-primary mb-4'>Thông tin</h4>
								<a href='/ve-chung-toi'>
									<i className='fas fa-angle-right me-2'></i> Về chúng tôi
								</a>
								<a href='/chinh-sach-van-chuyen'>
									<i className='fas fa-angle-right me-2'></i> Chính sách vận
									chuyển
								</a>
								<a href='/chinh-sach-bao-mat'>
									<i className='fas fa-angle-right me-2'></i> Chính sách bảo mật
								</a>
								<a href='/dieu-khoan'>
									<i className='fas fa-angle-right me-2'></i> Điều khoản &amp;
									điều kiện
								</a>
								<a href='/chinh-sach-bao-hanh'>
									<i className='fas fa-angle-right me-2'></i> Bảo hành
								</a>
								<a href='/cau-hoi-thuong-gap'>
									<i className='fas fa-angle-right me-2'></i> Câu hỏi thường gặp
								</a>
								<a href='http://localhost:5174/dang-nhap'>
									<i className='fas fa-angle-right me-2'></i> Đăng nhập quản trị
								</a>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='footer-item d-flex flex-column'>
								<h4 className='text-primary mb-4'>Tiện ích</h4>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Thương hiệu
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Phiếu quà tặng
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Đối tác liên kết
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Yêu thích
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Lịch sử đơn hàng
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Theo dõi đơn hàng
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Tra cứu bảo hành
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Footer End */}

			{/* Copyright Start */}
			<div className='container-fluid copyright py-4'>
				<div className='container'>
					<div className='row g-4 align-items-center'>
						<div className='col-md-6 text-center text-md-start mb-md-0'>
							<span className='text-white'>
								<a href='#' className='border-bottom text-white'>
									<i className='fas fa-copyright text-light me-2'></i>Tên website
								</a>
								, Đã đăng ký bản quyền.
							</span>
						</div>

						<div className='col-md-6 text-center text-md-end text-white'>
							Thiết kế bởi{" "}
							<a className='border-bottom text-white' href='https://htmlcodex.com'>
								HTML Codex
							</a>
							. Phân phối bởi{" "}
							<a className='border-bottom text-white' href='https://themewagon.com'>
								ThemeWagon
							</a>
							.
						</div>
					</div>
				</div>
			</div>
			{/* Copyright End */}

			{/* Back to Top */}
			<a href='#' className='btn btn-primary btn-lg-square back-to-top'>
				<i className='fa fa-arrow-up'></i>
			</a>
		</>
	);
}
