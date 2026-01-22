import { useEffect, useRef, useState } from "react";
import {
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControlLabel,
	Switch,
	Snackbar,
	Alert,
	IconButton,
	Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import {
	configurationStatusColors,
	getConfigurationStatusName,
} from "@shared/utils/configurationHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import PageTransition from "../components/PageTransition";

export default function ConfigurationPage() {
	useDocumentTitle("VYNX ADMIN | CẤU HÌNH HỆ THỐNG");
	
	const [configurations, setConfigurations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedConfig, setSelectedConfig] = useState(null);
	const [isCreateMode, setIsCreateMode] = useState(false);
	const [formData, setFormData] = useState({
		logo: "",
		name: "",
		email: "",
		phone: "",
		address: "",
		is_active: false,
	});
	const [logoFile, setLogoFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState("");
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [togglingId, setTogglingId] = useState(null);
	const [showAllConfigurations, setShowAllConfigurations] = useState(false);
	const { toast, showSuccess, showError, closeToast } = useToast();
	const logoInputRef = useRef(null);

	const fetchConfigurations = () => {
		setLoading(true);
		const endpoint = showAllConfigurations ? "/configuration/all" : "/configuration";
		api.get(endpoint)
			.then((response) => {
				setConfigurations(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching cau-hinh: ", error);
				showError("Tải cấu hình thất bại!");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchConfigurations();
	}, [showAllConfigurations]);

	const handleToggleShowAll = () => {
		setShowAllConfigurations((prev) => !prev);
	};

	const handleCreate = () => {
		setSelectedConfig(null);
		setIsCreateMode(true);
		setFormData({
			logo: "",
			name: "",
			email: "",
			phone: "",
			address: "",
			is_active: false,
		});
		setLogoFile(null);
		setLogoPreview("");
		setErrors({});
		setOpenEditDialog(true);
	};

	const handleEdit = (row) => {
		setSelectedConfig(row);
		setIsCreateMode(false);
		setFormData({
			logo: row.logo || "",
			name: row.name || "",
			email: row.email || "",
			phone: row.phone || "",
			address: row.address || "",
			is_active: !!row.is_active,
		});
		setLogoFile(null);
		setLogoPreview(row.logo || "");
		setErrors({});
		setOpenEditDialog(true);
	};

	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
			api.delete(`/configuration/${id}`)
				.then(() => {
					showSuccess("Xóa thành công!");
					setConfigurations(
						configurations.filter((configuration) => configuration.id !== id)
					);
				})
				.catch((error) => {
					console.error("Error deleting configuration:", error);
					showError("Xóa thất bại!");
				});
		}
	};

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

	const handleToggleActive = (e) => {
		setFormData((prev) => ({
			...prev,
			is_active: e.target.checked,
		}));
	};

	const handleLogoChange = (e) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			setLogoFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result);
			};
			reader.readAsDataURL(file);
			setFormData((prev) => ({ ...prev, logo: "" }));
		}
		e.target.value = "";
	};

	const handleRemoveLogo = () => {
		setLogoFile(null);
		setLogoPreview("");
		setFormData((prev) => ({ ...prev, logo: "" }));
	};

	const validate = () => {
		const nextErrors = {};
		if (!formData.name.trim()) nextErrors.name = "Vui lòng nhập tên cấu hình";
		if (!formData.email.trim()) {
			nextErrors.email = "Vui lòng nhập email";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			nextErrors.email = "Email không hợp lệ";
		}
		if (!formData.phone.trim()) nextErrors.phone = "Vui lòng nhập số điện thoại";
		if (!formData.address.trim()) nextErrors.address = "Vui lòng nhập địa chỉ";
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		setSubmitting(true);
		const formDataToSend = new FormData();
		formDataToSend.append("name", formData.name.trim());
		formDataToSend.append("email", formData.email.trim());
		formDataToSend.append("phone", formData.phone.trim());
		formDataToSend.append("address", formData.address.trim());
		formDataToSend.append("is_active", formData.is_active ? 1 : 0);

		if (logoFile) {
			formDataToSend.append("logo", logoFile);
		} else if (formData.logo?.trim()) {
			formDataToSend.append("logo", formData.logo.trim());
		}

		const request = isCreateMode
			? api.post("/configuration", formDataToSend, {
					headers: { "Content-Type": "multipart/form-data" },
			  })
			: api.put(`/configuration/${selectedConfig?.id}`, formDataToSend, {
					headers: { "Content-Type": "multipart/form-data" },
			  });

		request
			.then((response) => {
				const updated = response?.data?.data ?? {};
				if (isCreateMode) {
					showSuccess("Tạo cấu hình thành công!");
					setConfigurations((prev) => {
						const next = updated.is_active
							? prev.map((item) => ({ ...item, is_active: false }))
							: prev;
						return [updated, ...next];
					});
				} else {
					showSuccess("Cập nhật cấu hình thành công!");
					setConfigurations((prev) =>
						prev.map((item) => {
							if (item.id === selectedConfig.id) {
								return { ...item, ...updated };
							}
							if (updated.is_active) {
								return { ...item, is_active: false };
							}
							return item;
						})
					);
				}
				setTimeout(() => {
					handleCloseEdit();
				}, 1000);
			})
			.catch((error) => {
				console.error("Error saving configuration:", error);
				showError(isCreateMode ? "Tạo cấu hình thất bại!" : "Cập nhật cấu hình thất bại!");
				setSubmitting(false);
			});
	};

	const handleCloseEdit = () => {
		setOpenEditDialog(false);
		setSelectedConfig(null);
		setIsCreateMode(false);
		setFormData({
			logo: "",
			name: "",
			email: "",
			phone: "",
			address: "",
			is_active: false,
		});
		setLogoFile(null);
		setLogoPreview("");
		setErrors({});
		setSubmitting(false);
		closeToast();
	};

	const handleToggleRowActive = (row, nextActive) => {
		if (row.is_active && !nextActive) {
			const currentActiveCount = configurations.filter((item) => item.is_active).length;
			if (currentActiveCount <= 1) {
				showError("Không thể tắt cấu hình active cuối cùng!");
				return;
			}
		}
		setTogglingId(row.id);
		api
			.put(`/configuration/${row.id}`, {
				name: row.name,
				email: row.email,
				phone: row.phone,
				address: row.address,
				is_active: nextActive,
			})
			.then((response) => {
				const updated = response?.data?.data ?? {};
				setConfigurations((prev) =>
					prev.map((item) => {
						if (item.id === row.id) {
							return { ...item, ...updated };
						}
						if (updated.is_active) {
							return { ...item, is_active: false };
						}
						return item;
					})
				);
				showSuccess(nextActive ? "Đã kích hoạt cấu hình!" : "Đã tắt cấu hình!");
			})
			.catch((error) => {
				console.error("Error toggling configuration:", error);
				showError("Thao tác thất bại!");
			})
			.finally(() => {
				setTogglingId(null);
			});
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên cấu hình", width: 200 },
		{ field: "email", headerName: "Email", width: 200 },
		{ field: "phone", headerName: "Số điện thoại", width: 150 },
		{ field: "address", headerName: "Địa chỉ", width: 240 },
		{
			field: "logo",
			headerName: "Logo",
			width: 120,
			renderCell: (params) => {
				return params.value ? (
					<Box
						component='img'
						src={params.value}
						alt='Logo'
						sx={{ width: 48, height: 48, objectFit: "contain", borderRadius: 1 }}
					/>
				) : (
					<Typography variant='body2' color='text.secondary'>
						—
					</Typography>
				);
			},
		},
		{
			field: "is_active",
			headerName: "Trạng thái",
			width: 130,
			renderCell: (params) => {
				const label = getConfigurationStatusName(params.value);
				return renderChip(label, configurationStatusColors);
			},
		},
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 150,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "actions",
			headerName: "Thao tác",
			width: 300,
			sortable: false,
			renderCell: (params) => {
				const isActive = !!params.row.is_active;
				const isToggling = togglingId === params.row.id;
				const isLastActive = isActive && activeCount <= 1;
				return (
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
						<Button
							variant='outlined'
							color={isActive ? "warning" : "success"}
							size='small'
							disabled={isToggling || isLastActive}
							onClick={() => handleToggleRowActive(params.row, !isActive)}>
							{isToggling ? "Đang xử lý..." : isActive ? "Tắt" : "Kích hoạt"}
						</Button>
						<Button
							variant='outlined'
							color='primary'
							size='small'
							startIcon={<EditIcon />}
							onClick={() => handleEdit(params.row)}>
							Sửa
						</Button>
						<Button
							variant='outlined'
							color='error'
							size='small'
							startIcon={<DeleteIcon />}
							onClick={() => handleDelete(params.row.id)}>
							Xóa
						</Button>
					</Box>
				);
			},
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Cấu hình", active: true },
	];

	const activeCount = configurations.filter((item) => item.is_active).length;

	return (
		<PageTransition>
			{activeCount > 1 && (
				<Alert severity='warning' sx={{ mb: 2 }}>
					Có {activeCount} cấu hình đang được kích hoạt. Vui lòng tắt bớt để chỉ còn 1
					 cấu hình active.
				</Alert>
			)}
			<DataTable
				columns={columns}
				rows={configurations}
				loading={loading}
				title='Quản lý cấu hình'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
				actions={
					<Box sx={{ display: "flex", gap: 1 }}>
						<Button
							variant='contained'
							startIcon={<AddIcon />}
							onClick={handleCreate}
							sx={{
								backgroundColor: "#234C6A",
								"&:hover": { backgroundColor: "#1B3C53" },
							}}>
							Thêm cấu hình
						</Button>
						<Button
							variant={showAllConfigurations ? "outlined" : "contained"}
							onClick={handleToggleShowAll}
							sx={{
								borderColor: showAllConfigurations ? "#e5e7eb" : "#16a34a",
								color: showAllConfigurations ? "#234C6A" : "#ffffff",
								backgroundColor: showAllConfigurations ? "#ffffff" : "#16a34a",
								"&:hover": {
									borderColor: showAllConfigurations ? "#cbd5f5" : "#15803d",
									color: showAllConfigurations ? "#1B3C53" : "#ffffff",
									backgroundColor: showAllConfigurations ? "#ffffff" : "#15803d",
								},
							}}>
							{showAllConfigurations ? "Chỉ hiển thị active" : "Hiển thị tất cả"}
						</Button>
					</Box>
				}
			/>

			<Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth='sm' fullWidth>
				<DialogTitle>
					<Box display='flex' alignItems='center' justifyContent='space-between'>
						<Typography variant='h6' component='div'>
							{isCreateMode ? "THÊM CẤU HÌNH" : "CẬP NHẬT CẤU HÌNH"}
						</Typography>
						<IconButton edge='end' color='inherit' onClick={handleCloseEdit}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent dividers>
					<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<Box sx={{ mt: 1 }}>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Logo
							</Typography>
							<input
								ref={logoInputRef}
								hidden
								type='file'
								accept='image/*'
								onChange={handleLogoChange}
							/>
							<Button
								variant='outlined'
								startIcon={<CloudUploadIcon />}
								onClick={() => logoInputRef.current?.click()}>
								Chọn logo
							</Button>
							{logoPreview ? (
								<Box
									sx={{
										mt: 2,
										width: 120,
										height: 120,
										border: "1px solid #e5e7eb",
										borderRadius: 2,
										overflow: "hidden",
										position: "relative",
										backgroundColor: "#fff",
									}}>
									<Box
										component='img'
										src={logoPreview}
										alt='Logo preview'
										sx={{ width: "100%", height: "100%", objectFit: "contain" }}
									/>
									<IconButton
										size='small'
										onClick={handleRemoveLogo}
										sx={{
											position: "absolute",
											top: 6,
											right: 6,
											bgcolor: "rgba(255,255,255,0.9)",
										}}>
										<DeleteIcon fontSize='small' />
									</IconButton>
								</Box>
							) : (
								<Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
									Chưa có logo
								</Typography>
							)}
						</Box>
						<TextField
							fullWidth
							label='Tên cấu hình'
							name='name'
							value={formData.name}
							onChange={handleChange}
							margin='normal'
							error={!!errors.name}
							helperText={errors.name}
							required
						/>
						<TextField
							fullWidth
							label='Email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							margin='normal'
							error={!!errors.email}
							helperText={errors.email}
							required
						/>
						<TextField
							fullWidth
							label='Số điện thoại'
							name='phone'
							value={formData.phone}
							onChange={handleChange}
							margin='normal'
							error={!!errors.phone}
							helperText={errors.phone}
							required
						/>
						<TextField
							fullWidth
							label='Địa chỉ'
							name='address'
							value={formData.address}
							onChange={handleChange}
							margin='normal'
							error={!!errors.address}
							helperText={errors.address}
							required
						/>
						<FormControlLabel
							control={
								<Switch
									checked={!!formData.is_active}
									onChange={handleToggleActive}
									color='primary'
								/>
							}
							label='Kích hoạt'
							sx={{ mt: 1 }}
						/>
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, py: 2 }}>
					<Button onClick={handleCloseEdit} variant='outlined' disabled={submitting}>
						Hủy
					</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
						disabled={submitting}
						sx={{
							backgroundColor: "#234C6A",
							"&:hover": { backgroundColor: "#1B3C53" },
						}}>
						{submitting ? "Đang lưu..." : isCreateMode ? "Tạo mới" : "Cập nhật"}
					</Button>
				</DialogActions>

				<Snackbar
					open={toast.open}
					autoHideDuration={toast.duration}
					onClose={closeToast}
					anchorOrigin={{ vertical: "top", horizontal: "right" }}>
					<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
						{toast.message}
					</Alert>
				</Snackbar>
			</Dialog>

		</PageTransition>
	);
}
