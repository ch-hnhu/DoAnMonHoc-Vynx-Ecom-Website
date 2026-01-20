import { useEffect, useState } from "react";
import {
	Button,
	Box,
	Chip,
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Typography,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

const renderStars = (rating) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(
			i <= rating ? (
				<StarIcon key={i} sx={{ fontSize: 24, color: "#FAAF00" }} />
			) : (
				<StarBorderIcon key={i} sx={{ fontSize: 24, color: "#B6B6B6" }} />
			)
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

export default function ReviewPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ ĐÁNH GIÁ");
	
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openReplyDialog, setOpenReplyDialog] = useState(false);
	const [selectedReview, setSelectedReview] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { toast, showSuccess, showError, showInfo, closeToast } = useToast();

	useEffect(() => {
		setLoading(true);
		api.get("/reviews")
			.then((response) => {
				setReviews(response.data.data || []);
			})
			.catch((error) => {
				showError("Tải đánh giá thất bại!");
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleEdit = (row) => {
		setSelectedReview(row);
		setReplyText(row.review_reply || "");
		setOpenReplyDialog(true);
	};

	const handleCloseReply = () => {
		setOpenReplyDialog(false);
		setSelectedReview(null);
		setReplyText("");
		setSubmitting(false);
		closeToast();
	};
	//Phản hồi đánh giá
	const handleSubmitReply = (e) => {
		e?.preventDefault();
		if (!selectedReview) return;

		setSubmitting(true);
		const payload = {
			review_reply: replyText.trim() || null,
		};

		api.put(`/reviews/${selectedReview.id}`, payload)
			.then((response) => {
				const updated = response?.data?.data ?? payload;
				showSuccess("Phản hồi đánh giá thành công!");
				setReviews((prev) =>
					prev.map((item) =>
						item.id === selectedReview.id ? { ...item, ...updated } : item
					)
				);
				setTimeout(() => {
					handleCloseReply();
				}, 800);
			})
			.catch((error) => {
				console.error("Error updating review reply:", error);
				showError("Phản hồi đánh giá thất bại!");
				setSubmitting(false);
			});
	};

	const handleDelete = (id) => {
		console.log("Delete review:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
			api.delete(`/reviews/${id}`)
				.then(() => {
					showSuccess("Xóa thành công!");
					//Lọc lại đánh giá vừa xoá
					setReviews(reviews.filter((review) => review.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting review:", error);
					showError("Xóa thất bại!");
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
			width: 180,
			renderCell: (params) => renderStars(params.value),
		},
		{ field: "content", headerName: "Nội dung", width: 260 },
		{ field: "review_reply", headerName: "Phản hồi", width: 220 },
		{
			field: "created_at",
			headerName: "Ngay tạo",
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
							Phản hồi
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
		<>
			<DataTable
				columns={columns}
				rows={reviews}
				loading={loading}
				title='Quản lý đánh giá'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
			/>

			<Dialog open={openReplyDialog} onClose={handleCloseReply} maxWidth='sm' fullWidth>
				<DialogTitle>
					<Box display='flex' alignItems='center' justifyContent='space-between'>
						<Typography variant='h6' component='div'>
							CẬP NHẬT PHẢN HỒI ĐÁNH GIÁ
						</Typography>
						<IconButton edge='end' color='inherit' onClick={handleCloseReply}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent dividers>
					<Box component='form' onSubmit={handleSubmitReply} noValidate>
						<TextField
							fullWidth
							label='Phản hồi'
							name='review_reply'
							value={replyText}
							onChange={(e) => setReplyText(e.target.value)}
							margin='normal'
							multiline
							minRows={3}
						/>
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, py: 2 }}>
					<Button onClick={handleCloseReply} variant='outlined' disabled={submitting}>
						Hủy
					</Button>
					<Button
						onClick={handleSubmitReply}
						variant='contained'
						disabled={submitting}
						sx={{ backgroundColor: "#234C6A", "&:hover": { backgroundColor: "#1B3C53" } }}>
						{submitting ? "Đang lưu..." : "Phản hồi"}
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={toast.open}
				autoHideDuration={toast.duration}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
