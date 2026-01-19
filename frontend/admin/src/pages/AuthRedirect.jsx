import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Trang xử lý redirect từ User App sang Admin App
 * Nhận token và user data từ URL params, lưu vào localStorage
 */
export default function AuthRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("=== AuthRedirect Debug ===");
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    console.log("1. Token:", token ? "Có" : "Không có");
    console.log("2. User param:", userParam ? "Có" : "Không có");

    if (token && userParam) {
      try {
        // Decode user data
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log("3. Decoded user:", user);
        console.log("4. User role:", user.role);

        // Kiểm tra role
        if (user.role === "admin" || user.role === "employee") {
          console.log("5. Lưu vào localStorage...");
          // Lưu vào localStorage
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_data", JSON.stringify(user));

          console.log("6. Trigger storage event...");
          // Trigger storage event
          window.dispatchEvent(new Event("storage"));

          console.log("7. Navigate to /");
          // Chuyển đến dashboard
          navigate("/", { replace: true });
        } else {
          console.log("-> Role không hợp lệ. Chuyển về User App");
          // Không phải admin/employee -> chuyển về user app
          window.location.href = "http://localhost:5173";
        }
      } catch (error) {
        console.error("Auth redirect error:", error);
        // Có lỗi -> chuyển về login
        navigate("/dang-nhap", { replace: true });
      }
    } else {
      console.log("-> Không có token/user. Chuyển về login");
      // Không có token -> chuyển về login
      navigate("/dang-nhap", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Đang chuyển hướng...
      </Typography>
    </Box>
  );
}
