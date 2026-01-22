import { useState, useEffect } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../services/api";
import DataTable from "../components/Partial/DataTable";
import PageTransition from "../components/PageTransition";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const resolveImageUrl = (url) => {
	if (!url) return "https://placehold.co/600x400";
	if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
	const base = API_BASE_URL.replace(/\/api\/?$/, "");
	if (url.startsWith("/")) return `${base}${url}`;
	return `${base}/${url}`;
};

export default function BlogTrashPage() {
	useDocumentTitle("Thùng rác bài viết");
	const navigate = useNavigate();
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedBlogs = (model = paginationModel) => {
		setLoading(true);
		api
			.get("/blogs/trashed", {
				params: { page: model.page + 1, per_page: model.pageSize },
			})
			.then((res) => {
				if (res.data.success) {
					setBlogs(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách bài viết đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed blogs: ", error);
				showError("Lỗi khi tải danh sách bài viết đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedBlogs(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (blog) => {
		if (!blog) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục bài viết: "${blog.title}"?`)) {
			api
				.post(`/blogs/${blog.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục bài viết thành công!");
						fetchTrashedBlogs(paginationModel);
					} else {
						showError("Khôi phục bài viết thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring blog:", error);
					showError("Khôi phục bài viết thất bại!");
				});
		}
	};

	const handleForceDelete = (blog) => {
		if (!blog) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn bài viết: "${blog.title}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`
			)
		) {
			api
				.delete(`/blogs/${blog.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn bài viết thành công!");
						fetchTrashedBlogs(paginationModel);
					} else {
						showError("Xóa vĩnh viễn bài viết thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting blog:", error);
					showError("Xóa vĩnh viễn bài viết thất bại!");
				});
		}
	};

	const handleBackToBlogs = () => {
		navigate("/blogs");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "image_url",
			headerName: "Hình ảnh",
			width: 140,
			renderCell: (params) => {
				const imageUrl = resolveImageUrl(params.value);
				return (
					<img
						src={imageUrl}
						alt={params.row.title}
						style={{
							width: "60px",
							height: "40px",
							objectFit: "cover",
							borderRadius: "4px",
						}}
						onError={(e) => {
							e.target.src = "https://placehold.co/600x400";
						}}
					/>
				);
			},
		},
		{ field: "title", headerName: "Tiêu đề", width: 300 },
		{ field: "author_name", headerName: "Tác giả", width: 180 },
		{
			field: "deleted_at",
			headerName: "Ngày xóa",
			width: 180,
			valueFormatter: (params) => (params ? formatDate(params) : ""),
		},
		{
			field: "actions",
			headerName: "Thao tác",
			width: 300,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
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
			),
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Bài viết", href: "/admin/blogs" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={blogs}
				loading={loading}
				title='Thùng rác bài viết'
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
						onClick={handleBackToBlogs}
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
