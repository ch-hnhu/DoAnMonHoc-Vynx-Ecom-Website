import { useEffect, useState } from "react";
import {
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Snackbar,
	Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { getUser } from "../services/authService";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

export default function SupportRequestPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ LIÊN HỆ");
	const [supportRequests, setSupportRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [statusValue, setStatusValue] = useState("pending");
	const [activeRow, setActiveRow] = useState(null);
	const [updating, setUpdating] = useState(false);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const statusColor = {
		pending: "warning",
		processing: "info",
		resolved: "success",
	};
	//Refresh data
	const fetchSupportRequests = () => {
		setLoading(true);
		api.get("/support-requests")
			.then((response) => {
				setSupportRequests(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching support requests: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchSupportRequests();
	}, []);

	const handleUpdate = (row) => {
		setActiveRow(row);
		setStatusValue(row.status || "pending");
		setStatusDialogOpen(true);
	};

	const handleCloseStatusDialog = () => {
		setStatusDialogOpen(false);
		setActiveRow(null);
		setStatusValue("pending");
		setUpdating(false);
	};

	const handleSubmitStatus = () => {
		if (!activeRow) return;

		const currentUser = getUser();
		const payload = {
			status: statusValue,
			...(currentUser?.id ? { supported_by: currentUser.id } : {}),
		};

		setUpdating(true);
		api.put(`/support-requests/${activeRow.id}`, payload)
			.then(() => {
				showSuccess("Cập nhật trạng thái thành công!");
				fetchSupportRequests();
				handleCloseStatusDialog();
			})
			.catch((error) => {
				console.error("Error updating support request:", error);
				showError("Cập nhật trạng thái thất bại!");
				setUpdating(false);
			});
	};

	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa yêu cầu hỗ trợ này?")) {
			api.delete(`/support-requests/${id}`)
				.then(() => {
					showSuccess("Xóa yêu cầu hỗ trợ thành công!");
					fetchSupportRequests();
				})
				.catch((error) => {
					console.error("Error deleting support request:", error);
					showError("Xóa thất bại!");
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 80 },
		{ field: "full_name", headerName: "Họ và tên", width: 180 },
		{ field: "email", headerName: "Email", width: 220 },
		{ field: "phone", headerName: "Số điện thoại", width: 140 },
		{ field: "content", headerName: "Nội dung", width: 260 },
		{
			field: "status",
			headerName: "Trạng thái",
			width: 140,
			renderCell: (params) => renderChip(params.value, statusColor),
		},
		{
			field: "supported_by",
			headerName: "Nhân viên hỗ trợ",
			width: 150,
			valueGetter: (params, row) => row.user?.email || row.supported_by || "-",
		},
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 140,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "updated_at",
			headerName: "Ngày cập nhật",
			width: 140,
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
							onClick={() => handleUpdate(params.row)}
							sx={{
								px: 1,
								py: 0.5,
								fontSize: "0.75rem",
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
								maxWidth: 160,
							}}>
							<Box
								component='span'
								sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
								Cập nhật trạng thái
							</Box>
						</Button>
						<Button
							variant='outlined'
							color='error'
							size='small'
							startIcon={<DeleteIcon />}
							onClick={() => handleDelete(params.row.id)}
							sx={{
								px: 1,
								py: 0.5,
								fontSize: "0.75rem",
								whiteSpace: "nowrap",
							}}>
							Xóa
						</Button>
					</Box>
				);
			},
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Liên hệ", active: true },
	];

	return (
		<>
			<DataTable
				columns={columns}
				rows={supportRequests}
				loading={loading}
				title='Quản lý liên hệ'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
			/>
			<Dialog
				open={statusDialogOpen}
				onClose={handleCloseStatusDialog}
				maxWidth='xs'
				fullWidth>
				<DialogTitle>Cập nhật trạng thái</DialogTitle>
				<DialogContent dividers>
					<FormControl fullWidth>
						<InputLabel>Trạng thái</InputLabel>
						<Select
							value={statusValue}
							label='Trang thai'
							onChange={(event) => setStatusValue(event.target.value)}>
							<MenuItem value='pending'>Chờ xử lý</MenuItem>
							<MenuItem value='processing'>Đang xử lý</MenuItem>
							<MenuItem value='resolved'>Đã xử lý</MenuItem>
						</Select>
						<FormHelperText>Chọn trạng thái hỗ trợ mới</FormHelperText>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseStatusDialog}
						variant='outlined'
						disabled={updating}>
						Hủy
					</Button>
					<Button onClick={handleSubmitStatus} variant='contained' disabled={updating}>
						{updating ? "Đang lưu..." : "Lưu"}
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
