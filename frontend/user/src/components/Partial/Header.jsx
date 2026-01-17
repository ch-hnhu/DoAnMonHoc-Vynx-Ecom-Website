import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Header() {
	const [configuration, setConfiguration] = useState({});

	useEffect(() => {
		api.get("/configuration").then((res) => {
			setConfiguration(res.data.data[0]);
		});
	}, []);

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
								<a href='/ve-chung-toi' className='text-muted me-2'>
									Về chúng tôi
								</a>
								<small> / </small>
								<a href='/cau-hoi-thuong-gap' className='text-muted mx-2'>
									Câu hỏi thường gặp
								</a>
								<small> / </small>
								<a href='/lien-he' className='text-muted ms-2'>
									Liên hệ
								</a>
							</div>
						</div>

						<div className='col-lg-4 text-center d-flex align-items-center justify-content-center'>
							<small className='text-dark'>Liên hệ:</small>
							<a href={`tel:${configuration?.phone}`} className='text-muted ms-1'>
								{configuration?.phone}
							</a>
						</div>

						<div className='col-lg-4 text-center text-lg-end'>
							<div
								className='d-inline-flex align-items-center'
								style={{ height: 45 }}>
								<div className='dropdown'>
									<a
										href='#'
										className='dropdown-toggle text-muted ms-2'
										data-bs-toggle='dropdown'>
										<small>
											<i className='fa fa-home me-2'></i> Trang chủ
										</small>
									</a>
									<div className='dropdown-menu rounded'>
										<a href='/dang-nhap' className='dropdown-item'>
											Đăng nhập
										</a>
										<a href='/wishlist' className='dropdown-item'>
											Wishlist
										</a>
										<a href='/gio-hang' className='dropdown-item'>
											Giỏ hàng
										</a>
										<a href='/tai-khoan' className='dropdown-item'>
											Tài khoản
										</a>
										<a href='/dang-xuat' className='dropdown-item'>
											Đăng xuất
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
									<img
										src={
											configuration?.logo ||
											"../../../public/img/vynx-logo.png"
										}
										alt='Logo'
										style={{ height: 110, width: "auto" }}
									/>
								</a>
							</div>
						</div>

						<div className='col-md-4 col-lg-6 text-center'>
							<div className='position-relative ps-4'>
								<div className='d-flex border rounded-pill'>
									<input
										className='form-control border-0 rounded-pill w-100 py-3'
										type='text'
										placeholder='Tìm kiếm'
									/>
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
									href='/wishlist'
									className='text-muted d-flex align-items-center justify-content-center me-3'>
									<span className='rounded-circle btn-md-square border'>
										<i className='fas fa-heart'></i>
									</span>
									<span className='text-dark ms-2'>Wishlist</span>
								</a>

								<a
									href='gio-hang'
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
