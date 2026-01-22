import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import PageHeader from "../components/Partial/PageHeader";

export default function About() {
	const [companyProfile, setCompanyProfile] = useState(null);
	const [isLoadingCompany, setIsLoadingCompany] = useState(true);

	useEffect(() => {
		let isMounted = true;
		//Gọi api lấy thông tin công ty
		api.get("/configuration")
			.then((response) => {
				const configurations = response?.data?.data ?? [];
				//Lấy cấu hình công ty đang hoạt động
				const activeConfig = configurations.find((item) => item.is_active);

				if (isMounted) {
					setCompanyProfile(activeConfig || null);
				}
			})
			.catch(() => {
				if (isMounted) {
					setCompanyProfile(null);
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsLoadingCompany(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const companyInfoItems = companyProfile
		? [
			{ label: "Tên công ty", value: companyProfile.name },
			{ label: "Địa chỉ", value: companyProfile.address },
			{ label: "Hotline", value: companyProfile.phone },
			{ label: "Email", value: companyProfile.email },
		]
		: [];

	const title = "VỀ CHÚNG TÔI";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Về chúng tôi", active: true },
	];
	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<PageHeader title={title} breadcrumbs={breadcrumbs} />

			<style>{`
				.about-hero {
					background: linear-gradient(135deg, #f6f3eb 0%, #fef7e6 45%, #eef7ff 100%);
					border: 1px solid #f2d7a6;
				}
				.about-info-card {
					border: 1px solid #e6edf7;
					box-shadow: 0 10px 25px rgba(16, 24, 40, 0.08);
				}
				.about-badge {
					background: #1f5f8b;
					color: #ffffff;
				}
				.about-card {
					position: relative;
					overflow: hidden;
					border: 1px solid #e8edf4;
					box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
				}
				.about-card::before {
					content: "";
					position: absolute;
					inset: 0;
					background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
					opacity: 0.08;
				}
				.about-card h5,
				.about-card p {
					position: relative;
				}
				.about-card--teal {
					--accent-1: #0fa3b1;
					--accent-2: #b5e2fa;
				}
				.about-card--amber {
					--accent-1: #f28f3b;
					--accent-2: #f7d488;
				}
				.about-card--navy {
					--accent-1: #0b3142;
					--accent-2: #1f7a8c;
				}
				.about-timeline-card {
					border: 1px solid #e8edf4;
					background: #ffffff;
					box-shadow: 0 8px 20px rgba(16, 24, 40, 0.06);
				}
				.about-timeline-card--gold {
					background: linear-gradient(135deg, #fff5d6 0%, #fff1bf 100%);
					border-color: #f2c879;
				}
				.about-timeline-card--teal {
					background: linear-gradient(135deg, #e6fbf6 0%, #c9f3ea 100%);
					border-color: #7fd1c3;
				}
				.about-timeline-card--indigo {
					background: linear-gradient(135deg, #e8f1ff 0%, #d6e3ff 100%);
					border-color: #93b4f4;
				}
				.about-timeline-card--rose {
					background: linear-gradient(135deg, #ffe7ee 0%, #ffd2df 100%);
					border-color: #f1a7be;
				}
				.about-timeline-card .year {
					color: #d97706;
					font-weight: 700;
					letter-spacing: 0.04em;
				}
				.about-policy {
					background: linear-gradient(180deg, #f7f7fb 0%, #ffffff 100%);
					border: 1px solid #e8edf4;
				}
				.about-footer-card {
					border: 1px solid #e8edf4;
					box-shadow: 0 8px 20px rgba(16, 24, 40, 0.06);
				}
				@media (max-width: 991px) {
					.about-hero,
					.about-info-card {
						border-radius: 20px;
					}
				}
			`}</style>

			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='row g-4 align-items-center mb-5'>
						<div className='col-lg-6'>
							<div className='about-hero rounded p-4 p-lg-5 h-100'>
								<p className='text-uppercase text-primary mb-2'>Vynx E-commerce</p>
								<h2 className='mb-3'>
									Vynx: Nơi công nghệ phục vụ cuộc sống
								</h2>
								<p className='mb-4'>
									Vynx E-commerce được xây dựng với mục tiêu đơn giản: giúp bạn chọn đúng
									thiết bị, đúng nhu cầu, đúng ngân sách. Chúng tôi minh bạch từ
									vân đến hậu mãi, ưu tiên trải nghiệm bạn vang thay vì chạy theo
									xu hướng.


								</p>
								<div className='d-flex flex-wrap gap-3'>
									<div className='bg-white border rounded px-3 py-2'>
										<strong>10K+</strong> khách hàng hài lòng
									</div>
									<div className='bg-white border rounded px-3 py-2'>
										<strong>48h</strong> giao hàng nội thành
									</div>
									<div className='bg-white border rounded px-3 py-2'>
										<strong>100%</strong> hàng chính hãng
									</div>
								</div>
							</div>
						</div>
						<div className='col-lg-6'>
							<div className='about-info-card bg-white rounded p-4 p-lg-5 h-100'>
								<h5 className='mb-3'>Thông tin công ty</h5>
								{isLoadingCompany ? (
									<p className='mb-0 text-muted'>Đang tải thông tin...</p>
								) : companyInfoItems.length > 0 ? (
									<ul className='mb-4'>
										{companyInfoItems.map((item) => (
											<li key={item.label}>
												<strong>{item.label}:</strong> {item.value}
											</li>
										))}
									</ul>
								) : (
									<p className='mb-0 text-muted'>Thông tin đang được cập nhật.</p>
								)}
								<div className='d-flex flex-wrap gap-2'>
									<span className='badge about-badge'>Tư vấn 1:1</span>
									<span className='badge about-badge'>Bảo hành chính hãng</span>
									<span className='badge about-badge'>Kiểm tra miễn phí</span>
								</div>
							</div>
						</div>
					</div>

					<div className='row g-4 mb-5'>
						<div className='col-lg-4'>
							<div className='about-card about-card--teal rounded p-4 h-100'>
								<h5 className='mb-3'>Tầm nhận</h5>
								<p className='mb-0'>
									Trở thành điểm đến công nghệ đáng tin cậy với trải nghiệm mua
									sắm hiện đại, thân thiện và nhất quán.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='about-card about-card--amber rounded p-4 h-100'>
								<h5 className='mb-3'>Giá trị cốt lõi</h5>
								<p className='mb-0'>
									Chính trực, minh bạch về lấy khách hàng làm trung tâm trong mọi
									quyết định.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='about-card about-card--navy rounded p-4 h-100'>
								<h5 className='mb-3'>Đội ngũ</h5>
								<p className='mb-0'>
									Đội ngũ tư vấn am hiểu sản phẩm, kỹ thuật phản hồi nhanh và luôn
									đồng hành sau bạn.
								</p>
							</div>
						</div>
					</div>

					<div className='row g-4 mb-5'>
						<div className='col-lg-7'>
							<div className='bg-white rounded p-4 p-lg-5 border h-100'>
								<h5 className='mb-3'>Hành trình phát triển</h5>
								<div className='row g-3'>
									<div className='col-md-6'>
										<div className='about-timeline-card about-timeline-card--gold rounded p-3 h-100'>
											<p className='year mb-1'>2022</p>
											<p className='mb-0'>
												Ra mắt cửa hàng đầu tiên tại TP.HCM.
											</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='about-timeline-card about-timeline-card--teal rounded p-3 h-100'>
											<p className='year mb-1'>2023</p>
											<p className='mb-0'>
												Mở rộng danh mục laptop và gaming gear.
											</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='about-timeline-card about-timeline-card--indigo rounded p-3 h-100'>
											<p className='year mb-1'>2024</p>
											<p className='mb-0'>
												Triển khai giao hàng nhanh trong 48h.
											</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='about-timeline-card about-timeline-card--rose rounded p-3 h-100'>
											<p className='year mb-1'>2025</p>
											<p className='mb-0'>
												Hệ thống chăm sóc khách hàng 1:1.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-lg-5'>
							<div className='about-policy rounded p-4 p-lg-5 h-100'>
								<h5 className='mb-3'>Chính sách dịch vụ</h5>
								<ul className='mb-0'>
									<li>Kiểm tra sản phẩm trước khi giao.</li>
									<li>Hỗ trợ cài đặt tối ưu theo nhu cầu.</li>
									<li>Đổi trả trong 7 ngày với sản phẩm lỗi.</li>
									<li>Bảo hành chính hãng theo tiêu chuẩn nhà sản xuất.</li>
								</ul>
							</div>
						</div>
					</div>

					<div className='row g-4'>
						<div className='col-lg-6'>
							<div className='about-footer-card bg-white rounded p-4 h-100'>
								<h5 className='mb-3'>Hợp tác phân phối</h5>
								<p className='mb-0'>
									Nếu bạn là nhà phân phối, đối tác thương hiệu, hãy liên hệ để
									cùng phát triển bản vùng.
								</p>
							</div>
						</div>
						<div className='col-lg-6'>
							<div className='about-footer-card bg-white rounded p-4 h-100'>
								<h5 className='mb-3'>Kết nối cùng Vynx</h5>
								<p className='mb-0'>
									Theo dõi Vynx để cập nhật sản phẩm mới, ưu đãi về mẫu sử dụng
									công nghệ hiệu quả.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}