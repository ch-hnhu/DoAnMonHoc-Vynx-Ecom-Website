import { useEffect, useState } from "react";
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
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

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
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const { toast, showSuccess, showError, closeToast } = useToast();
	const statusColor = {
		Active: "success",
		Inactive: "default",
	};

	const fetchConfigurations = () => {
		setLoading(true);
		api.get("/configuration")
			.then((response) => {
				setConfigurations(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching configurations: ", error);
				showError("Tải cấu hình thất bại!");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchConfigurations();
	}, []);

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
		const payload = {
			logo: formData.logo.trim() || null,
			name: formData.name.trim(),
			email: formData.email.trim(),
			phone: formData.phone.trim(),
			address: formData.address.trim(),
			is_active: !!formData.is_active,
		};

		const request = isCreateMode
			? api.post("/configuration", payload)
			: api.put(`/configuration/${selectedConfig?.id}`, payload);

		request
			.then((response) => {
				const updated = response?.data?.data ?? payload;
				if (isCreateMode) {
					showSuccess("Tạo cấu hình thành công!");
					setConfigurations((prev) => [updated, ...prev]);
				} else {
					showSuccess("Cập nhật cấu hình thành công!");
					setConfigurations((prev) =>
						prev.map((item) =>
							item.id === selectedConfig.id ? { ...item, ...updated } : item
						)
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
		setErrors({});
		setSubmitting(false);
		closeToast();
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên cấu hình", width: 200 },
		{ field: "email", headerName: "Email", width: 200 },
		{ field: "phone", headerName: "Số điện thoại", width: 150 },
		{ field: "address", headerName: "Địa chỉ", width: 240 },
		{ field: "logo", headerName: "Logo", width: 200 },
		{
			field: "is_active",
			headerName: "Trạng thái",
			width: 130,
			renderCell: (params) => {
				return params.value
					? renderChip("Active", statusColor)
					: renderChip("Inactive", statusColor);
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
			width: 200,
			sortable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
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

	return (
		<>
			<DataTable
				columns={columns}
				rows={configurations}
				loading={loading}
				title='Quản lý cấu hình'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
				actions={
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
						<TextField
							fullWidth
							label='Logo (URL)'
							name='logo'
							value={formData.logo}
							onChange={handleChange}
							margin='normal'
						/>
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
			</Dialog>

			<Snackbar
				open={toast.open}
				autoHideDuration={toast.duration}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
