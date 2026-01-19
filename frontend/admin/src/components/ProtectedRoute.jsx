import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../services/authService";

/**
 * Component bảo vệ route cho Admin App
 * Chỉ cho phép user có role "admin" hoặc "employee" truy cập
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con cần bảo vệ
 */
export default function ProtectedRoute({ children }) {
  console.log("=== ProtectedRoute Debug ===");

  // Kiểm tra xem user đã đăng nhập chưa
  const authenticated = isAuthenticated();
  console.log("1. isAuthenticated:", authenticated);

  if (!authenticated) {
    console.log("-> Chuyển đến /login");
    // Chưa đăng nhập -> chuyển đến trang login
    return <Navigate to="/dang-nhap" replace />;
  }

  // Lấy thông tin user
  const user = getUser();
  console.log("2. User data:", user);
  console.log("3. User role:", user?.role);

  // Kiểm tra role - chỉ cho phép admin và employee
  if (!user || (user.role !== "admin" && user.role !== "employee")) {
    console.log("-> User không có quyền. Chuyển về User App");
    // Không phải admin/employee -> chuyển về trang user app
    window.location.href = "http://localhost:5173";
    return null;
  }

  console.log("-> User có quyền. Render children");
  // Đã đăng nhập và có quyền admin/employee -> render component
  return children;
}
