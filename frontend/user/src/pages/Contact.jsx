import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react"; 
import { Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import { buildGoogleMapEmbedUrl } from "@shared/utils/mapHelper";
import { useToast } from "@shared/hooks/useToast";
import PageHeader from "../components/Partial/PageHeader";
export default function Contact() {
	const [formData, setFormData] = useState({
		full_name: "",
		email: "",
		phone: "",
		content: "",
	});

	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const { toast, showSuccess, showError, closeToast } = useToast();

	//Thông tin liên hệ 
	const [companyProfile, setCompanyProfile] = useState(null);
	const [isLoadingCompany, setIsLoadingCompany] = useState(true);
	const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

	useEffect(() => {
		let isMounted = true;
		api.get("/configuration")
			.then((response) => {
				const configurations = response?.data?.data ?? [];
				const activeConfig = configurations.find((item) => item.is_active);
				if (isMounted) setCompanyProfile(activeConfig || null);
			})
			.catch(() => {
				if (isMounted) setCompanyProfile(null);
			})
			.finally(() => {
				if (isMounted) setIsLoadingCompany(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);
	
	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	// Validate form
	const validate = () => {
		const newErrors = {};

		if (!formData.full_name.trim()) {
			newErrors.full_name = "Vui lòng nhập họ và tên";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Vui lòng nhập email";
		}

		if (formData.phone.trim() && !PHONE_REGEX.test(formData.phone.trim())) {
			newErrors.phone = "Số điện thoại không hợp lệ";
		}

		if (!formData.content.trim()) {
			newErrors.content = "Vui lòng nhập nội dung liên hệ";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Gui form
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) return;
		
		setSubmitting(true);

		api.post("/support-requests", formData)
			.then(() => {
				showSuccess("Gửi liên hệ thành công!", 1500);
				
				setFormData({
					full_name: "",
					email: "",
					phone: "",
					content: "",
				});
				setSubmitting(false);
			})
			.catch(() => {
				showError("Gửi liên hệ thất bại!", 1500);
				
			})
			.finally(() => {
				setSubmitting(false);
			});
		
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
												name="full_name"
												className='form-control'
												placeholder='Họ và tên'
												value={formData.full_name}
												onChange={handleChange}
											/>
											<div className="invalid-feedback d-block ps-2">
											{errors.full_name }
											</div>

										</div>
										
										<div className='col-md-6'>
											<input
												type='text'
												name="phone"
												className='form-control'
												placeholder='Số điện thoại'
												value={formData.phone}
												onChange={handleChange}
											/>	
											<div className="invalid-feedback d-block ps-2">
											{errors.phone }
											</div>										
										</div>
										<div className='col-md-12'>
											<input
												type='email'
												name="email"
												className='form-control'
												placeholder='Email '
												value={formData.email}
												onChange={handleChange}
											/>
											<div className="invalid-feedback d-block ps-2">
												{errors.email }
											</div>
										</div>
										<div className='col-12'>
											<textarea
												className='form-control'
												name="content"
												rows='6'
												placeholder='Nội dung liên hệ'
												value={formData.content}
												onChange={handleChange}
											/>
											<div className="invalid-feedback d-block ps-2">
											{errors.content }
											</div>
										</div>
										<div className='col-12'>
											<button
												type='submit' disabled={submitting}	
												className='btn btn-primary rounded-pill px-5 py-2'>
												{submitting?"Đang gửi...":"Gửi liên hệ"}
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>

						<div className='col-lg-5'>
							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Thông tin liên hệ</h5>
								{isLoadingCompany ? (
									<p className='mb-0 text-muted'>Đang tải thông tin...</p>
								) : companyProfile ? (
									<>
										<p className='mb-2'><strong>Email:</strong> {companyProfile.email || "-"}</p>
										<p className='mb-2'><strong>Hotline:</strong> {companyProfile.phone || "-"}</p>
										<p className='mb-0'><strong>Thời gian:</strong> 9:00 - 18:00 (T2 - T7)</p>
									</>
								) : (
									<p className='mb-0 text-muted'>Thông tin đang được cập nhật.</p>
								)}
							</div>

							<div className='bg-white rounded p-4 border mb-4'>
								<h5 className='mb-3'>Địa chỉ cửa hàng</h5>
								<p className='mb-0'>
									{companyProfile?.address || "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"}
								</p>
							</div>

							<div className='bg-white rounded p-4 border'>
								<h5 className='mb-3'>Bản đồ</h5>
								<div
									className='rounded'
									style={{ height: 220, background: "rgba(0, 0, 0, 0.05)" }}>
									<div className='h-100 d-flex align-items-center justify-content-center text-muted'>
										<iframe
										className='rounded w-100'
										style={{ height: "100%" }}
										src={buildGoogleMapEmbedUrl(companyProfile?.address)}
										loading='lazy'
										referrerPolicy='no-referrer-when-downgrade'></iframe>
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
			<Snackbar
				open={toast.open}
				autoHideDuration={toast.duration || 3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
		);
}


