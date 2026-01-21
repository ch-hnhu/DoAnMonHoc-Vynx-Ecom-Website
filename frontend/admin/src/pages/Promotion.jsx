import { useEffect, useState } from "react";
import {
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	Typography,
	Snackbar,
	Alert,
	IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@shared/hooks/useToast";

export default function PromotionPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ KHUYẾN MÃI");
	
	const [promotions, setPromotions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedPromotion, setSelectedPromotion] = useState(null);
	const [formData, setFormData] = useState({
		code: "",
		name: "",
		description: "",
		discount_type: "percent",
		discount_value: "",
		start_date: "",
		end_date: "",
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const { toast, showSuccess, showError, closeToast } = useToast();
	const discountTypeColor = {
		percent: "info",
		fixed: "success",
	};

	const fetchPromotions = () => {
		setLoading(true);
		api.get("/promotions")
			.then((response) => {
				setPromotions(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching promotions: ", error);
				showError("Tải danh sách khuyến mãi thất bại. Vui lòng thử lại.");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchPromotions();
	}, []);

	const toInputDateTime = (value) => {
		if (!value) return "";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "";
		const pad = (n) => String(n).padStart(2, "0");
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
			date.getDate()
		)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
	};

	const handleCreate = () => {
		setIsEditMode(false);
		setSelectedPromotion(null);
		setFormData({
			code: "",
			name: "",
			description: "",
			discount_type: "percent",
			discount_value: "",
			start_date: "",
			end_date: "",
		});
		setErrors({});
		setOpenDialog(true);
	};

	const handleEdit = (promotion) => {
		setIsEditMode(true);
		setSelectedPromotion(promotion);
		setFormData({
			code: promotion?.code || "",
			name: promotion?.name || "",
			description: promotion?.description || "",
			discount_type: promotion?.discount_type || "percent",
			discount_value:
				promotion?.discount_value === 0 || promotion?.discount_value
					? promotion.discount_value
					: "",
			start_date: toInputDateTime(promotion?.start_date),
			end_date: toInputDateTime(promotion?.end_date),
		});
		setErrors({});
		setOpenDialog(true);
	};

	const handleDelete = (id) => {
		console.log("Delete promotion:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này?")) {
			api.delete(`/promotions/${id}`)
				.then(() => {
					showSuccess("Xóa mã khuyến mãi thành công!");
					fetchPromotions();
				})
				.catch((error) => {
					console.error("Error deleting promotion: ", error);
					showError("Xóa mã khuyến mãi thất bại. Vui lòng thử lại.");
				});
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const validateForm = () => {
		const nextErrors = {};
		if (!formData.code.trim()) nextErrors.code = "Vui lòng nhập mã khuyến mãi";
		if (!formData.name.trim()) nextErrors.name = "Vui lòng nhập tên mã";
		if (!formData.discount_type) nextErrors.discount_type = "Vui lòng chọn loại giảm";
		if (formData.discount_value === "" || formData.discount_value === null) {
			nextErrors.discount_value = "Vui lòng nhập giá trị giảm";
		} else if (Number(formData.discount_value) <= 0) {
			nextErrors.discount_value = "Giá trị giảm phải lớn hơn 0";
		} else if (
			formData.discount_type === "percent" &&
			Number(formData.discount_value) > 100
		) {
			nextErrors.discount_value = "Giá trị phần trăm tối đa 100";
		}
		if (!formData.start_date) nextErrors.start_date = "Vui lòng chọn ngày bắt đầu";
		if (!formData.end_date) nextErrors.end_date = "Vui lòng chọn ngày kết thúc";
		if (formData.start_date && formData.end_date) {
			const start = new Date(formData.start_date);
			const end = new Date(formData.end_date);
			if (start > end) {
				nextErrors.end_date = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu";
			}
		}
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			const firstError = Object.values(nextErrors)[0];
			if (firstError) {
				showError(firstError);
			}
		}
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!validateForm()) return;
		setSubmitting(true);
		const payload = {
			code: formData.code.trim(),
			name: formData.name.trim(),
			description: formData.description.trim(),
			discount_type: formData.discount_type,
			discount_value: Number(formData.discount_value),
			start_date: formData.start_date,
			end_date: formData.end_date,
		};

		const request = isEditMode
			? api.put(`/promotions/${selectedPromotion?.id}`, payload)
			: api.post("/promotions", payload);

		request
			.then(() => {
				showSuccess(
					isEditMode ? "Cập nhật mã khuyến mãi thành công!" : "Thêm mã khuyến mãi thành công!"
				);
				setTimeout(() => {
					handleCloseDialog();
					fetchPromotions();
				}, 1500);
			})
			.catch((error) => {
				const apiMessage = error?.response?.data?.message;
				console.error("Error saving promotion: ", error);
				showError(apiMessage || "Lưu mã khuyến mãi thất bại. Vui lòng thử lại.");
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedPromotion(null);
		setErrors({});
		setSubmitting(false);
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "code", headerName: "Mã", width: 140 },
		{ field: "name", headerName: "Tên mã", width: 200 },
		{
			field: "discount_type",
			headerName: "Loại giảm",
			width: 140,
			renderCell: (params) => renderChip(params.value, discountTypeColor),
		},
		{
			field: "discount_value",
			headerName: "Giá trị giảm",
			width: 150,
			valueFormatter: (params) => {
				if (params == null) {
					return "";
				}
				if (params > 1 && params <= 100) {
					return `${params}%`;
				}
				return formatCurrency(params);
			},
		},
		{
			field: "start_date",
			headerName: "Bắt đầu",
			width: 150,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "end_date",
			headerName: "Kết thúc",
			width: 150,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{ field: "description", headerName: "Mô tả", width: 240 },
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
		{ label: "Mã khuyến mãi", active: true },
	];

	return (
		<>
			<DataTable
				columns={columns}
				rows={promotions}
				loading={loading}
				title='Quản lý mã khuyến mãi'
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
						Thêm mã khuyến mãi
					</Button>
				}
			/>

			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
				
				<DialogTitle>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Typography variant="h6" component="div">
						{isEditMode ? "CẬP NHẬT MÃ KHUYẾN MÃI" : "THÊM MÃ KHUYẾN MÃI"}
					</Typography>
					<IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>
				<DialogContent dividers>
					<Box component='form' id='promotion-form' onSubmit={handleSubmit} noValidate>
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
							{isEditMode ? "CẬP NHẬT THÔNG TIN MÃ KHUYẾN MÃI" : "THÔNG TIN MÃ KHUYẾN MÃI"}
						</Typography>
					</Box>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<TextField
									label='Mã khuyến mãi'
									name='code'
									value={formData.code}
									onChange={handleChange}
									fullWidth
									required
									error={!!errors.code}
									helperText={errors.code}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label='Tên mã'
									name='name'
									value={formData.name}
									onChange={handleChange}
									fullWidth
									required
									error={!!errors.name}
									helperText={errors.name}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth required error={!!errors.discount_type}>
									<InputLabel>Loại giảm</InputLabel>
									<Select
										name='discount_type'
										value={formData.discount_type}
										onChange={handleChange}
										label='Loại giảm'>
										<MenuItem value='percent'>Phần trăm</MenuItem>
										<MenuItem value='fixed'>Giảm cố định</MenuItem>
									</Select>
									{errors.discount_type && (
										<FormHelperText>{errors.discount_type}</FormHelperText>
									)}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label='Giá trị giảm'
									name='discount_value'
									type='number'
									value={formData.discount_value}
									onChange={handleChange}
									fullWidth
									required
									inputProps={{ min: 0 }}
									error={!!errors.discount_value}
									helperText={errors.discount_value}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label='Ngày bắt đầu'
									name='start_date'
									type='datetime-local'
									value={formData.start_date}
									onChange={handleChange}
									fullWidth
									required
									InputLabelProps={{ shrink: true }}
									error={!!errors.start_date}
									helperText={errors.start_date}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label='Ngày kết thúc'
									name='end_date'
									type='datetime-local'
									value={formData.end_date}
									onChange={handleChange}
									fullWidth
									required
									InputLabelProps={{ shrink: true }}
									error={!!errors.end_date}
									helperText={errors.end_date}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label='Mô tả'
									name='description'
									value={formData.description}
									onChange={handleChange}
									fullWidth
									multiline
									rows={3}
								/>
							</Grid>
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color='inherit'>
						Hủy
					</Button>
					<Button type='submit' form='promotion-form' variant='contained' disabled={submitting}>
						{submitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo mới"}
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
			
		</>
	);
}