import { useState, useEffect } from "react";
import api from "../services/api";
// import { getUser } from "../services/authService";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";


const DEFAULT_AVATAR = "https://placehold.co/400?text=Chưa+có+ảnh";

// Base URL của backend (không bao gồm /api)
const BACKEND_URL = "http://localhost:8000";

/**
 * Hàm chuyển đổi đường dẫn ảnh thành URL đầy đủ
 */
const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_AVATAR;

  // Nếu đã là URL đầy đủ (http/https) thì return luôn
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Nếu là đường dẫn tương đối, thêm base URL
  return `${BACKEND_URL}${imagePath}`;
};

export default function PersonalInfo() {
  // Toast notification
  const { toast, showSuccess, showError, closeToast } = useToast();

  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    dob: "",
    email: "",
    phone: "",
    image: "",
  });

  // State quản lý ảnh preview
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState(null);

  // State quản lý loading
  const [loading, setLoading] = useState(false);

  /**
   * Lấy thông tin user từ API khi component mount
   */
  useEffect(() => {
    fetchUserInfo();
  }, []);

  /**
   * Hàm lấy thông tin user từ API
   */
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get("/me");
      const userData = response.data.user;

      // Set dữ liệu vào form
      setFormData({
        username: userData.username || "",
        full_name: userData.full_name || "",
        // Backend trả về dob dạng "YYYY-MM-DD HH:MM:SS" hoặc "YYYY-MM-DD"
        // Input type="date" chỉ chấp nhận "YYYY-MM-DD"
        // Nên phải slice(0, 10) để lấy 10 ký tự đầu (YYYY-MM-DD)
        dob: userData.dob ? userData.dob.slice(0, 10) : "",
        email: userData.email || "",
        phone: userData.phone ? userData.phone : "",
        image: userData.image || "",
      });

      // Set avatar preview với URL đầy đủ
      setAvatarPreview(getImageUrl(userData.image));
    } catch (err) {
      console.error("Error fetching user info:", err);
      showError("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý khi input thay đổi
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Xử lý khi chọn ảnh
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        showError("Vui lòng chọn file ảnh");
        return;
      }

      // Kiểm tra kích thước file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError("Kích thước ảnh không được vượt quá 2MB");
        return;
      }

      setSelectedFile(file);

      // Preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Xử lý lỗi khi load ảnh
   */
  const handleAvatarError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  /**
   * Hàm lưu thông tin
   */
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate họ và tên
    if (!formData.full_name.trim()) {
      showError("Họ và tên không được để trống");
      return;
    }

    // Validate email
    if (!formData.email.trim()) {
      showError("Email không được để trống");
      return;
    }

    // Validate số điện thoại (nếu có nhập)
    if (formData.phone && formData.phone.trim() !== "") {
      const phoneRegex = /^0\d{9}$/;

      // Kiểm tra định dạng: bắt đầu bằng 0 và có đủ 10 chữ số
      if (!phoneRegex.test(formData.phone.trim())) {
        showError("Vui lòng nhập đủ 10 chữ số");
        return;
      }
    }

    try {
      setLoading(true);

      // Tạo FormData để gửi lên server (bao gồm cả file ảnh)
      const data = new FormData();
      data.append("full_name", formData.full_name);
      data.append("email", formData.email);

      // Luôn gửi dob và phone (kể cả khi rỗng)
      // Backend sẽ chuyển chuỗi rỗng thành null
      data.append("dob", formData.dob || "");
      data.append("phone", formData.phone || "");

      // Thêm ảnh nếu có chọn file mới
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      // Gửi request lên server
      const response = await api.post("/profile/update", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Cập nhật lại thông tin user trong localStorage
      const updatedUser = response.data.user;
      localStorage.setItem("user_data", JSON.stringify(updatedUser));

      // Trigger storage event để các component khác cập nhật
      window.dispatchEvent(new Event("storage"));

      // Reset selected file
      setSelectedFile(null);

      // Fetch lại thông tin user từ backend để đảm bảo dữ liệu đồng bộ
      // Đặc biệt quan trọng cho trường dob vì backend có thể format lại
      await fetchUserInfo();

      // Hiển thị thông báo thành công
      showSuccess("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response?.data?.errors) {
        // Lỗi validation từ Laravel
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

  return (
    <>
      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-4">
            <i className="fas fa-user-edit me-2 text-primary"></i>
            Thông tin cá nhân
          </h4>

          <form onSubmit={handleSave}>
            <div className="row">
              {/* Avatar Section */}
              <div className="col-md-4 text-center mb-4">
                <div className="mb-3">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="rounded-circle shadow"
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
                  <label
                    htmlFor="imageInput"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-camera me-2"></i>
                    Chọn ảnh
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-muted small mt-2 mb-0">
                    Định dạng: JPG, PNG, GIF
                    <br />
                    Kích thước tối đa: 2MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="col-md-8">
                {/* Username (readonly) */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-user me-2 text-secondary"></i>
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    name="username"
                    value={formData.username}
                    readOnly
                  />
                  <small className="text-muted">
                    Tên đăng nhập không thể thay đổi
                  </small>
                </div>

                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-id-card me-2 text-secondary"></i>
                    Họ và tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-birthday-cake me-2 text-secondary"></i>
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-envelope me-2 text-secondary"></i>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-phone me-2 text-secondary"></i>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    pattern="0\d{9}"
                    maxLength="10"
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
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
    </>
  );
}
