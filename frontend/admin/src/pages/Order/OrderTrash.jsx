import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate, formatCurrency } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import {
	paymentStatuses,
	deliveryStatuses,
	paymentStatusColors,
	deliveryStatusColors,
	getPaymentStatusName,
	getDeliveryStatusName,
} from "@shared/utils/orderHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function OrderTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC ĐƠN HÀNG");
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedOrders = (model = paginationModel) => {
		setLoading(true);
		api.get("/orders/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setOrders(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách đơn hàng đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed orders: ", error);
				showError("Lỗi khi tải danh sách đơn hàng đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedOrders(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (order) => {
		if (!order) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục đơn hàng: "#${order.id}"?`)) {
			api.post(`/orders/${order.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục đơn hàng thành công!");
						fetchTrashedOrders(paginationModel);
					} else {
						showError("Khôi phục đơn hàng thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring order:", error);
					showError("Khôi phục đơn hàng thất bại!");
				});
		}
	};

	const handleForceDelete = (order) => {
		if (!order) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng: "#${order.id}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/orders/${order.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn đơn hàng thành công!");
						fetchTrashedOrders(paginationModel);
					} else {
						showError("Xóa vĩnh viễn đơn hàng thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting order:", error);
					showError("Xóa vĩnh viễn đơn hàng thất bại!");
				});
		}
	};

	const handleBackToOrders = () => {
		navigate("/don-hang");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "customer",
			headerName: "Khách hàng",
			width: 220,
			valueGetter: (params, row) => {
				if (row.user?.role === "admin") {
					return row.shipping_name || row.user?.full_name || "Guest";
				}
				return row.user?.full_name || row.shipping_name || "N/A";
			},
		},
		{
			field: "items_count",
			headerName: "Số lượng SP",
			width: 110,
			type: "number",
			valueGetter: (params, row) =>
				row.order_items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0,
		},
		{
			field: "total_amount",
			headerName: "Tổng tiền",
			width: 160,
			type: "number",
			valueFormatter: (params) => formatCurrency(params),
		},
		{
			field: "payment_method",
			headerName: "Thanh toán",
			width: 140,
			valueGetter: (params, row) => (row.payment_method || "").toUpperCase(),
		},
		{
			field: "payment_status",
			headerName: "TT thanh toán",
			width: 160,
			valueGetter: (value, row) => getPaymentStatusName(row.payment_status),
			renderCell: (params) => renderChip(params.value, paymentStatusColors),
		},
		{
			field: "delivery_status",
			headerName: "TT giao hàng",
			width: 160,
			valueGetter: (value, row) => getDeliveryStatusName(row.delivery_status),
			renderCell: (params) => renderChip(params.value, deliveryStatusColors),
		},
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
		{ label: "Đơn hàng", href: "/don-hang" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={orders}
				loading={loading}
				title='Thùng rác đơn hàng'
				breadcrumbs={breadcrumbs}
				pageSize={paginationModel.pageSize}
				page={paginationModel.page}
				onPageChange={setPaginationModel}
				rowCount={rowCount}
				checkboxSelection={true}
				actions={
					<Button
						variant='contained'
						startIcon={<ArrowBackIcon />}
						onClick={handleBackToOrders}
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
