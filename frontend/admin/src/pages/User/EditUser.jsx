import { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	Button,
	Box,
	IconButton,
	FormControl,
	InputLabel,
	FormHelperText,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../services/api";
import { userStatuses } from "@shared/utils/userHelper.jsx";
import { useToast } from "@shared/hooks/useToast";

const roles = [
	{ id: "admin", name: "Quản trị viên" },
	{ id: "employee", name: "Nhân viên" },
	{ id: "customer", name: "Khách hàng" },
];

export default function EditUser({ open, onClose, user, onUpdated, showSuccess, showError }) {
	const { toast, showSuccess: showLocalSuccess, showError: showLocalError, closeToast } = useToast();
	const [formData, setFormData] = useState({
		full_name: "",
		email: "",
		phone: "",
		role: "customer",
		is_active: true,
		password: "",
		confirm_password: "",
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (user) {
			setFormData({
				full_name: user.full_name || "",
				email: user.email || "",
				phone: user.phone || "",
				role: user.role || "customer",
				is_active: !!user.is_active,
				password: "",
				confirm_password: "",
			});
			setErrors({});
		}
	}, [user, open]);

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

	const validate = () => {
		const nextErrors = {};
		if (!formData.full_name.trim()) nextErrors.full_name = "Vui lòng nhập họ tên";
		if (!formData.email.trim()) nextErrors.email = "Vui lòng nhập email";
		if (formData.password || formData.confirm_password) {
			if (!formData.password) nextErrors.password = "Vui lòng nhập mật khẩu mới";
			if (formData.password !== formData.confirm_password) {
				nextErrors.confirm_password = "Mật khẩu xác nhận không khớp";
			}
		}
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!user || !validate()) return;

		setSubmitting(true);
		const payload = {
			full_name: formData.full_name.trim(),
			email: formData.email.trim(),
			phone: formData.phone.trim() || null,
			role: formData.role,
			is_active: formData.is_active,
		};
		if (formData.password) {
			payload.password = formData.password;
		}

		api.put(`/users/${user.id}`, payload)
			.then((response) => {
				const updated = response?.data?.data ?? response?.data;
				showLocalSuccess("Cập nhật người dùng thành công!");
				onUpdated?.(updated);
				setTimeout(() => {
					handleClose();
				}, 1200);
			})
			.catch((error) => {
				if (error?.response?.status === 422) {
					const serverErrors = error.response.data?.errors || {};
					const nextErrors = {};
					Object.keys(serverErrors).forEach((key) => {
						const messages = serverErrors[key];
						if (Array.isArray(messages) && messages.length > 0) {
							nextErrors[key] = messages[0];
						}
					});
					setErrors((prev) => ({ ...prev, ...nextErrors }));
					const firstError = Object.values(nextErrors)[0];
					if (firstError) showLocalError(firstError);
				} else {
					console.error("Error updating user:", error);
					showLocalError("Cập nhật người dùng thất bại!");
				}
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		setErrors({});
		setSubmitting(false);
		closeToast();
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						CẬP NHẬT NGƯỜI DÙNG
					</Typography>
					<IconButton edge='end' color='inherit' onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Box>
				
			</DialogTitle>

			<DialogContent dividers>
				<Box
					sx={{
						background: "linear-gradient(360deg, #234C6A 0%, #456882 100%)",
						borderRadius: 2,
						py: 1.5,
						px: 2,
						mb: 3,
						boxShadow: "0 4px 6px rgba(35, 76, 106, 0.3)",
					}}>
					<Typography
						variant='h5'
						fontWeight='bold'
						align='center'
						sx={{ color: "white", letterSpacing: 1 }}>
						THÔNG TIN NGƯỜI DÙNG
					</Typography>
				</Box>
				<TextField
					fullWidth
					disabled
					label='Tên đăng nhập'
					name='username'
					value={user?.username || ""}
					margin='normal'
				/>
				<TextField
					fullWidth
					required
					label='Họ tên'
					name='full_name'
					value={formData.full_name}
					onChange={handleChange}
					error={!!errors.full_name}
					helperText={errors.full_name}
					margin='normal'
				/>
				<TextField
					fullWidth
					required
					label='Email'
					name='email'
					value={formData.email}
					onChange={handleChange}
					error={!!errors.email}
					helperText={errors.email}
					margin='normal'
				/>
				<TextField
					fullWidth
					label='Số điện thoại'
					name='phone'
					value={formData.phone}
					onChange={handleChange}
					error={!!errors.phone}
					helperText={errors.phone}
					margin='normal'
				/>
				<FormControl fullWidth margin='normal'>
					<InputLabel>Vai trò</InputLabel>
					<Select
						name='role'
						value={formData.role}
						onChange={handleChange}
						label='Vai trÃ²'>
						{roles.map((role) => (
							<MenuItem key={role.id} value={role.id}>
								{role.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth margin='normal'>
					<InputLabel>Trạng thái</InputLabel>
					<Select
						name='is_active'
						value={formData.is_active}
						onChange={handleChange}
						label='Trạng thái'>
						{userStatuses.map((option) => (
							<MenuItem key={String(option.id)} value={option.id}>
								{option.name}
							</MenuItem>
						))}
					</Select>
					{errors.is_active && <FormHelperText>{errors.is_active}</FormHelperText>}
				</FormControl>

				<TextField
					fullWidth
					label='Mật khẩu mới'
					name='password'
					type='password'
					value={formData.password}
					onChange={handleChange}
					error={!!errors.password}
					helperText={errors.password}
					margin='normal'
				/>
				<TextField
					fullWidth
					label='Xác nhận mật khẩu mới'
					name='confirm_password'
					type='password'
					value={formData.confirm_password}
					onChange={handleChange}
					error={!!errors.confirm_password}
					helperText={errors.confirm_password}
					margin='normal'
				/>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button onClick={handleClose} variant='outlined' disabled={submitting}>
					Hủy
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={submitting}>
					{submitting ? "Đang lưu..." : "Lưu thay đổi"}
				</Button>
			</DialogActions>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</Dialog>
	);
}




