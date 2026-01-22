import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, Routes, Route, Navigate } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import Orders from "./Orders";
import Reviews from "./Reviews";

export default function Account() {
	const location = useLocation();
	const [isReviewOpen, setIsReviewOpen] = useState(false);

	const isActive = (path) => {
		return location.pathname === path ? "active" : "";
	};

	const isReviewActive = () => {
		return location.pathname.includes("/tai-khoan/danh-gia") ? "active" : "";
	};

	return (
		<>
			<Helmet>
				<title>VYNX | TÀI KHOẢN</title>
			</Helmet>

			<div className='container-fluid py-5'>
				<div className='container'>
					<div className='row'>
						{/* Sidebar */}
						<div className='col-lg-3 col-md-4 mb-4'>
							<div className='card border-0 shadow-sm'>
								<div className='card-body p-0'>
									<div className='list-group list-group-flush'>
										{/* Thông tin cá nhân */}
										<Link
											to='/tai-khoan/thong-tin'
											className={`list-group-item list-group-item-action border-0 ${isActive(
												"/tai-khoan/thong-tin",
											)}`}>
											<i className='fas fa-user me-2'></i>
											Thông tin cá nhân
										</Link>

										{/* Danh sách yêu thích */}
										<Link
											to='/wishlist'
											className={`list-group-item list-group-item-action border-0 ${isActive(
												"/wishlist",
											)}`}>
											<i className='fas fa-heart me-2'></i>
											Danh sách yêu thích
										</Link>

										{/* Đơn mua */}
										<Link
											to='/tai-khoan/don-mua'
											className={`list-group-item list-group-item-action border-0 ${isActive(
												"/tai-khoan/don-mua",
											)}`}>
											<i className='fas fa-shopping-bag me-2'></i>
											Đơn mua
										</Link>

										{/* Đánh giá */}
										<div>
											<button
												className={`list-group-item list-group-item-action border-0 w-100 text-start d-flex justify-content-between align-items-center ${isReviewActive()}`}
												onClick={() => setIsReviewOpen(!isReviewOpen)}>
												<span>
													<i className='fas fa-star me-2'></i>
													Đánh giá
												</span>
												<i
													className={`fas fa-chevron-${isReviewOpen ? "down" : "right"
														} text-muted`}></i>
											</button>

											{/* Submenu Đánh giá */}
											{isReviewOpen && (
												<div className='ps-4'>
													<Link
														to='/tai-khoan/danh-gia/da-danh-gia'
														className={`list-group-item list-group-item-action border-0 ${isActive(
															"/tai-khoan/danh-gia/da-danh-gia",
														)}`}>
														<i className='fas fa-check-circle me-2 text-success'></i>
														Đã đánh giá
													</Link>
													<Link
														to='/tai-khoan/danh-gia/chua-danh-gia'
														className={`list-group-item list-group-item-action border-0 ${isActive(
															"/tai-khoan/danh-gia/chua-danh-gia",
														)}`}>
														<i className='fas fa-clock me-2 text-warning'></i>
														Chưa đánh giá
													</Link>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Nội dung bên phải */}
						<div className='col-lg-9 col-md-8'>
							<Routes>
								{/* Redirect mặc định đến thông tin cá nhân */}
								<Route index element={<Navigate to='thong-tin' replace />} />

								{/* Route cho thông tin cá nhân */}
								<Route path='thong-tin' element={<PersonalInfo />} />

								{/* Route cho đơn mua */}
								<Route path='don-mua' element={<Orders />} />

								{/* Route cho đ/gia (bao gồm cả sub-routes) */}
								<Route path='danh-gia/*' element={<Reviews />} />
							</Routes>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.list-group-item.active {
					background-color: #007bff;
					color: white;
					border-color: #007bff;
				}

				.list-group-item:hover {
					background-color: #f8f9fa;
				}

				.list-group-item.active:hover {
					background-color: #0056b3;
				}

				.list-group-item {
					transition: all 0.3s ease;
				}
			`}</style>
		</>
	);
}
