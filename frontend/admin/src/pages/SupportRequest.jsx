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
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { useToast } from "@shared/hooks/useToast";

export default function SupportRequestPage() {
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

		setUpdating(true);
		api.put(`/support-requests/${activeRow.id}`, { status: statusValue })
			.then(() => {
				showSuccess("Cap nhat trang thai thanh cong!");
				fetchSupportRequests();
				handleCloseStatusDialog();
			})
			.catch((error) => {
				console.error("Error updating support request:", error);
				showError("Cap nhat trang thai that bai!");
				setUpdating(false);
			});
	};

	const handleDelete = (id) => {
		if (window.confirm("Ban co chac chan muon xoa yeu cau ho tro nay?")) {
			api.delete(`/support-requests/${id}`)
				.then(() => {
					alert("Xoa thanh cong!");
					fetchSupportRequests();
				})
				.catch((error) => {
					console.error("Error deleting support request:", error);
					alert("Xoa that bai!");
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 80 },
		{ field: "full_name", headerName: "Ho va ten", width: 180 },
		{ field: "email", headerName: "Email", width: 220 },
		{ field: "phone", headerName: "So dien thoai", width: 140 },
		{ field: "content", headerName: "Noi dung", width: 260 },
		{
			field: "status",
			headerName: "Trang thai",
			width: 140,
			renderCell: (params) => renderChip(params.value, statusColor),
		},
		{
			field: "supported_by",
			headerName: "Nhan vien ho tro",
			width: 150,
			valueGetter: (params, row) => row.supported_by ?? "-",
		},
		{
			field: "created_at",
			headerName: "Ngay tao",
			width: 140,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "updated_at",
			headerName: "Ngay cap nhat",
			width: 140,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "actions",
			headerName: "Thao tac",
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
							<Box component='span' sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
								Cap nhat trang thai
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
							Xoa
						</Button>
					</Box>
				);
			},
		},
	];

	const breadcrumbs = [
		{ label: "Trang chu", href: "/" },
		{ label: "Ho tro", active: true },
	];

	return (
		<>
			<DataTable
				columns={columns}
				rows={supportRequests}
				loading={loading}
				title='Quan ly ho tro'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
			/>
			<Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog} maxWidth='xs' fullWidth>
				<DialogTitle>Cap nhat trang thai</DialogTitle>
				<DialogContent dividers>
					<FormControl fullWidth>
						<InputLabel>Trang thai</InputLabel>
						<Select
							value={statusValue}
							label='Trang thai'
							onChange={(event) => setStatusValue(event.target.value)}
						>
							<MenuItem value='pending'>Pending</MenuItem>
							<MenuItem value='processing'>Processing</MenuItem>
							<MenuItem value='resolved'>Resolved</MenuItem>
						</Select>
						<FormHelperText>Chon trang thai ho tro moi</FormHelperText>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseStatusDialog} variant='outlined' disabled={updating}>
						Huy
					</Button>
					<Button onClick={handleSubmitStatus} variant='contained' disabled={updating}>
						{updating ? "Dang luu..." : "Luu"}
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
