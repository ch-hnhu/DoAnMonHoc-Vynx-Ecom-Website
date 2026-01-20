import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

export default function UserPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ NGƯỜI DÙNG");
	
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const statusColor = {
		Active: "success",
		Inactive: "default",
	};

	useEffect(() => {
		setLoading(true);
		api.get("/users")
			.then((response) => {
				setUsers(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching users: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		console.log("Create user");
		alert("Tao nguoi dung moi");
	};

	const handleView = (id) => {
		console.log("View user:", id);
		alert(`Xem nguoi dung ID: ${id}`);
	};

	const handleEdit = (id) => {
		console.log("Edit user:", id);
		alert(`Cap nhat nguoi dung ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete user:", id);
		if (window.confirm("Ban co chac chan muon xoa nguoi dung nay?")) {
			api.delete(`/users/${id}`)
				.then(() => {
					alert("Xoa thanh cong!");
					setUsers(users.filter((user) => user.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting user:", error);
					alert("Xoa that bai!");
				});
		}
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
			renderCell: (params) =>
				params.value
					? renderChip("Active", statusColor)
					: renderChip("Inactive", statusColor),
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
							onClick={() => handleView(params.row.id)}>
							Xem
						</Button>
						<Button
							variant='outlined'
							color='info'
							size='small'
							startIcon={<EditIcon />}
							onClick={() => handleEdit(params.row.id)}>
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
		<DataTable
			columns={columns}
			rows={users}
			loading={loading}
			title='Quản lý người dùng'
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
					Thêm người dùng
				</Button>
			}
		/>
	);
}
