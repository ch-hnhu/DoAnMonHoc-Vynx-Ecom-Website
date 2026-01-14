import { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import AddCategory from "./AddCategory";

export default function CategoryPage() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);

	const fetchCategories = () => {
		setLoading(true);
		api.get("/categories")
			.then((response) => {
				setCategories(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching categories: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleCreated = () => {
		fetchCategories();
		setOpenAddDialog(false);
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleOpenDialog = () => {
		setOpenAddDialog(true);
	};

	const handleCreate = () => {
		console.log("Create category");
		alert("Tạo danh mục mới");
	};

	const handleEdit = (id) => {
		console.log("Edit category:", id);
		fetchCategories();
		alert(`Cập nhật danh mục ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete category:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
			api.delete(`/categories/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					fetchCategories();
				})
				.catch((error) => {
					console.error("Error deleting category:", error);
					const message = error?.response?.data?.message || "Xoa that bai!";
					alert(message);
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên danh mục", width: 200 },
		{ field: "slug", headerName: "Slug", width: 180 },
		{
			field: "parent",
			headerName: "Danh mục cha",
			width: 200,
			valueGetter: (params, row) => row.category?.name || "-",
		},
		{ field: "description", headerName: "Mô tả", width: 260 },
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
		{ label: "Danh mục", active: true },
	];

	return (
		<>
			<DataTable
				columns={columns}
				rows={categories}
				loading={loading}
				title='Quản lý danh mục'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
				actions={
					<Button
						variant='contained'
						startIcon={<AddIcon />}
						onClick={handleOpenDialog}
						sx={{
							backgroundColor: "#234C6A",
							"&:hover": { backgroundColor: "#1B3C53" },
						}}>
						Thêm danh mục
					</Button>
				}
			/>
			<AddCategory
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				categories={categories}
				onCreated={handleCreated}
			/>
		</>
	);
}
