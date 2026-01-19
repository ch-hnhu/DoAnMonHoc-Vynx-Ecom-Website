import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../components/Partial/DataTable";
import api from "../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { renderChip } from "@shared/utils/renderHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

export default function PromotionPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ KHUYẾN MÃI");
	
	const [promotions, setPromotions] = useState([]);
	const [loading, setLoading] = useState(true);
	const discountTypeColor = {
		percent: "info",
		fixed: "success",
	};

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
			renderCell: (params) => renderChip(params.value, discountTypeColor),
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
				return params ? formatDate(params) : "";
			},
		},
		{
			field: "end_date",
			headerName: "Kết thúc",
			width: 150,
			valueFormatter: (params) => {
				return params ? formatDate(params) : "";
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
				<Button
					variant='contained'
					startIcon={<AddIcon />}
					onClick={handleCreate}
					sx={{
						backgroundColor: "#234C6A",
						"&:hover": { backgroundColor: "#1B3C53" },
					}}>
					Thêm mã khuyến mãi
				</Button>
			}
		/>
	);
}