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
  Snackbar,
} from "@mui/material";
import { register } from "../services/authService";
import { useToast } from "../../../shared/hooks/useToast";

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

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast, showSuccess, closeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!username || !email || !password || !confirmPassword || !fullName) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    try {
      await register(
        username,
        email,
        password,
        confirmPassword,
        fullName,
        phone,
      );

      // Trigger storage event để cập nhật Header
      window.dispatchEvent(new Event("storage"));

      // Hiển thị thông báo thành công
      showSuccess("Đăng ký thành công!");

      // Đăng ký thành công, tự động đăng nhập rồi nên chuyển về dashboard sau 1.5 giây
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);

      // Xử lý lỗi từ API
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.email) {
          setError(errors.email[0]);
        } else if (errors.username) {
          setError(errors.username[0]);
        } else if (errors.password) {
          setError(errors.password[0]);
        } else {
          setError("Đã xảy ra lỗi khi đăng ký.");
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
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
              Đăng Ký
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Tên đăng nhập"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              helperText="Tên đăng nhập duy nhất của bạn"
            />
            <TextField
              label="Họ và tên"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              helperText="Không bắt buộc"
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              helperText="Tối thiểu 6 ký tự"
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              error={!!error && password !== confirmPassword}
              helperText={
                password !== confirmPassword && confirmPassword.length > 0
                  ? "Mật khẩu không khớp"
                  : ""
              }
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
              {loading ? "Đang xử lý..." : "Đăng Ký"}
            </Button>

            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Button
                onClick={() => navigate("/dang-nhap")}
                size="small"
                color="primary"
                sx={{ textTransform: "none" }}
              >
                Đã có tài khoản? Đăng nhập
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={closeToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={closeToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
