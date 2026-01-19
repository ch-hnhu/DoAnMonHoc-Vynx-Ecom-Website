import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import api from "../services/api";

export default function ShippingPolicy() {
	const [companyProfile, setCompanyProfile] = useState(null);

	useEffect(() => {
		let isMounted = true;

		api.get("/configurations")
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

	const supportHotline = companyProfile?.phone || "Đang cập nhật";
	const supportEmail = companyProfile?.email || "Đang cập nhật";


	const title = "CHÍNH SÁCH VẬN CHUYỂN";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Chính sách vận chuyển", active: true },
	];

	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>

			<PageHeader title={title} breadcrumbs={breadcrumbs} />

			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='row g-4'>
						<div className='col-lg-8'>
							<div className='bg-light rounded p-4 p-lg-5'>
								<p className='text-muted mb-2'>Cập nhật lần cuối: 11/01/2026</p>
								<h2 className='mb-3'>Phạm vi và thời gian giao hàng</h2>
								<ul className='mb-4'>
									<li>Giao nội thành: 1-2 ngày làm việc.</li>
									<li>Giao ngoại thành/tỉnh: 2-5 ngày làm việc.</li>
									<li>Thời gian có thể thay đổi do thời tiết hoặc lễ tết.</li>
								</ul>

								<h4 className='mb-3'>Phí vận chuyển</h4>
								<ul className='mb-4'>
									<li>Đơn hàng từ 2.000.000đ: miễn phí giao nội thành.</li>
									<li>Đơn hàng dưới 2.000.000đ: phụ phí tùy khu vực.</li>
									<li>Giao tỉnh: phí tính theo đối tác vận chuyển.</li>
								</ul>

								<h4 className='mb-3'>Quy trình giao hàng</h4>
								<ol className='mb-4'>
									<li>Xác nhận đơn hàng qua email/SMS.</li>
									<li>Đóng gói và bàn giao cho đơn vị vận chuyển.</li>
									<li>Giao hàng và ký nhận.</li>
								</ol>

								<h4 className='mb-3'>Kiểm tra khi nhận hàng</h4>
								<p className='mb-4'>
									Khách hàng vui lòng kiểm tra ngoại quan và tình trạng sản phẩm
									trước khi ký nhận. Nếu phát hiện hư hỏng, vui lòng lập biên bản
									với đơn vị vận chuyển và liên hệ ngay với chúng tôi.
								</p>

								<h4 className='mb-3'>Trường hợp giao hàng thất bại</h4>
								<p className='mb-0'>
									Nếu không liên hệ được hoặc khách hàng hẹn lại, đơn vị vận
									chuyển sẽ giao lại tối đa 2 lần. Sau đó đơn sẽ được hoàn về kho
									và xử lý theo quy định.
								</p>
							</div>
						</div>

						<div className='col-lg-4'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Hỗ trợ giao hàng</h5>
								<p className='mb-2'>Hotline: {supportHotline}</p>
								<p className='mb-0'>Email: {supportEmail}</p>
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Khung giờ giao</h5>
								<p className='mb-0'>T2 - T7: 9:00 - 18:00</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Theo dõi đơn hàng</h5>
								<p className='mb-0'>
									Bạn sẽ nhận mã vận đơn qua SMS/Email để theo dõi trạng thái.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
