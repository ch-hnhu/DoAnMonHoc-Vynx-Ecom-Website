import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { login } from "../services/authService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // Blue-500
    },
  },
  typography: {
    fontFamily: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      '"Noto Sans"',
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(","),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password) {
      setError("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      const { user } = await login(username, password);

      // Trigger storage event để cập nhật Header
      window.dispatchEvent(new Event("storage"));

      // Kiểm tra vai trò
      if (user.role === "admin" || user.role === "employee") {
        // Chuyển đến trang admin dashboard
        navigate("/");
      } else if (user.role === "customer") {
        // Chuyển đến trang user (port 5173)
        window.location.href = "http://localhost:5173";
      } else {
        setError("Vai trò người dùng không hợp lệ.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.errors?.username) {
        setError(err.response.data.errors.username[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 450,
            backgroundColor: "white",
            p: 4,
            borderRadius: 3,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: "#1f2937",
                mb: 2,
              }}
            >
              Đăng Nhập
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Tên đăng nhập"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.5 }}
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>

            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Button
                onClick={() => navigate("/dang-ky")}
                size="small"
                color="primary"
                sx={{ textTransform: "none" }}
              >
                Chưa có tài khoản? Đăng ký ngay
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
