import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { API_BASE_URL } from "../../config/api";
export default function Footer() {
	const [companyProfile, setCompanyProfile] = useState(null);

	useEffect(() => {
		let isMounted = true;

		api.get("/configuration")
			.then((response) => {
				const configurations = response?.data?.data ?? [];
				const activeConfig = configurations.find((item) => item.is_active);

				if (isMounted) {
					setCompanyProfile(activeConfig || null);
				}
			})
			.catch(() => {
				if (isMounted) {
					setCompanyProfile(null);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const companyAddress = companyProfile?.address || "Đang cập nhật";
	const companyEmail = companyProfile?.email || "Đang cập nhật";
	const companyPhone = companyProfile?.phone || "Đang cập nhật";
	// Xử lý logo 
	const footerLogoUrl = (() => {
		const logo = companyProfile?.logo;
		if (!logo) return "/img/vynx-logo.png";
		if (/^https?:\/\//i.test(logo) || logo.startsWith("data:")) return logo;
		const base = API_BASE_URL.replace(/\/api\/?$/, "");
		if (logo.startsWith("/")) return `${base}${logo}`;
		return `${base}/${logo}`;
	})();

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
									<p className='mb-2'>{companyAddress}</p>
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
									<p className='mb-2'>{companyEmail}</p>
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
									<p className='mb-2'>{companyPhone}</p>
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
									<h4 className='text-white'>Website</h4>
									<p className='mb-2'>www.vynx.com</p>
								</div>
							</div>
						</div>
					</div>

					<div className='row g-5'>
						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='footer-item d-flex flex-column'>
								<div className='footer-item'>
									<img
										src={footerLogoUrl}
										alt='Vynx Logo'
										className='footer-logo mb-3'
									/>
									<h4 className='text-primary mb-4'>Bảng tin</h4>

									<p className='mb-3'>
										Đăng ký nhận tin mới nhất về sản phẩm, ưu đãi và các chương trình đặc biệt
										từ Vynx E-Commerce
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
									<div className='d-flex align-items-center gap-3 mt-3'>
										<a
											href='https://www.facebook.com/dinhnguyenbatai'
											className='btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center'
											style={{ width: 36, height: 36 }}
											aria-label='Facebook'>
											<i className='fab fa-facebook-f' style={{ color: '#1877f2' }}></i>
										</a>
										<a
											href='https://zalo.me/0777365083'
											className='btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center'
											style={{ width: 36, height: 36 }}
											aria-label='Zalo'>
											<span className='fw-bold' style={{ fontSize: 13, color: '#0068ff' }}>
												Z
											</span>
										</a>
										<a
											href='https://youtube.com/@lctgroup1108?si=XMQ47H0t4tO5e3FZ'
											className='btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center'
											style={{ width: 36, height: 36 }}
											aria-label='YouTube'>
											<i className='fab fa-youtube' style={{ color: '#ff0000' }}></i>
										</a>
									</div>

								</div>
							</div>
						</div>

						<div className='col-md-6 col-lg-6 col-xl-3'>
							<div className='footer-item d-flex flex-column'>
								<h4 className='text-primary mb-4'>Chăm sóc khách hàng</h4>
								<Link to='/lien-he'>
									<i className='fas fa-angle-right me-2'></i> Liên hệ
								</Link>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Đổi trả
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Lịch sử đơn hàng
								</a>
								<a href='#'>
									<i className='fas fa-angle-right me-2'></i> Sử dụng website
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
								<Link to='/ve-chung-toi'>
									<i className='fas fa-angle-right me-2'></i> Về chúng tôi
								</Link>
								<Link to='/chinh-sach-van-chuyen'>
									<i className='fas fa-angle-right me-2'></i> Chính sách vận
									chuyển
								</Link>
								<Link to='/chinh-sach-bao-mat'>
									<i className='fas fa-angle-right me-2'></i> Chính sách bảo mật
								</Link>
								<Link to='/dieu-khoan'>
									<i className='fas fa-angle-right me-2'></i> Điều khoản &amp;
									điều kiện
								</Link>
								<Link to='/chinh-sach-bao-hanh'>
									<i className='fas fa-angle-right me-2'></i> Bảo hành
								</Link>
								<Link to='/cau-hoi-thuong-gap'>
									<i className='fas fa-angle-right me-2'></i> Câu hỏi thường gặp
								</Link>
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
						<div className='col-12 text-center'>
							<p className='text-white mb-1'>
								<i className='fas fa-copyright text-light me-2'></i>2026 Vynx E-Commerce. All rights
								reserved. Website thương mại điện tử chuyên cung cấp laptop và phụ kiện chính hãng.
							</p>
							<p className='text-white mb-0'>
								Mọi nội dung trên website thuộc quyền sở hữu của Vynx E-Commerce.
							</p>
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
