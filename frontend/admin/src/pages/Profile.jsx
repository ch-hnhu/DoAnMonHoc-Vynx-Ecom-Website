import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import { getUser } from "../services/authService";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

const DEFAULT_AVATAR = "https://placehold.co/400?text=Chưa+có+ảnh";
const BACKEND_URL = "http://localhost:8000";

const getImageUrl = (imagePath) => {
	if (!imagePath) return DEFAULT_AVATAR;
	if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
		return imagePath;
	}
	return `${BACKEND_URL}${imagePath}`;
};

export default function Profile() {
	useDocumentTitle("VYNX ADMIN | THÔNG TIN CÁ NHÂN");
	const navigate = useNavigate();

	const { toast, showSuccess, showError, closeToast } = useToast();
	const [formData, setFormData] = useState({
		username: "",
		full_name: "",
		dob: "",
		email: "",
		phone: "",
		image: "",
	});
	const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchUserInfo();
	}, []);

	const fetchUserInfo = async () => {
		try {
			setLoading(true);
			const response = await api.get("/me");
			const userData = response.data.user;

			setFormData({
				username: userData.username || "",
				full_name: userData.full_name || "",
				dob: userData.dob ? userData.dob.slice(0, 10) : "",
				email: userData.email || "",
				phone: userData.phone ? userData.phone : "",
				image: userData.image || "",
			});

			setAvatarPreview(getImageUrl(userData.image));
		} catch (err) {
			console.error("Error fetching user info:", err);
			if (err.response?.status === 401) {
				showError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
				navigate("/dang-nhap", { replace: true });
				return;
			}
			if (err.response?.data?.message) {
				showError(err.response.data.message);
				return;
			}
			showError("Không thể tải thông tin người dùng");
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				showError("Vui lòng chọn file ảnh");
				return;
			}

			if (file.size > 2 * 1024 * 1024) {
				showError("Kích thước ảnh không được vượt quá 2MB");
				return;
			}

			setSelectedFile(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAvatarError = (e) => {
		e.currentTarget.onerror = null;
		e.currentTarget.src = DEFAULT_AVATAR;
	};

	const handleSave = async (e) => {
		e.preventDefault();

		if (!formData.full_name.trim()) {
			showError("Họ và tên không được để trống");
			return;
		}

		if (!formData.email.trim()) {
			showError("Email không được để trống");
			return;
		}

		if (formData.phone && formData.phone.trim() !== "") {
			const phoneRegex = /^0\d{9}$/;
			if (!phoneRegex.test(formData.phone.trim())) {
				showError("Vui lòng nhập đủ 10 chữ số");
				return;
			}
		}

		try {
			setLoading(true);

			const data = new FormData();
			data.append("full_name", formData.full_name);
			data.append("email", formData.email);
			data.append("dob", formData.dob || "");
			data.append("phone", formData.phone || "");

			if (selectedFile) {
				data.append("image", selectedFile);
			}

			const response = await api.post("/profile/update", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const updatedUser = response.data.user;
			localStorage.setItem("user_data", JSON.stringify(updatedUser));
			window.dispatchEvent(new Event("storage"));
			setSelectedFile(null);
			await fetchUserInfo();
			showSuccess("Cập nhật thông tin thành công!");
		} catch (err) {
			console.error("Error updating profile:", err);
			if (err.response?.status === 401) {
				showError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
				navigate("/dang-nhap", { replace: true });
				return;
			}
			if (err.response?.data?.errors) {
				const errors = err.response.data.errors;
				const firstError = Object.values(errors)[0][0];
				showError(firstError);
			} else if (err.response?.data?.message) {
				showError(err.response.data.message);
			} else {
				showError("Có lỗi xảy ra khi cập nhật thông tin");
			}
		} finally {
			setLoading(false);
		}
	};

	const user = getUser();

	return (
		<>
			<Snackbar
				open={toast.open}
				autoHideDuration={toast.duration}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert
					onClose={closeToast}
					severity={toast.severity}
					variant='filled'
					sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>

			<div className='container-fluid py-4'>
				<div className='container'>
					<div className='card border-0 shadow-sm'>
						<div className='card-body p-4'>
							<h4 className='mb-4'>
								<i className='fas fa-user-edit me-2 text-primary'></i>
								Thông tin cá nhân
							</h4>

							<form onSubmit={handleSave}>
								<div className='row'>
									<div className='col-md-4 text-center mb-4'>
										<div className='mb-3'>
											<img
												src={avatarPreview}
												alt='Avatar'
												className='rounded-circle shadow'
												style={{
													width: "200px",
													height: "200px",
													objectFit: "cover",
													border: "4px solid #f0f0f0",
												}}
												onError={handleAvatarError}
											/>
										</div>
										<div>
											<label htmlFor='imageInput' className='btn btn-outline-primary btn-sm'>
												<i className='fas fa-camera me-2'></i>
												Chọn ảnh
											</label>
											<input
												type='file'
												id='imageInput'
												className='d-none'
												accept='image/*'
												onChange={handleImageChange}
											/>
											<p className='text-muted small mt-2 mb-0'>
												Định dạng: JPG, PNG, GIF
												<br />
												Kích thước tối đa: 2MB
											</p>
										</div>
									</div>

									<div className='col-md-8'>
										<div className='mb-3'>
											<label className='form-label fw-bold'>
												<i className='fas fa-user me-2 text-secondary'></i>
												Tên đăng nhập 
											</label>
											<input
												type='text'
												className='form-control bg-light'
												name='username'
												value={formData.username || user?.username || ""}
												readOnly
											/>
											<small className='text-muted'>Tên đăng nhập không thể thay đổi</small>
										</div>

										<div className='mb-3'>
											<label className='form-label fw-bold'>
												<i className='fas fa-id-card me-2 text-secondary'></i>
												Họ và tên <span className='text-danger'>*</span>
											</label>
											<input
												type='text'
												className='form-control'
												name='full_name'
												value={formData.full_name}
												onChange={handleInputChange}
												placeholder='Nhập họ và tên'
												required
											/>
										</div>

										<div className='mb-3'>
											<label className='form-label fw-bold'>
												<i className='fas fa-birthday-cake me-2 text-secondary'></i>
												Ngày sinh
											</label>
											<input
												type='date'
												className='form-control'
												name='dob'
												value={formData.dob}
												onChange={handleInputChange}
											/>
										</div>

										<div className='mb-3'>
											<label className='form-label fw-bold'>
												<i className='fas fa-envelope me-2 text-secondary'></i>
												Email <span className='text-danger'>*</span>
											</label>
											<input
												type='email'
												className='form-control'
												name='email'
												value={formData.email}
												onChange={handleInputChange}
												placeholder='Nhập email'
												required
											/>
										</div>

										<div className='mb-3'>
											<label className='form-label fw-bold'>
												<i className='fas fa-phone me-2 text-secondary'></i>
												Số điện thoại
											</label>
											<input
												type='tel'
												className='form-control'
												name='phone'
												value={formData.phone}
												onChange={handleInputChange}
												placeholder='Nhập số điện thoại'
												pattern='0\d{9}'
												maxLength='10'
											/>
										</div>

										<div className='d-grid gap-2 mt-4'>
											<button type='submit' className='btn btn-primary btn-lg' disabled={loading}>
												{loading ? (
													<>
														<span
															className='spinner-border spinner-border-sm me-2'
															role='status'
															aria-hidden='true'></span>
														Đang lưu...
													</>
												) : (
													<>
														<i className='fas fa-save me-2'></i>
														Lưu thông tin
													</>
												)}
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
