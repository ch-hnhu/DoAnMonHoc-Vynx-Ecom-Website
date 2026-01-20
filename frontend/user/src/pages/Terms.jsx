import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import PageHeader from "../components/Partial/PageHeader";

export default function Terms() {
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
	const title = "ĐIỀU KHOẢN VÀ ĐIỀU KIỆN";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Điều khoản và điều kiện", active: true },
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
								<h2 className='mb-3'>Chấp nhận điều khoản</h2>
								<p className='mb-4'>
									Khi truy cập và mua sắm tại Electro, bạn đồng ý tuân thủ các
									điều khoản và điều kiện dưới đây. Nếu bạn không đồng ý, vui lòng
									ngừng sử dụng dịch vụ.
								</p>

								<h4 className='mb-3'>Tài khoản và bảo mật</h4>
								<ul className='mb-4'>
									<li>Thông tin tài khoản phải chính xác và cập nhật.</li>
									<li>Bạn chịu trách nhiệm bảo mật mật khẩu của mình.</li>
									<li>
										Chúng tôi có quyền khóa tài khoản nếu phát hiện gian lận.
									</li>
								</ul>

								<h4 className='mb-3'>Giá cả và thanh toán</h4>
								<ul className='mb-4'>
									<li>
										Giá hiển thị có thể thay đổi tùy chương trình khuyến mãi.
									</li>
									<li>
										Đơn hàng chỉ được xác nhận sau khi thanh toán thành công.
									</li>
									<li>
										Chúng tôi có thể hủy đơn khi phát hiện sai lệch thông tin.
									</li>
								</ul>

								<h4 className='mb-3'>Giao hàng và đổi trả</h4>
								<p className='mb-4'>
									Thời gian và chi phí giao hàng được thông báo khi đặt hàng.
									Chính sách đổi trả áp dụng theo quy định hiện hành và tình trạng
									sản phẩm.
								</p>

								<h4 className='mb-3'>Sở hữu trí tuệ</h4>
								<p className='mb-4'>
									Mọi nội dung trên website thuộc quyền sở hữu của Electro hoặc
									đối tác và không được sử dụng lại khi chưa có sự cho phép.
								</p>

								<h4 className='mb-3'>Giới hạn trách nhiệm</h4>
								<p className='mb-0'>
									Chúng tôi không chịu trách nhiệm đối với các thiệt hại gián tiếp
									hoặc phát sinh do việc sử dụng website hoặc dịch vụ ngoài phạm
									vi kiểm soát của Electro.
								</p>
							</div>
						</div>

						<div className='col-lg-4'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Liên hệ pháp lý</h5>
								<p className='mb-2'>Email: {supportEmail}</p>
								<p className='mb-0'>Hotline: {supportHotline}</p>
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Cập nhật điều khoản</h5>
								<p className='mb-0'>
									Điều khoản có thể thay đổi và sẽ được thông báo trên website.
								</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Lưu ý</h5>
								<p className='mb-0'>
									Vui lòng đọc kỹ trước khi mua hàng để đảm bảo quyền lợi của bạn.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
