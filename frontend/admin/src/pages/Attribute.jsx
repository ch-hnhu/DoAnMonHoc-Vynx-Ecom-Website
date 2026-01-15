import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";

const renderFilterChip = (isFilterable) => {
	if (isFilterable) {
		return <Chip label='Filterable' color='success' size='small' variant='outlined' />;
	}

	return <Chip label='Normal' color='default' size='small' variant='outlined' />;
};

export default function AttributePage() {
	const [attributes, setAttributes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get("/attributes")
			.then((response) => {
				setAttributes(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching attributes: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		console.log("Create attribute");
		alert("Tạo thuộc tính mới");
	};

	const handleEdit = (id) => {
		console.log("Edit attribute:", id);
		alert(`Cập nhật thuộc tính ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete attribute:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này?")) {
			api.delete(`/attributes/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					setAttributes(attributes.filter((attribute) => attribute.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting attribute:", error);
					alert("Xóa thất bại!");
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên thuộc tính", width: 200 },
		{ field: "attribute_type", headerName: "Loại thuộc tính", width: 170 },
		{ field: "data_type", headerName: "Kiểu dữ liệu", width: 150 },
		{ field: "unit", headerName: "Đơn vị", width: 120 },
		{
			field: "is_filterable",
			headerName: "Bộ lọc",
			width: 130,
			renderCell: (params) => renderFilterChip(params.value),
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
		{ label: "Thuộc tính", active: true },
	];

	return (
		<DataTable
			columns={columns}
			rows={attributes}
			loading={loading}
			title='Quản lý thuộc tính'
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
					Thêm thuộc tính
				</Button>
			}
		/>
	);
}
