import api from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

const CART_RESET_KEY = "cart_reset";

const notifyAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:changed"));
  }
};

/**
 * Đăng ký người dùng mới
 */
export const register = async (
  username,
  email,
  password,
  password_confirmation,
  full_name,
  phone = null,
) => {
  try {
    const response = await api.post("/dang-ky", {
      username,
      email,
      password,
      password_confirmation,
      full_name,
      phone,
    });

    const { token, user } = response.data;

    // Lưu token và thông tin user vào localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notifyAuthChange();

    // Thêm token vào header mặc định của axios
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { token, user };
  } catch (error) {
    throw error;
  }
};

/**
 * Đăng nhập người dùng
 */
export const login = async (username, password) => {
  try {
    const response = await api.post("/dang-nhap", {
      username,
      password,
    });

    const { token, user } = response.data;

    // Lưu token và thông tin user vào localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notifyAuthChange();

    // Thêm token vào header mặc định của axios
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { token, user };
  } catch (error) {
    throw error;
  }
};

/**
 * Đăng xuất người dùng
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await api.post("/logout");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Xóa token và user data khỏi localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common["Authorization"];
    localStorage.setItem(CART_RESET_KEY, "1");
    notifyAuthChange();
  }
};

/**
 * Lấy token từ localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Lấy thông tin user từ localStorage
 */
export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Khởi tạo auth - Thêm token vào header nếu có
 */
export const initAuth = () => {
  const token = getToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
// Khởi tạo auth khi import module
initAuth();
