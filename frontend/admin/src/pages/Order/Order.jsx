import { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DataTable from "../../components/Partial/DataTable.jsx";
import api from "../../services/api.js";
import { formatCurrency, formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import {
	paymentStatuses,
	deliveryStatuses,
	paymentStatusColors,
	deliveryStatusColors,
	getPaymentStatusName,
	getDeliveryStatusName,
	getPaymentStatusId,
	getDeliveryStatusId,
} from "@shared/utils/orderHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOrder from "./EditOrder.jsx";
import OrderDetails from "./OrderDetails.jsx";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import AddOrder from "./AddOrder.jsx";

export default function OrderPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ ĐƠN HÀNG");
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, showInfo, closeToast } = useToast();

	const fetchOrders = (model = paginationModel) => {
		setLoading(true);
		api.get("/orders", { params: { page: model.page + 1, per_page: model.pageSize } })
			.then((res) => {
				setOrders(res.data.data || []);
				setRowCount(res.data.pagination?.total ?? 0);
			})
			.catch((error) => {
				console.error("Error fetching orders: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchOrders();
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleCreate = () => {
		setOpenAddDialog(true);
	};

	const handleCreated = () => {
		fetchOrders();
	};

	const handleEdit = (order) => {
		setSelectedOrder(order);
		setOpenEditDialog(true);
	};

	const handleCloseEdit = () => {
		setOpenEditDialog(false);
		setSelectedOrder(null);
	};

	const handleCloseAdd = () => {
		setOpenAddDialog(false);
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

			// Convert tiếng Việt về tiếng Anh trước khi gửi API
			const response = await api.put(`/orders/${newRow.id}`, {
				payment_status: getPaymentStatusId(newRow.payment_status),
				delivery_status: getDeliveryStatusId(newRow.delivery_status),
			});

			if (response.data.success) {
				setOrders((prev) => prev.map((order) => (order.id === newRow.id ? newRow : order)));
				showSuccess("Cập nhật đơn hàng thành công!");
				return newRow;
			} else {
				showError("Cập nhật đơn hàng thất bại");
				return oldRow;
			}
		} catch (error) {
			console.error("Error updating order:", error);
			showError("Cập nhật đơn hàng thất bại");
			return oldRow;
		}
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
			editable: true,
			type: "singleSelect",
			valueOptions: paymentStatuses.map((s) => s.name),
			valueGetter: (value, row) => getPaymentStatusName(row.payment_status),
			renderCell: (params) => renderChip(params.value, paymentStatusColors),
		},
		{
			field: "delivery_status",
			headerName: "TT giao hàng",
			width: 160,
			editable: true,
			type: "singleSelect",
			valueOptions: deliveryStatuses.map((s) => s.name),
			valueGetter: (value, row) => getDeliveryStatusName(row.delivery_status),
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
				pageSize={paginationModel.pageSize}
				page={paginationModel.page}
				onPageChange={setPaginationModel}
				rowCount={rowCount}
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
			<EditOrder
				open={openEditDialog}
				onClose={handleCloseEdit}
				onSuccess={fetchOrders}
				order={selectedOrder}
			/>
			<AddOrder open={openAddDialog} onClose={handleCloseAdd} onSuccess={handleCreated} />
			<OrderDetails open={openViewDialog} onClose={handleCloseView} order={selectedOrder} />
			{/* Toast Notification */}
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				style={{ zIndex: 999999 }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
