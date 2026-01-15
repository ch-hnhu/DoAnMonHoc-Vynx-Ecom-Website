import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../services/authService";

/**
 * Component bảo vệ route - Chỉ cho phép user đã đăng nhập truy cập
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con cần bảo vệ
 * @param {Array<string>} props.allowedRoles - Danh sách các role được phép truy cập (optional)
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  // Kiểm tra xem user đã đăng nhập chưa
  if (!isAuthenticated()) {
    // Chưa đăng nhập -> chuyển đến trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu về role
  if (allowedRoles && allowedRoles.length > 0) {
    const user = getUser();

    // Kiểm tra role của user
    if (!user || !allowedRoles.includes(user.role)) {
      // Role không hợp lệ -> chuyển về trang chủ
      return <Navigate to="/" replace />;
    }
  }

  // Đã đăng nhập và có quyền truy cập -> render component
  return children;
}

