import { useEffect, useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

const renderStars = (rating) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(
			i <= rating ? (
				<StarIcon key={i} sx={{ fontSize: 24, color: "#FAAF00" }} />
			) : (
				<StarBorderIcon key={i} sx={{ fontSize: 24, color: "#B6B6B6" }} />
			),
		);
	}
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
			{stars}
			<Box component='span' sx={{ ml: 1, fontSize: 14, color: "text.secondary" }}>
				({rating})
			</Box>
		</Box>
	);
};

export default function ReviewTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC ĐÁNH GIÁ");
	const navigate = useNavigate();

	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedReviews = (model = paginationModel) => {
		setLoading(true);
		api.get("/reviews/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setReviews(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách đánh giá đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed reviews: ", error);
				showError("Lỗi khi tải danh sách đánh giá đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedReviews(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (review) => {
		if (!review) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục đánh giá ID: "${review.id}"?`)) {
			api.post(`/reviews/${review.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục đánh giá thành công!");
						fetchTrashedReviews(paginationModel);
					} else {
						showError("Khôi phục đánh giá thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring review:", error);
					showError("Khôi phục đánh giá thất bại!");
				});
		}
	};

	const handleForceDelete = (review) => {
		if (!review) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá ID: "${review.id}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/reviews/${review.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn đánh giá thành công!");
						fetchTrashedReviews(paginationModel);
					} else {
						showError("Xóa vĩnh viễn đánh giá thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting review:", error);
					showError("Xóa vĩnh viễn đánh giá thất bại!");
				});
		}
	};

	const handleBackToReviews = () => {
		navigate("/danh-gia");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "product",
			headerName: "Sản phẩm",
			width: 220,
			valueGetter: (params, row) => row.product?.name || "N/A",
		},
		{
			field: "user",
			headerName: "Người dùng",
			width: 200,
			valueGetter: (params, row) => row.user?.full_name || "N/A",
		},
		{
			field: "order_id",
			headerName: "Đơn hàng",
			width: 110,
			type: "number",
		},
		{
			field: "rating",
			headerName: "Số sao",
			width: 180,
			renderCell: (params) => renderStars(params.value),
		},
		{ field: "content", headerName: "Nội dung", width: 260 },
		{ field: "review_reply", headerName: "Phản hồi", width: 220 },
		{
			field: "deleted_at",
			headerName: "Ngày xóa",
			width: 150,
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
		{ label: "Đánh giá", href: "/danh-gia" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={reviews}
				loading={loading}
				title='Thùng rác đánh giá'
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
						onClick={handleBackToReviews}
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
