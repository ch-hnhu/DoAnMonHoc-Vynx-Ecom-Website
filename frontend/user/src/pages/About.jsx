import { Helmet } from "react-helmet-async";

export default function About() {
	return (
		<>
			<Helmet>
				<title>Về chúng tôi - Electro</title>
			</Helmet>

			<div className='container-fluid page-header py-5'>
				<h1 className='text-center text-white display-6 wow fadeInUp' data-wow-delay='0.1s'>
					Về chúng tôi
				</h1>
				<ol
					className='breadcrumb justify-content-center mb-0 wow fadeInUp'
					data-wow-delay='0.3s'>
					<li className='breadcrumb-item'>
						<a href='/'>Trang chủ</a>
					</li>
					<li className='breadcrumb-item'>
						<a href='/'>Trang</a>
					</li>
					<li className='breadcrumb-item active text-white'>Về chúng tôi</li>
				</ol>
			</div>

			<div className='container-fluid py-5'>
				<div className='container py-5'>
					<div className='row g-4 align-items-center mb-4'>
						<div className='col-lg-6'>
							<div className='bg-light rounded p-4 p-lg-5'>
								<h2 className='mb-3'>Sứ mệnh của Electro</h2>
								<p className='mb-4'>
									Chúng tôi mang đến trải nghiệm mua sắm công nghệ đáng tin cậy,
									giá hợp lý và dịch vụ hậu mãi rõ ràng. Electro tập trung vào
									những sản phẩm chính hãng, nguồn gốc minh bạch và giao hàng
									nhanh chóng.
								</p>
								<div className='d-flex flex-wrap gap-3'>
									<div className='bg-white border rounded px-3 py-2'>
										<strong>10K+</strong> Khách hàng hài lòng
									</div>
									<div className='bg-white border rounded px-3 py-2'>
										<strong>48h</strong> Giao hàng nội thành
									</div>
									<div className='bg-white border rounded px-3 py-2'>
										<strong>100%</strong> Hàng chính hãng
									</div>
								</div>
							</div>
						</div>
						<div className='col-lg-6'>
							<div className='bg-white rounded p-4 border h-100'>
								<h5 className='mb-3'>Cam kết dịch vụ</h5>
								<ul className='mb-0'>
									<li>Tư vấn đúng nhu cầu, không chèo kéo.</li>
									<li>Chính sách đổi trả minh bạch và dễ hiểu.</li>
									<li>Bảo hành nhanh, hỗ trợ kỹ thuật tận tâm.</li>
									<li>Giá cả cạnh tranh cùng ưu đãi rõ ràng.</li>
								</ul>
							</div>
						</div>
					</div>

					<div className='row g-4 mb-4'>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Tầm nhìn</h5>
								<p className='mb-0'>
									Trở thành điểm đến hàng đầu cho khách hàng yêu công nghệ tại
									Việt Nam với trải nghiệm mua sắm hiện đại.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Giá trị cốt lõi</h5>
								<p className='mb-0'>
									Chính trực, minh bạch và lấy khách hàng làm trung tâm trong
									mọi quyết định.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Đội ngũ</h5>
								<p className='mb-0'>
									Đội ngũ tư vấn am hiểu sản phẩm và hỗ trợ kỹ thuật luôn sẵn
									sàng đồng hành.
								</p>
							</div>
						</div>
					</div>

					<div className='row g-4'>
						<div className='col-lg-6'>
							<div className='bg-white rounded p-4 border h-100'>
								<h5 className='mb-3'>Hành trình phát triển</h5>
								<p className='mb-0'>
									Từ một cửa hàng nhỏ, Electro mở rộng thành hệ thống phân phối
									đa dạng sản phẩm: laptop, thiết bị âm thanh, gaming gear và
									phụ kiện chính hãng.
								</p>
							</div>
						</div>
						<div className='col-lg-6'>
							<div className='bg-white rounded p-4 border h-100'>
								<h5 className='mb-3'>Liên hệ hợp tác</h5>
								<p className='mb-0'>
									Nếu bạn là nhà phân phối, đại lý hoặc đối tác thương hiệu, hãy
									liên hệ để cùng phát triển bền vững.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
