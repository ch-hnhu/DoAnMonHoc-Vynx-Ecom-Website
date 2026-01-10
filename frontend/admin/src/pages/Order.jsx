import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";

const formatCurrency = (value) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);

const renderStatusChip = (value, colorMap) => {
	const color = colorMap[value] || "default";
	return <Chip label={value} color={color} size='small' variant='outlined' />;
};

export default function OrderPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

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
		alert("Tạo đơn hàng mới");
	};

	const handleView = (id) => {
		console.log("View order:", id);
		alert(`Xem đơn hàng ID: ${id}`);
	};

	const handleEdit = (id) => {
		console.log("Edit order:", id);
		alert(`Cập nhật đơn hàng ID: ${id}`);
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
			headerName: "Số SP",
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
			renderCell: (params) => renderStatusChip(params.value, paymentStatusColors),
		},
		{
			field: "delivery_status",
			headerName: "TT giao hàng",
			width: 160,
			renderCell: (params) => renderStatusChip(params.value, deliveryStatusColors),
		},
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 150,
			valueFormatter: (params) => {
				return params ? new Date(params).toLocaleDateString("vi-VN") : "";
			},
		},
		{
			field: "actions",
			headerName: "Thao tác",
			width: 220,
			sortable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
						<Button
							variant='outlined'
							color='primary'
							size='small'
							startIcon={<VisibilityIcon />}
							onClick={() => handleView(params.row.id)}>
							Xem
						</Button>
						<Button
							variant='outlined'
							color='info'
							size='small'
							startIcon={<EditIcon />}
							onClick={() => handleEdit(params.row.id)}>
							Cập nhật
						</Button>
					</Box>
				);
			},
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Đơn hàng", active: true },
	];

	return (
		<DataTable
			columns={columns}
			rows={orders}
			loading={loading}
			title='Quản lý đơn hàng'
			breadcrumbs={breadcrumbs}
			pageSize={25}
			checkboxSelection={true}
			actions={
				<Button variant='contained' color='primary' onClick={handleCreate}>
					Tạo đơn hàng
				</Button>
			}
		/>
	);
}
