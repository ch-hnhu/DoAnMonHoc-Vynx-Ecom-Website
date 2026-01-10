import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";

const renderRating = (rating) => {
	const colorMap = {
		5: "success",
		4: "info",
		3: "warning",
		2: "error",
		1: "error",
	};

	return (
		<Chip
			label={`${rating} sao`}
			color={colorMap[rating] || "default"}
			size='small'
			variant='outlined'
		/>
	);
};

export default function ReviewPage() {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get("/reviews")
			.then((response) => {
				setReviews(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching reviews: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleEdit = (id) => {
		console.log("Edit review:", id);
		alert(`Cập nhật đánh giá ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete review:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
			api.delete(`/reviews/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					setReviews(reviews.filter((review) => review.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting review:", error);
					alert("Xóa thất bại!");
				});
		}
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
			width: 120,
			renderCell: (params) => renderRating(params.value),
		},
		{ field: "content", headerName: "Nội dung", width: 260 },
		{ field: "review_reply", headerName: "Phản hồi", width: 220 },
		{
			field: "created_at",
			headerName: "Ngay tạo",
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
		{ label: "Đánh giá", active: true },
	];

	return (
		<DataTable
			columns={columns}
			rows={reviews}
			loading={loading}
			title='Quản lý đánh giá'
			breadcrumbs={breadcrumbs}
			pageSize={25}
			checkboxSelection={true}
		/>
	);
}
