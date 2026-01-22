import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../services/api";
import { userStatuses } from "@shared/utils/userHelper.jsx";

const roles = [
	{ id: "admin", name: "Quản trị viên" },
	{ id: "employee", name: "Nhân viên" },
	{ id: "customer", name: "Khách hàng" },
];

export default function AddUser({ open, onClose, onCreated, showSuccess, showError }) {
	const [formData, setFormData] = useState({
		username: "",
		full_name: "",
		email: "",
		phone: "",
		password: "",
		role: "customer",
		is_active: true,
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

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
		if (!formData.username.trim()) nextErrors.username = "Vui lòng nhập tên đăng nhập";
		if (!formData.full_name.trim()) nextErrors.full_name = "Vui lòng nhập họ tên";
		if (!formData.email.trim()) nextErrors.email = "Vui lòng nhập email";
		if (!formData.password.trim()) nextErrors.password = "Vui lòng nhập mật khẩu";
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		setSubmitting(true);
		api.post("/users", {
			username: formData.username.trim(),
			full_name: formData.full_name.trim(),
			email: formData.email.trim(),
			phone: formData.phone.trim() || null,
			password: formData.password,
			role: formData.role,
			is_active: formData.is_active,
		})
			.then((response) => {
				const created = response?.data?.data ?? response?.data;
				showSuccess?.("Thêm người dùng thành công!");
				onCreated?.(created);
				handleClose();
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
					if (firstError) showError?.(firstError);
				} else {
					console.error("Error creating user:", error);
					showError?.("Thêm người dùng thất bại!");
				}
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		setFormData({
			username: "",
			full_name: "",
			email: "",
			phone: "",
			password: "",
			role: "customer",
			is_active: true,
		});
		setErrors({});
		setSubmitting(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						THÊM NGƯỜI DÙNG
					</Typography>
					<IconButton edge='end' color='inherit' onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<Box component='form' onSubmit={handleSubmit} noValidate>
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
						required
						label='Tên đăng nhập'
						name='username'
						value={formData.username}
						onChange={handleChange}
						error={!!errors.username}
						helperText={errors.username}
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
					<TextField
						fullWidth
						required
						label='Mật khẩu'
						name='password'
						type='password'
						value={formData.password}
						onChange={handleChange}
						error={!!errors.password}
						helperText={errors.password}
						margin='normal'
					/>
					<FormControl fullWidth margin='normal'>
						<InputLabel>Vai trò</InputLabel>
						<Select
							name='role'
							value={formData.role}
							onChange={handleChange}
							label='Vai trò'>
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
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button onClick={handleClose} variant='outlined' disabled={submitting}>
					Huy
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={submitting}>
					{submitting ? "Đang lưu..." : "Lưu người dùng"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
