import { useEffect, useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatPrice, formatDate } from "@shared/utils/formatHelper.jsx";
import { renderStatusChip } from "@shared/utils/renderHelper.jsx";

export default function OrderPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		setLoading(true);
		api.get("/orders")
			.then((response) => {
				setOrders(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching orders: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		console.log("Create order");
		setToast({ open: true, message: "Tạo đơn hàng mới", severity: "info" });
	};

	const handleCloseToast = (event, reason) => {
		if (reason === "clickaway") return;
		setToast({ ...toast, open: false });
	};

	const processRowUpdate = async (newRow, oldRow) => {
		try {
			// Chỉ cập nhật nếu có thay đổi
			if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
				return oldRow;
			}

			// Gọi API để cập nhật
			const response = await api.put(`/orders/${newRow.id}`, {
				payment_status: newRow.payment_status,
				delivery_status: newRow.delivery_status,
			});

			// Kiểm tra success từ API response
			if (response.data.success) {
				// Cập nhật state local
				setOrders((prev) => prev.map((order) => (order.id === newRow.id ? newRow : order)));

				setToast({
					open: true,
					message: response.data.message || "Cập nhật thành công!",
					severity: "success",
				});
				return newRow;
			} else {
				setToast({
					open: true,
					message: response.data.message || "Cập nhật thất bại",
					severity: "error",
				});
				return oldRow;
			}
		} catch (error) {
			console.error("Error updating order:", error);
			setToast({
				open: true,
				message: error.response?.data?.message || error.message || "Cập nhật thất bại",
				severity: "error",
			});
			return oldRow; // Rollback về giá trị cũ
		}
	};

	const paymentStatusColors = {
		paid: "success",
		pending: "warning",
		failed: "error",
		refunded: "info",
		cancelled: "default",
	};

	const deliveryStatusColors = {
		delivered: "success",
		shipping: "info",
		confirmed: "primary",
		pending: "warning",
		failed: "error",
		returned: "default",
		cancelled: "default",
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "customer",
			headerName: "Khách hàng",
			width: 220,
			valueGetter: (params, row) => row.user?.full_name || "N/A",
		},
		{
			field: "items_count",
			headerName: "Số lượng SP",
			width: 110,
			type: "number",
			valueGetter: (params, row) => row.order_items?.length || 0,
		},
		{
			field: "total_amount",
			headerName: "Tổng tiền",
			width: 160,
			type: "number",
			valueFormatter: (params) => formatPrice(params),
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
			editable: true,
			type: "singleSelect",
			valueOptions: ["paid", "pending", "failed", "refunded", "cancelled"],
			renderCell: (params) => renderStatusChip(params.value, paymentStatusColors),
		},
		{
			field: "delivery_status",
			headerName: "TT giao hàng",
			width: 160,
			editable: true,
			type: "singleSelect",
			valueOptions: [
				"delivered",
				"shipping",
				"confirmed",
				"pending",
				"failed",
				"returned",
				"cancelled",
			],
			renderCell: (params) => renderStatusChip(params.value, deliveryStatusColors),
		},
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
			headerName: "Hành động",
			width: 120,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Button
					variant='outlined'
					color='primary'
					size='small'
					startIcon={<VisibilityIcon />}
					href={`/orders/${params.row.id}`}>
					Xem
				</Button>
			),
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Đơn hàng", active: true },
	];

	return (
		<>
			<DataTable
				columns={columns}
				rows={orders}
				loading={loading}
				title='Quản lý đơn hàng'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
				processRowUpdate={processRowUpdate}
				actions={
					<Button variant='contained' color='primary' onClick={handleCreate}>
						Tạo đơn hàng
					</Button>
				}
			/>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={handleCloseToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={handleCloseToast} severity={toast.severity} variant='filled'>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
