import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";

const renderDiscountType = (value) => {
	const label = value === "percent" ? "Percent" : "Fixed";
	const color = value === "percent" ? "info" : "success";
	return <Chip label={label} color={color} size='small' variant='outlined' />;
};

const formatCurrency = (value) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);

export default function PromotionPage() {
	const [promotions, setPromotions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get("/promotions")
			.then((response) => {
				setPromotions(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching promotions: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		console.log("Create promotion");
		alert("Tạo mã khuyến mãi mới");
	};

	const handleEdit = (id) => {
		console.log("Edit promotion:", id);
		alert(`Cập nhật mã khuyến mãi ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete promotion:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này?")) {
			api.delete(`/promotions/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					setPromotions(promotions.filter((promotion) => promotion.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting promotion:", error);
					alert("Xóa thất bại!");
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "code", headerName: "Mã", width: 140 },
		{ field: "name", headerName: "Tên mã", width: 200 },
		{
			field: "discount_type",
			headerName: "Loại giảm",
			width: 140,
			renderCell: (params) => renderDiscountType(params.value),
		},
		{
			field: "discount_value",
			headerName: "Giá trị giảm",
			width: 150,
			valueFormatter: (params) => {
				if (params == null) {
					return "";
				}
				if (params > 1 && params <= 100) {
					return `${params}%`;
				}
				return formatCurrency(params);
			},
		},
		{
			field: "start_date",
			headerName: "Bắt đầu",
			width: 150,
			valueFormatter: (params) => {
				return params ? new Date(params).toLocaleDateString("vi-VN") : "";
			},
		},
		{
			field: "end_date",
			headerName: "Kết thúc",
			width: 150,
			valueFormatter: (params) => {
				return params ? new Date(params).toLocaleDateString("vi-VN") : "";
			},
		},
		{ field: "description", headerName: "Mô tả", width: 240 },
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
		{ label: "Mã khuyến mãi", active: true },
	];

	return (
		<DataTable
			columns={columns}
			rows={promotions}
			loading={loading}
			title='Quản lý mã khuyến mãi'
			breadcrumbs={breadcrumbs}
			pageSize={25}
			checkboxSelection={true}
			actions={
				<Button variant='contained' color='primary' onClick={handleCreate}>
					Tạo mã khuyến mãi mới
				</Button>
			}
		/>
	);
}
