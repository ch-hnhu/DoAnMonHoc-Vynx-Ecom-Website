import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";

export default function Faq() {
	const title = "CÂU HỎI THƯỜNG GẶP";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Câu hỏi thường gặp", active: true },
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
								<h2 className='mb-4'>Chúng tôi có thể giúp gì cho bạn?</h2>

								<div className='accordion' id='faqAccordion'>
									<div className='accordion-item'>
										<h2 className='accordion-header' id='faqHeadingOne'>
											<button
												className='accordion-button'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target='#faqCollapseOne'
												aria-expanded='true'
												aria-controls='faqCollapseOne'>
												Làm thế nào để theo dõi đơn hàng?
											</button>
										</h2>
										<div
											id='faqCollapseOne'
											className='accordion-collapse collapse show'
											aria-labelledby='faqHeadingOne'
											data-bs-parent='#faqAccordion'>
											<div className='accordion-body'>
												Bạn sẽ nhận mã vận đơn qua email hoặc SMS. Sử dụng
												mã này trên trang theo dõi của đơn vị vận chuyển
												hoặc liên hệ hotline để được hỗ trợ.
											</div>
										</div>
									</div>

									<div className='accordion-item'>
										<h2 className='accordion-header' id='faqHeadingTwo'>
											<button
												className='accordion-button collapsed'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target='#faqCollapseTwo'
												aria-expanded='false'
												aria-controls='faqCollapseTwo'>
												Chính sách đổi trả như thế nào?
											</button>
										</h2>
										<div
											id='faqCollapseTwo'
											className='accordion-collapse collapse'
											aria-labelledby='faqHeadingTwo'
											data-bs-parent='#faqAccordion'>
											<div className='accordion-body'>
												Bạn có thể đổi trả trong vòng 7 ngày với sản phẩm
												còn nguyên vẹn và có đầy đủ hóa đơn. Vui lòng liên
												hệ bộ phận hỗ trợ để được hướng dẫn chi tiết.
											</div>
										</div>
									</div>

									<div className='accordion-item'>
										<h2 className='accordion-header' id='faqHeadingThree'>
											<button
												className='accordion-button collapsed'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target='#faqCollapseThree'
												aria-expanded='false'
												aria-controls='faqCollapseThree'>
												Các phương thức thanh toán hỗ trợ?
											</button>
										</h2>
										<div
											id='faqCollapseThree'
											className='accordion-collapse collapse'
											aria-labelledby='faqHeadingThree'
											data-bs-parent='#faqAccordion'>
											<div className='accordion-body'>
												Chúng tôi hỗ trợ thanh toán COD, chuyển khoản ngân
												hàng và các cổng thanh toán trực tuyến phổ biến.
											</div>
										</div>
									</div>

									<div className='accordion-item'>
										<h2 className='accordion-header' id='faqHeadingFour'>
											<button
												className='accordion-button collapsed'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target='#faqCollapseFour'
												aria-expanded='false'
												aria-controls='faqCollapseFour'>
												Thời gian bảo hành sản phẩm là bao lâu?
											</button>
										</h2>
										<div
											id='faqCollapseFour'
											className='accordion-collapse collapse'
											aria-labelledby='faqHeadingFour'
											data-bs-parent='#faqAccordion'>
											<div className='accordion-body'>
												Tùy từng sản phẩm, thời gian bảo hành từ 6-24 tháng.
												Vui lòng xem thông tin bảo hành trong chi tiết sản
												phẩm hoặc liên hệ hỗ trợ.
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Hỗ trợ nhanh</h5>
								<p className='mb-2'>Hotline: (+012) 3456 7890</p>
								<p className='mb-2'>Email: support@electro.com</p>
								<p className='mb-0'>Giờ hỗ trợ: 9:00 - 18:00</p>
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Mẹo sử dụng</h5>
								<p className='mb-0'>
									Đọc hướng dẫn sử dụng đi kèm sản phẩm để đảm bảo tuổi thọ và
									hiệu suất tốt nhất.
								</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Góp ý</h5>
								<p className='mb-0'>
									Nếu bạn không tìm thấy câu trả lời, hãy gửi câu hỏi qua trang
									liên hệ để được hỗ trợ.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
