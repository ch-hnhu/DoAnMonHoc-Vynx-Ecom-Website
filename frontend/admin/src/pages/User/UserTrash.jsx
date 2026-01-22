import { useEffect, useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { userStatusColors, getUserStatusName } from "@shared/utils/userHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function UserTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC NGƯỜI DÙNG");
	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	

	const fetchTrashedUsers = (model = paginationModel) => {
		setLoading(true);
		api.get("/users/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setUsers(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách người dùng đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed users: ", error);
				showError("Lỗi khi tải danh sách người dùng đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedUsers(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (user) => {
		if (!user) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục người dùng: "${user.username}"?`)) {
			api.post(`/users/${user.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục người dùng thành công!");
						fetchTrashedUsers(paginationModel);
					} else {
						showError("Khôi phục người dùng thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring user:", error);
					showError("Khôi phục người dùng thất bại!");
				});
		}
	};

	const handleForceDelete = (user) => {
		if (!user) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn người dùng: "${user.username}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/users/${user.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn người dùng thành công!");
						fetchTrashedUsers(paginationModel);
					} else {
						showError("Xóa vĩnh viễn người dùng thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting user:", error);
					showError("Xóa vĩnh viễn người dùng thất bại!");
				});
		}
	};

	const handleBackToUsers = () => {
		navigate("/nguoi-dung");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "username", headerName: "Tên đăng nhập", width: 160 },
		{ field: "full_name", headerName: "Họ tên", width: 220 },
		{ field: "email", headerName: "Email", width: 220 },
		{ field: "phone", headerName: "Số điện thoại", width: 150 },
		{ field: "role", headerName: "Vai trò", width: 120 },
		{
			field: "is_active",
			headerName: "Trạng thái",
			width: 130,
			valueGetter: (value, row) => getUserStatusName(row.is_active),
			renderCell: (params) => renderChip(params.value, userStatusColors),
		},
		{
			field: "deleted_at",
			headerName: "Ngày xóa",
			width: 180,
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
		{ label: "Người dùng", href: "/nguoi-dung" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={users}
				loading={loading}
				title='Thùng rác người dùng'
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
						onClick={handleBackToUsers}
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



