import { useEffect, useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { userStatusColors, getUserStatusName } from "@shared/utils/userHelper.jsx";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/hooks/useToast";
import AddUser from "./AddUser.jsx";
import EditUser from "./EditUser.jsx";
import UserDetails from "./UserDetails.jsx";
import PageTransition from "../../components/PageTransition";

export default function UserPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ NGƯỜI DÙNG");
	const navigate = useNavigate();
	const { toast, showSuccess, showError, closeToast } = useToast();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const fetchUsers = () => {
		setLoading(true);
		api.get("/users")
			.then((response) => {
				setUsers(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching users: ", error);
				showError("Tải danh sách người dùng thất bại!");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleCreate = () => {
		setOpenAddDialog(true);
	};

	const handleEdit = (row) => {
		setSelectedUser(row);
		setOpenEditDialog(true);
	};

	const handleView = (row) => {
		setSelectedUser(row);
		setOpenViewDialog(true);
	};

	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
			api.delete(`/users/${id}`)
				.then(() => {
					showSuccess("Xóa người dùng thành công!");
					fetchUsers();
				})
				.catch((error) => {
					console.error("Error deleting user:", error);
					showError("Xóa người dùng thất bại!");
				});
		}
	};

	const handleGoToTrash = () => {
		navigate("/nguoi-dung/thung-rac");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "username", headerName: "Username", width: 160 },
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
			width: 240,
			sortable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
						<Button
							variant='outlined'
							color='primary'
							size='small'
							startIcon={<VisibilityIcon />}
							onClick={() => handleView(params.row)}>
							Xem
						</Button>
						<Button
							variant='outlined'
							color='info'
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
		{ label: "Người dùng", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={users}
				loading={loading}
				title='Quản lý người dùng'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
				actions={
					<Box sx={{ display: "flex", gap: 2 }}>
						<Button
							variant='contained'
							startIcon={<AddIcon />}
							onClick={handleCreate}
							sx={{
								backgroundColor: "#234C6A",
								"&:hover": { backgroundColor: "#1B3C53" },
							}}>
							Thêm người dùng
						</Button>
						<Button
							variant='outlined'
							startIcon={<DeleteSweepIcon />}
							onClick={handleGoToTrash}
							sx={{
								color: "#234C6A",
								borderColor: "#234C6A",
								"&:hover": {
									backgroundColor: "#1B3C53",
									color: "#ffffff",
								},
							}}>
							Thùng rác
						</Button>
					</Box>
				}
			/>

			<AddUser
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				onCreated={fetchUsers}
				showSuccess={showSuccess}
				showError={showError}
			/>
			<EditUser
				open={openEditDialog}
				onClose={() => {
					setOpenEditDialog(false);
					setSelectedUser(null);
				}}
				user={selectedUser}
				onUpdated={fetchUsers}
				showSuccess={showSuccess}
				showError={showError}
			/>
			<UserDetails
				open={openViewDialog}
				onClose={() => {
					setOpenViewDialog(false);
					setSelectedUser(null);
				}}
				user={selectedUser}
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
