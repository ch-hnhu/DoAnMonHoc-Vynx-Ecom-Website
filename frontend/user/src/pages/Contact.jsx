import { Helmet } from "react-helmet-async";
import { useState } from "react";
import PageHeader from "../components/Partial/PageHeader";
export default function Contact() {
	const [form, setForm] = useState({
		full_name: "",
		email: "",
		phone: "",
		content: "",
	});
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch("http://127.0.0.1:8000/api/support-requests", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				const text = await res.text();
				console.error("Server error:", text);
				alert("Gửi liên hệ thất bại");
				return;
			}

			const data = await res.json();
			alert(data.message);

			// reset form
			setForm({
				full_name: "",
				email: "",
				phone: "",
				content: "",
			});
		} catch (error) {
			console.error(error);
			alert("Không kết nối được server");
		}
	};

	const title = "LIÊN HỆ";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Liên hệ", active: true },
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
						<div className='col-lg-7'>
							<div className='bg-light rounded p-4 p-lg-5'>
								<h2 className='mb-3'>Gửi liên hệ</h2>
								<p className='text-muted mb-4'>
									Chúng tôi phản hồi trong giờ làm việc. Vui lòng mô tả rõ vấn đề
									để được hỗ trợ nhanh nhất.
								</p>
								<form onSubmit={handleSubmit}>
									<div className='row g-3'>
										<div className='col-md-6'>
											<input
												type='text'
												className='form-control'
												placeholder='Họ và tên'
												onChange={(e) =>
													setForm({ ...form, full_name: e.target.value })
												}
											/>
										</div>
										<div className='col-md-6'>
											<input
												type='email'
												className='form-control'
												placeholder='Email'
												onChange={(e) =>
													setForm({ ...form, email: e.target.value })
												}
											/>
										</div>
										<div className='col-12'>
											<input
												type='text'
												className='form-control'
												placeholder='Số điện thoại'
												onChange={(e) =>
													setForm({ ...form, phone: e.target.value })
												}
											/>
										</div>
										<div className='col-12'>
											<textarea
												className='form-control'
												rows='6'
												placeholder='Nội dung liên hệ'
												onChange={(e) =>
													setForm({ ...form, content: e.target.value })
												}></textarea>
										</div>
										<div className='col-12'>
											<button
												type='submit'
												className='btn btn-primary rounded-pill px-5 py-2'>
												Gửi liên hệ
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>

						<div className='col-lg-5'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Thông tin liên hệ</h5>
								<p className='mb-2'>Email: support@electro.com</p>
								<p className='mb-2'>Hotline: (+012) 3456 7890</p>
								<p className='mb-0'>Thời gian: 9:00 - 18:00 (T2 - T7)</p>
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Địa chỉ cửa hàng</h5>
								<p className='mb-0'>
									123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
								</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Bản đồ</h5>
								<div
									className='rounded'
									style={{ height: 220, background: "rgba(0, 0, 0, 0.05)" }}>
									<div className='h-100 d-flex align-items-center justify-content-center text-muted'>
										Khu vực hiển thị bản đồ
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='row g-4 mt-4'>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Hỗ trợ đơn hàng</h5>
								<p className='mb-0'>
									Cung cấp mã đơn hàng để được tra cứu trạng thái, đổi trả hoặc
									bảo hành nhanh hơn.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Tư vấn sản phẩm</h5>
								<p className='mb-0'>
									Đội ngũ tư vấn giúp bạn chọn sản phẩm phù hợp với nhu cầu và
									ngân sách.
								</p>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-light rounded p-4 h-100'>
								<h5 className='mb-3'>Hợp tác &amp; báo giá</h5>
								<p className='mb-0'>
									Gửi thông tin doanh nghiệp để nhận chính sách giá và ưu đãi hợp
									tác.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
