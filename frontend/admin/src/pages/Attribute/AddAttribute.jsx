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
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import api from "../../services/api";

const ATTRIBUTE_TYPES = [
	{ value: "specification", label: "Thông số" },
	{ value: "variant", label: "Biến thể" },
	{ value: "both", label: "Cả hai" },
];

const DATA_TYPES = [
	{ value: "string", label: "Chuỗi" },
	{ value: "number", label: "Số" },
	{ value: "decimal", label: "Số thập phân" },
	{ value: "boolean", label: "Đúng/Sai" },
	{ value: "date", label: "Ngày" },
];

export default function AddAttribute({ open, onClose, onCreated, showSuccess, showError }) {
	const [formData, setFormData] = useState({
		name: "",
		attribute_type: "specification",
		data_type: "string",
		unit: "",
		is_filterable: false,
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const nextValue = type === "checkbox" ? checked : value;
		setFormData((prev) => ({
			...prev,
			[name]: nextValue,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validate = () => {
		const nextErrors = {};

		if (!formData.name.trim()) {
			nextErrors.name = "Vui lòng nhập tên thuộc tính.";
		} else if (formData.name.length > 255) {
			nextErrors.name = "Tên thuộc tính tối đa 255 ký tự.";
		}

		if (!formData.attribute_type) {
			nextErrors.attribute_type = "Vui lòng chọn loại thuộc tính.";
		}

		if (!formData.data_type) {
			nextErrors.data_type = "Vui lòng chọn kiểu dữ liệu.";
		}

		if (formData.unit.length > 255) {
			nextErrors.unit = "Đơn vị tối đa 255 ký tự.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setSubmitting(true);
		const payload = {
			name: formData.name.trim(),
			attribute_type: formData.attribute_type,
			data_type: formData.data_type,
			unit: formData.unit.trim() || null,
			is_filterable: !!formData.is_filterable,
		};

		api.post("/attributes", payload)
			.then((response) => {
				const created = response?.data?.data ?? response?.data;
				showSuccess?.("Thêm thuộc tính thành công!");
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
					if (firstError) {
						showError?.(firstError);
					}
				} else {
					console.error("Error creating attribute:", error);
					showError?.("Thêm thuộc tính thất bại!");
				}
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		setFormData({
			name: "",
			attribute_type: "specification",
			data_type: "string",
			unit: "",
			is_filterable: false,
		});
		setErrors({});
		setSubmitting(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Typography variant="h6" component="div">
						THÊM THUỘC TÍNH MỚI
					</Typography>
					<IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<Box component="form" onSubmit={handleSubmit} noValidate>
					<Box
						sx={{
							background: "linear-gradient(360deg, #234C6A 0%, #456882 100%)",
							borderRadius: 2,
							py: 1.5,
							px: 2,
							mb: 3,
							boxShadow: "0 4px 6px rgba(35, 76, 106, 0.3)",
						}}
					>
						<Typography
							variant="h5"
							fontWeight="bold"
							align="center"
							sx={{ color: "white", letterSpacing: 1 }}
						>
							THÔNG TIN THUỘC TÍNH
						</Typography>
					</Box>

					<Grid container spacing={2}>
						<Grid size={12}>
							<TextField
								fullWidth
								required
								label="Tên thuộc tính"
								name="name"
								value={formData.name}
								onChange={handleChange}
								error={!!errors.name}
								helperText={errors.name || `${formData.name.length}/255`}
								inputProps={{ maxLength: 255 }}
							/>
						</Grid>

						<Grid size={6}>
							<FormControl fullWidth error={!!errors.attribute_type}>
								<InputLabel>Loại thuộc tính</InputLabel>
								<Select
									name="attribute_type"
									value={formData.attribute_type}
									onChange={handleChange}
									label="Loại thuộc tính"
								>
									{ATTRIBUTE_TYPES.map((item) => (
										<MenuItem key={item.value} value={item.value}>
											{item.label}
										</MenuItem>
									))}
								</Select>
								{errors.attribute_type && (
									<FormHelperText>{errors.attribute_type}</FormHelperText>
								)}
							</FormControl>
						</Grid>

						<Grid size={6}>
							<FormControl fullWidth error={!!errors.data_type}>
								<InputLabel>Kiểu dữ liệu</InputLabel>
								<Select
									name="data_type"
									value={formData.data_type}
									onChange={handleChange}
									label="Kiểu dữ liệu"
								>
									{DATA_TYPES.map((item) => (
										<MenuItem key={item.value} value={item.value}>
											{item.label}
										</MenuItem>
									))}
								</Select>
								{errors.data_type && (
									<FormHelperText>{errors.data_type}</FormHelperText>
								)}
							</FormControl>
						</Grid>

						<Grid size={12}>
							<TextField
								fullWidth
								label="Đơn vị"
								name="unit"
								value={formData.unit}
								onChange={handleChange}
								error={!!errors.unit}
								helperText={errors.unit || `${formData.unit.length}/255`}
								inputProps={{ maxLength: 255 }}
							/>
						</Grid>

						<Grid size={12}>
							<FormControlLabel
								control={
									<Checkbox
										name="is_filterable"
										checked={formData.is_filterable}
										onChange={handleChange}
									/>
								}
								label="Dùng để lọc"
							/>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={handleClose}
					variant="outlined"
					disabled={submitting}
					sx={{
						color: "#234C6A",
						borderColor: "#234C6A",
						"&:hover": {
							backgroundColor: "#1B3C53",
							color: "#ffffff",
						},
					}}
				>
					Hủy
				</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					disabled={submitting}
					sx={{
						backgroundColor: "#234C6A",
						"&:hover": { backgroundColor: "#1B3C53" },
					}}
				>
					{submitting ? "Đang lưu..." : "Lưu thuộc tính"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
