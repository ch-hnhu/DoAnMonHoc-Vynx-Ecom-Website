import { useEffect, useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import {
	supportRequestStatusColors,
	getSupportRequestStatusName,
} from "@shared/utils/supportRequestHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function SupportRequestTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC LIÊN HỆ");
	const navigate = useNavigate();

	const [supportRequests, setSupportRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedSupportRequests = (model = paginationModel) => {
		setLoading(true);
		api.get("/support-requests/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setSupportRequests(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách liên hệ đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed support requests: ", error);
				showError("Lỗi khi tải danh sách liên hệ đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedSupportRequests(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (supportRequest) => {
		if (!supportRequest) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục liên hệ ID: "${supportRequest.id}"?`)) {
			api.post(`/support-requests/${supportRequest.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục liên hệ thành công!");
						fetchTrashedSupportRequests(paginationModel);
					} else {
						showError("Khôi phục liên hệ thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring support request:", error);
					showError("Khôi phục liên hệ thất bại!");
				});
		}
	};

	const handleForceDelete = (supportRequest) => {
		if (!supportRequest) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn liên hệ ID: "${supportRequest.id}"?\n\nÁnh hưởng này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/support-requests/${supportRequest.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn liên hệ thành công!");
						fetchTrashedSupportRequests(paginationModel);
					} else {
						showError("Xóa vĩnh viễn liên hệ thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting support request:", error);
					showError("Xóa vĩnh viễn liên hệ thất bại!");
				});
		}
	};

	const handleBackToSupportRequests = () => {
		navigate("/lien-he");
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
			valueGetter: (value, row) => getSupportRequestStatusName(row.status),
			renderCell: (params) => renderChip(params.value, supportRequestStatusColors),
		},
		{
			field: "supported_by",
			headerName: "Nhân viên hỗ trợ",
			width: 150,
			valueGetter: (params, row) => row.user?.email || row.supported_by || "-",
		},
		{
			field: "deleted_at",
			headerName: "Ngày xóa",
			width: 140,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "actions",
			headerName: "Thao tác",
			width: 300,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
						<Button
							variant='contained'
							color='success'
							size='small'
							startIcon={<RestoreIcon />}
							onClick={() => handleRestore(params.row)}>
							Khôi phục
						</Button>
						<Button
							variant='contained'
							color='error'
							size='small'
							startIcon={<DeleteForeverIcon />}
							onClick={() => handleForceDelete(params.row)}>
							Xóa vĩnh viễn
						</Button>
					</Box>
				);
			},
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Liên hệ", href: "/lien-he" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={supportRequests}
				loading={loading}
				title='Thùng rác liên hệ'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				paginationMode='server'
				rowCount={rowCount}
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				checkboxSelection={true}
				actions={
					<Button
						variant='contained'
						startIcon={<ArrowBackIcon />}
						onClick={handleBackToSupportRequests}
						sx={{
							backgroundColor: "#234C6A",
							"&:hover": { backgroundColor: "#1B3C53" },
						}}>
						Quay lại danh sách
					</Button>
				}
			/>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</PageTransition>
	);
}


