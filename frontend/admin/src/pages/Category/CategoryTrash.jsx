import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function CategoryTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC DANH MỤC");
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedCategories = (model = paginationModel) => {
		setLoading(true);
		api.get("/categories/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setCategories(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách danh mục đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed categories: ", error);
				showError("Lỗi khi tải danh sách danh mục đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedCategories(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (category) => {
		if (!category) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục danh mục: "${category.name}"?`)) {
			api.post(`/categories/${category.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục danh mục thành công!");
						fetchTrashedCategories(paginationModel);
					} else {
						showError("Khôi phục danh mục thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring category:", error);
					showError("Khôi phục danh mục thất bại!");
				});
		}
	};

	const handleForceDelete = (category) => {
		if (!category) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn danh mục: "${category.name}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/categories/${category.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn danh mục thành công!");
						fetchTrashedCategories(paginationModel);
					} else {
						showError("Xóa vĩnh viễn danh mục thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting category:", error);
					showError("Xóa vĩnh viễn danh mục thất bại!");
				});
		}
	};

	const handleBackToCategories = () => {
		navigate("/danh-muc");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên danh mục", width: 220 },
		{ field: "slug", headerName: "Slug", width: 180 },
		{
			field: "parent_id",
			headerName: "Danh mục cha",
			width: 200,
			valueGetter: (params, row) => row.category?.name || "-",
		},
		{ field: "description", headerName: "Mô tả", width: 260 },
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
		{ label: "Danh mục", href: "/danh-muc" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={categories}
				loading={loading}
				title='Thùng rác danh mục'
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
						onClick={handleBackToCategories}
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
