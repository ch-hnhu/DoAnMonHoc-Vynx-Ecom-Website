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

			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='row g-4 align-items-center mb-5'>
						<div className='col-lg-6'>
							<div className='bg-light rounded p-4 p-lg-5 h-100'>
								<p className='text-uppercase text-primary mb-2'>Electro Store</p>
								<h2 className='mb-3'>
									Cửa hàng công nghệ định cho người dùng thực tế
								</h2>
								<p className='mb-4'>
									Electro được xây dựng với mục tiêu đơn giản: giúp bạn chọn đúng
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
							<div className='bg-white rounded p-4 p-lg-5 border h-100'>
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
									<span className='badge bg-secondary'>Tư vấn 1:1</span>
									<span className='badge bg-secondary'>Bảo hành chính hãng</span>
									<span className='badge bg-secondary'>Kiểm tra miễn phí</span>
								</div>
							</div>
						</div>
					</div>

					<div className='row g-4 mb-5'>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Tầm nhận</h5>
								<p className='mb-0'>
									Trở thành điểm đến công nghệ đáng tin cậy với trải nghiệm mua
									sắm hiện đại, thân thiện và nhất quán.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Giá trị cốt lõi</h5>
								<p className='mb-0'>
									Chính trực, minh bạch về lấy khách hàng làm trung tâm trong mọi
									quyết định.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
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
										<div className='bg-light rounded p-3 h-100'>
											<p className='text-primary mb-1'>2022</p>
											<p className='mb-0'>
												Ra mắt cửa hàng đầu tiên tại TP.HCM.
											</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='bg-light rounded p-3 h-100'>
											<p className='text-primary mb-1'>2023</p>
											<p className='mb-0'>
												Mở rộng danh mục laptop và gaming gear.
											</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='bg-light rounded p-3 h-100'>
											<p className='text-primary mb-1'>2024</p>
											<p className='mb-0'>
												Triển khai giao hàng nhanh trong 48h.
											</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='bg-light rounded p-3 h-100'>
											<p className='text-primary mb-1'>2025</p>
											<p className='mb-0'>
												Hệ thống chăm sóc khách hàng 1:1.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-lg-5'>
							<div className='bg-light rounded p-4 p-lg-5 h-100'>
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
							<div className='bg-white rounded p-4 border h-100'>
								<h5 className='mb-3'>Hợp tác phân phối</h5>
								<p className='mb-0'>
									Nếu bạn là nhà phân phối, đối tác thương hiệu, hãy liên hệ để
									cùng phát triển bản vùng.
								</p>
							</div>
						</div>
						<div className='col-lg-6'>
							<div className='bg-white rounded p-4 border h-100'>
								<h5 className='mb-3'>Kết nối cùng Electro</h5>
								<p className='mb-0'>
									Theo dõi Electro để cập nhật sản phẩm mới, ưu đãi về mẫu sử dụng
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