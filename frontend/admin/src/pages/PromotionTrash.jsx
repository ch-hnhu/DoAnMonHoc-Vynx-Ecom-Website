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
import { formatDate, formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { useNavigate } from "react-router-dom";

export default function PromotionTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC KHUYẾN MÃI");
	const navigate = useNavigate();
	const [promotions, setPromotions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const discountTypeColor = {
		percent: "info",
		fixed: "success",
	};

	const fetchTrashedPromotions = (model = paginationModel) => {
		setLoading(true);
		api
			.get("/promotions/trashed", {
				params: { page: model.page + 1, per_page: model.pageSize },
			})
			.then((res) => {
				if (res.data.success) {
					setPromotions(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách mã khuyến mãi đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed promotions: ", error);
				showError("Lỗi khi tải danh sách mã khuyến mãi đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedPromotions(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (promotion) => {
		if (!promotion) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục mã: "${promotion.code}"?`)) {
			api
				.post(`/promotions/${promotion.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục mã khuyến mãi thành công!");
						fetchTrashedPromotions(paginationModel);
					} else {
						showError("Khôi phục mã khuyến mãi thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring promotion:", error);
					showError("Khôi phục mã khuyến mãi thất bại!");
				});
		}
	};

	const handleForceDelete = (promotion) => {
		if (!promotion) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn mã: "${promotion.code}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`
			)
		) {
			api
				.delete(`/promotions/${promotion.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn mã khuyến mãi thành công!");
						fetchTrashedPromotions(paginationModel);
					} else {
						showError("Xóa vĩnh viễn mã khuyến mãi thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting promotion:", error);
					showError("Xóa vĩnh viễn mã khuyến mãi thất bại!");
				});
		}
	};

	const handleBackToPromotions = () => {
		navigate("/promotions");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "code", headerName: "Mã", width: 140 },
		{ field: "name", headerName: "Tên mã", width: 220 },
		{
			field: "discount_type",
			headerName: "Loại giảm",
			width: 140,
			renderCell: (params) => renderChip(params.value, discountTypeColor),
		},
		{
			field: "discount_value",
			headerName: "Giá trị giảm",
			width: 160,
			valueFormatter: (params) => {
				if (params == null) return "";
				if (params > 1 && params <= 100) return `${params}%`;
				return formatCurrency(params);
			},
		},
		{
			field: "start_date",
			headerName: "Bắt đầu",
			width: 150,
			valueFormatter: (params) => (params ? formatDate(params) : ""),
		},
		{
			field: "end_date",
			headerName: "Kết thúc",
			width: 150,
			valueFormatter: (params) => (params ? formatDate(params) : ""),
		},
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
		{ label: "Mã khuyến mãi", href: "/admin/promotions" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={promotions}
				loading={loading}
				title='Thùng rác khuyến mãi'
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
						onClick={handleBackToPromotions}
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
