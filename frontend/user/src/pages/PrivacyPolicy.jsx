import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";

export default function PrivacyPolicy() {
	const title = "CHÍNH SÁCH BẢO MẬT";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Chính sách bảo mật", active: true },
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
								<h2 className='mb-3'>Tổng quan</h2>
								<p className='mb-4'>
									Chúng tôi chỉ thu thập dữ liệu cần thiết để vận hành cửa hàng,
									xử lý đơn hàng và hỗ trợ khách hàng. Chính sách này giải thích
									dữ liệu được thu thập, cách sử dụng và các lựa chọn của bạn.
								</p>

								<h4 className='mb-3'>Thông tin chúng tôi thu thập</h4>
								<ul className='mb-4'>
									<li>
										Thông tin tài khoản như họ tên, email, số điện thoại và địa
										chỉ giao hàng.
									</li>
									<li>
										Thông tin đơn hàng gồm sản phẩm mua, trạng thái thanh toán
										và ghi chú giao hàng.
									</li>
									<li>
										Dữ liệu thiết bị và sử dụng như loại trình duyệt, trang đã
										truy cập và cookie.
									</li>
								</ul>

								<h4 className='mb-3'>Cách chúng tôi sử dụng dữ liệu</h4>
								<ul className='mb-4'>
									<li>Xử lý đơn hàng, đổi trả và yêu cầu hỗ trợ.</li>
									<li>Ngăn chặn gian lận và bảo vệ tài khoản, giao dịch.</li>
									<li>
										Cải thiện hiệu năng, danh mục và trải nghiệm người dùng.
									</li>
								</ul>

								<h4 className='mb-3'>Chia sẻ và công bố</h4>
								<p className='mb-4'>
									Chúng tôi chỉ chia sẻ dữ liệu với đối tác cần thiết để xử lý đơn
									hàng (thanh toán, vận chuyển, phân tích). Chúng tôi không bán dữ
									liệu cá nhân. Thông tin có thể được cung cấp khi pháp luật yêu
									cầu.
								</p>

								<h4 className='mb-3'>Thời gian lưu trữ</h4>
								<p className='mb-4'>
									Chúng tôi lưu dữ liệu tài khoản và đơn hàng trong thời gian cần
									thiết cho mục đích pháp lý, kế toán và dịch vụ. Bạn có thể yêu
									cầu xóa nếu không xung đột nghĩa vụ pháp lý.
								</p>

								<h4 className='mb-3'>Quyền lựa chọn của bạn</h4>
								<ul className='mb-0'>
									<li>
										Truy cập và cập nhật thông tin tài khoản bất cứ lúc nào.
									</li>
									<li>Hủy nhận email marketing trong phần cài đặt.</li>
									<li>Yêu cầu bản sao hoặc xóa dữ liệu cá nhân.</li>
								</ul>
							</div>
						</div>

						<div className='col-lg-4'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Liên hệ</h5>
								<p className='mb-2'>Email: privacy@electro.com</p>
								<p className='mb-2'>Điện thoại: (+012) 3456 7890</p>
								<p className='mb-0'>Giờ hỗ trợ: 9:00 - 18:00</p>
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Bảo mật</h5>
								<p className='mb-0'>
									Chúng tôi sử dụng kết nối mã hóa và kiểm soát truy cập để bảo vệ
									dữ liệu. Bạn có trách nhiệm giữ bí mật mật khẩu.
								</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Cập nhật chính sách</h5>
								<p className='mb-0'>
									Nếu có thay đổi, chúng tôi sẽ cập nhật ngày phía trên và thông
									báo trên website.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
