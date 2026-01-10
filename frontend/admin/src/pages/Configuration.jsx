import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";

const renderStatusChip = (isActive) => {
	if (isActive) {
		return <Chip label='Active' color='success' size='small' variant='outlined' />;
	}

	return <Chip label='Inactive' color='default' size='small' variant='outlined' />;
};

export default function ConfigurationPage() {
	const [configurations, setConfigurations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get("/configurations")
			.then((response) => {
				setConfigurations(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching configurations: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		console.log("Create configuration");
		alert("Tạo cấu hình mới");
	};

	const handleEdit = (id) => {
		console.log("Edit configuration:", id);
		alert(`Cập nhật cấu hình ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete configuration:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
			api.delete(`/configurations/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					setConfigurations(
						configurations.filter((configuration) => configuration.id !== id),
					);
				})
				.catch((error) => {
					console.error("Error deleting configuration:", error);
					alert("Xóa thất bại!");
				});
		}
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
			renderCell: (params) => renderStatusChip(params.value),
		},
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 150,
			valueFormatter: (params) => {
				return params ? new Date(params).toLocaleDateString("vi-VN") : "";
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
		{ label: "Cấu hình", active: true },
	];

	return (
		<DataTable
			columns={columns}
			rows={configurations}
			loading={loading}
			title='Quản lý cấu hình'
			breadcrumbs={breadcrumbs}
			pageSize={25}
			checkboxSelection={true}
			actions={
				<Button variant='contained' color='primary' onClick={handleCreate}>
					Tạo cấu hình mới
				</Button>
			}
		/>
	);
}
