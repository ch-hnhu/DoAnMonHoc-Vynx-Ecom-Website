import { useEffect, useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatCurrency, formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
//import EditOrder from "./EditOrder.jsx";
//import OrderDetails from "./OrderDetails.jsx";

export default function OrderPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { toast, showSuccess, showError, showInfo, closeToast } = useToast();

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
		showInfo("Tạo đơn hàng mới");
	};

	const handleEdit = (order) => {
		setSelectedOrder(order);
		setOpenEditDialog(true);
	};

	const handleCloseEdit = () => {
		setOpenEditDialog(false);
		setSelectedOrder(null);
	};

	const handleView = (order) => {
		setSelectedOrder(order);
		setOpenViewDialog(true);
	};

	const handleCloseView = () => {
		setOpenViewDialog(false);
		setSelectedOrder(null);
	};

	const handleDelete = (order) => {
		if (!order) {
			return;
		}
		if (window.confirm(`Bạn có chắc chắn muốn xoá đơn hàng: "${order.id}"?`)) {
			api.delete(`/orders/${order.id}`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xoá đơn hàng thành công!");
						fetchOrders();
					} else {
						showError("Xoá đơn hàng thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error deleting order: ", error);
					showError("Xoá đơn hàng thất bại!");
				});
		}
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
				showSuccess(response.data.message || "Cập nhật thành công!");
				return newRow;
			} else {
				showError(response.data.message || "Cập nhật thất bại");
				return oldRow;
			}
		} catch (error) {
			console.error("Error updating order:", error);
			showError(error.response?.data?.message || error.message || "Cập nhật thất bại");
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
			editable: true,
			type: "singleSelect",
			valueOptions: ["paid", "pending", "failed", "refunded", "cancelled"],
			renderCell: (params) => renderChip(params.value, paymentStatusColors),
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
			renderCell: (params) => renderChip(params.value, deliveryStatusColors),
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
			headerName: "Thao tác",
			width: 300,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
					<Button
						variant='outlined'
						color='primary'
						size='small'
						startIcon={<EditIcon />}
						onClick={() => handleEdit(params.row)}>
						Cập nhật
					</Button>
					<Button
						variant='outlined'
						color='info'
						size='small'
						startIcon={<VisibilityIcon />}
						onClick={() => handleView(params.row)}>
						Xem
					</Button>
					<Button
						variant='outlined'
						color='error'
						size='small'
						startIcon={<DeleteIcon />}
						onClick={() => handleDelete(params.row)}>
						Xóa
					</Button>
				</Box>
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
					<Button
						variant='contained'
						startIcon={<AddIcon />}
						onClick={handleCreate}
						sx={{
							backgroundColor: "#234C6A",
							"&:hover": { backgroundColor: "#1B3C53" },
						}}>
						Tạo đơn hàng
					</Button>
				}
			/>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} variant='filled'>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
