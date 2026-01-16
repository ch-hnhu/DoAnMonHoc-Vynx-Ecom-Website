import { useEffect, useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { useToast } from "@shared/hooks/useToast";

export default function CategoryPage() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const { toast, showSuccess, showError, closeToast } = useToast();

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

	const handleEdit = (row) => {
		setSelectedCategory(row);
		setOpenEditDialog(true);
	};

	const handleDelete = (id) => {
		console.log("Delete category:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
			api.delete(`/categories/${id}`)
				.then(() => {
					showSuccess("Xóa danh mục thành công!");
					fetchCategories();
				})
				.catch((error) => {
					console.error("Error deleting category: ", error);
					showError("Xóa danh mục thất bại. Vui lòng thử lại.");
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
				showSuccess={showSuccess}
				showError={showError}
			/>
			<EditCategory
				open={openEditDialog}
				onClose={() => {
					setOpenEditDialog(false);
					setSelectedCategory(null);
				}}
				category={selectedCategory}
				categories={categories}
				onUpdated={handleCreated}
				showSuccess={showSuccess}
				showError={showError}
			/>
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
