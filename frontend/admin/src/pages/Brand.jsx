import { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";

export default function BrandPage() {
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get("/brands")
			.then((response) => {
				setBrands(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching brands: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		console.log("Create brand");
		alert("Tạo thương hiệu mới");
	};

	const handleEdit = (id) => {
		console.log("Edit brand:", id);
		alert(`Cập nhật thương hiệu ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete brand:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
			api.delete(`/brands/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					setBrands(brands.filter((brand) => brand.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting brand:", error);
					alert("Xóa thất bại!");
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên thương hiệu", width: 240 },
		{ field: "logo_url", headerName: "Logo URL", width: 260 },
		{ field: "description", headerName: "Mô tả", width: 280 },
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
		{ label: "Thương hiệu", active: true },
	];

	return (
		<DataTable
			columns={columns}
			rows={brands}
			loading={loading}
			title='Quản lý thương hiệu'
			breadcrumbs={breadcrumbs}
			pageSize={25}
			checkboxSelection={true}
			actions={
				<Button variant='contained' color='primary' onClick={handleCreate}>
					Tạo thương hiệu mới
				</Button>
			}
		/>
	);
}
