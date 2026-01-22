import { useEffect, useRef, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	IconButton,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import api from "../../services/api";
import { getProductImage } from "@shared/utils/productHelper.jsx";
import { useToast } from "@shared/hooks/useToast";

export default function EditBrand({ open, onClose, brand, onUpdated }) {
	const { toast, showSuccess, showError, closeToast } = useToast();
	const [formData, setFormData] = useState({
		name: "",
		logo_url: "",
		description: "",
	});
	const [logoFile, setLogoFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState("");
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const logoInputRef = useRef(null);

	useEffect(() => {
		if (brand) {
			setFormData({
				name: brand.name || "",
				logo_url: brand.logo_url || "",
				description: brand.description || "",
			});
			setLogoFile(null);
			setLogoPreview(brand.logo_url ? getProductImage(brand.logo_url) : "");
			setErrors({});
		}
	}, [brand, open]);

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

		if (!formData.name.trim()) {
			nextErrors.name = "Vui lòng nhập tên thương hiệu.";
		} else if (formData.name.length > 255) {
			nextErrors.name = "Tên thương hiệu tối đa 255 ký tự.";
		}

		if (formData.description.length > 1000) {
			nextErrors.description = "Mô tả tối đa 1000 ký tự.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate() || !brand) {
			return;
		}

		setSubmitting(true);
		const payload = new FormData();
		payload.append("name", formData.name.trim());
		if (!logoFile && formData.logo_url.trim()) {
			payload.append("logo_url", formData.logo_url.trim());
		}
		if (formData.description.trim()) {
			payload.append("description", formData.description.trim());
		}
		if (logoFile) {
			payload.append("logo", logoFile);
		}

		api.put(`/brands/${brand.id}`, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
			.then((response) => {
				const updated = response?.data?.data ?? response?.data;
				showSuccess("Cập nhật thương hiệu thành công!");
				onUpdated?.(updated);
				setTimeout(() => {
					handleClose();
				}, 1500);
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
						showError(firstError);
					}
				} else {
					console.error("Error updating brand:", error);
					showError("Cập nhật thương hiệu thất bại!");
				}
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		setFormData({
			name: "",
			logo_url: "",
			description: "",
		});
		setLogoFile(null);
		setLogoPreview("");
		setErrors({});
		setSubmitting(false);
		closeToast();
		onClose();
	};

	const handleLogoChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}
		setLogoFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setLogoPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveLogo = () => {
		setLogoFile(null);
		setLogoPreview(brand?.logo_url ? getProductImage(brand.logo_url) : "");
		if (logoInputRef.current) {
			logoInputRef.current.value = "";
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Typography variant="h6" component="div">
						CHỈNH SỬA THƯƠNG HIỆU
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
							THÔNG TIN THƯƠNG HIỆU
						</Typography>
					</Box>

					<Grid container spacing={2}>
						<Grid size={12}>
							<TextField
								fullWidth
								required
								label="Tên thương hiệu"
								name="name"
								value={formData.name}
								onChange={handleChange}
								error={!!errors.name}
								helperText={errors.name || `${formData.name.length}/255`}
								inputProps={{ maxLength: 255 }}
							/>
						</Grid>

						<Grid size={12}>
							<Typography variant="subtitle1" sx={{ mb: 1 }}>
								Ảnh logo
							</Typography>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
									flexWrap: "wrap",
								}}
							>
								{logoPreview || formData.logo_url ? (
									<Box
										component="img"
										src={
											logoPreview ||
											(formData.logo_url ? getProductImage(formData.logo_url) : "")
										}
										alt="logo-preview"
										sx={{
										width: 96,
										height: 96,
										borderRadius: 2,
										objectFit: "contain",
										border: "1px solid #e5e7eb",
										backgroundColor: "#f9fafb",
										p: 1,
									}}
										onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
									/>
								) : (
									<Box
									sx={{
										width: 96,
										height: 96,
										borderRadius: 2,
										border: "1px dashed #cbd5f5",
										backgroundColor: "#f8fafc",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#64748b",
										fontSize: 12,
									}}
								>
									Ch?a c? ?nh
								</Box>
								)}
								<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
									<input
										ref={logoInputRef}
										type="file"
										accept="image/*"
										hidden
										onChange={handleLogoChange}
									/>
									<Button variant="outlined" onClick={() => logoInputRef.current?.click()}>
										Chọn ảnh
									</Button>
									<Button variant="text" color="error" onClick={handleRemoveLogo}>
										Xóa ảnh
									</Button>
								</Box>
							</Box>
						</Grid>

						<Grid size={12}>
							<TextField
								fullWidth
								multiline
								rows={4}
								label="Mô tả"
								name="description"
								value={formData.description}
								onChange={handleChange}
								error={!!errors.description}
								helperText={errors.description || `${formData.description.length}/1000`}
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
