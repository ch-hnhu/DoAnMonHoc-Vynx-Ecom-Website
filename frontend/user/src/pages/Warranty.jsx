import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Warranty() {
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

	const supportEmail = companyProfile?.email || "Đang cập nhật";
	const supportHotline = companyProfile?.phone || "Đang cập nhật";

	return (
		<>
			<Helmet>
				<title>Chính sách bảo hành - Electro</title>
			</Helmet>

			<div className='container-fluid page-header py-5'>
				<h1 className='text-center text-white display-6 wow fadeInUp' data-wow-delay='0.1s'>
					Chính sách bảo hành
				</h1>
				<ol
					className='breadcrumb justify-content-center mb-0 wow fadeInUp'
					data-wow-delay='0.3s'>
					<li className='breadcrumb-item'>
						<Link to='/'>Trang chủ</Link>
					</li>
					<li className='breadcrumb-item'>
						<Link to='/'>Trang</Link>
					</li>
					<li className='breadcrumb-item active text-white'>Bảo hành</li>
				</ol>
			</div>

			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='row g-4'>
						<div className='col-lg-8'>
							<div className='bg-light rounded p-4 p-lg-5'>
								<p className='text-muted mb-2'>Cập nhật lần cuối: 11/01/2026</p>
								<h2 className='mb-3'>Điều kiện bảo hành</h2>
								<ul className='mb-4'>
									<li>Sản phẩm còn trong thời hạn bảo hành.</li>
									<li>Có hóa đơn mua hàng hoặc thông tin đơn hàng.</li>
									<li>Tem/serial còn nguyên vẹn và không bị tẩy xóa.</li>
								</ul>

								<h4 className='mb-3'>Trường hợp không bảo hành</h4>
								<ul className='mb-4'>
									<li>Rơi vỡ, vào nước, cháy nổ do tác động bên ngoài.</li>
									<li>Tự ý tháo lắp hoặc sửa chữa tại nơi không ủy quyền.</li>
									<li>Hư hỏng do sử dụng sai hướng dẫn.</li>
								</ul>

								<h4 className='mb-3'>Thời gian xử lý</h4>
								<p className='mb-4'>
									Tùy theo loại sản phẩm, thời gian xử lý bảo hành từ 7-21 ngày
									làm việc. Chúng tôi sẽ thông báo khi có kết quả.
								</p>

								<h4 className='mb-3'>Hướng dẫn gửi bảo hành</h4>
								<ol className='mb-0'>
									<li>Liên hệ hotline hoặc gửi yêu cầu qua trang liên hệ.</li>
									<li>Chuẩn bị sản phẩm kèm hóa đơn/serial.</li>
									<li>Gửi sản phẩm đến trung tâm bảo hành hoặc bưu điện.</li>
								</ol>
							</div>
						</div>

						<div className='col-lg-4'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Trung tâm bảo hành</h5>
								<p className='mb-2'>Hotline: {supportHotline}</p>
								<p className='mb-0'>Email: {supportEmail}</p>
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Thời gian làm việc</h5>
								<p className='mb-0'>T2 - T7: 9:00 - 18:00</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Lưu ý</h5>
								<p className='mb-0'>
									Vui lòng sao lưu dữ liệu trước khi gửi bảo hành đối với thiết
									bị lưu trữ hoặc thiết bị có dữ liệu cá nhân.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
