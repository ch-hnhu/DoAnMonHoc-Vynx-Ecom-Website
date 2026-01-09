import { useState, useEffect } from "react";
import api from "../services/api";
import DataTable from "../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Headers from "../components/Partial/Header";
import PageHeader from "../components/Dashboard/PageHeader";

export default function ProductPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		api.get("/products")
			.then((response) => {
				// Backend trả về {message, data}, nên lấy response.data.data
				setProducts(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching products: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleAdd = () => {
		console.log("Add new product");
		alert("Thêm sản phẩm mới");
	};

	const handleEdit = (id) => {
		console.log("Edit product:", id);
		alert(`Chỉnh sửa sản phẩm ID: ${id}`);
	};

	const handleDelete = (id) => {
		console.log("Delete product:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
			api.delete(`/products/${id}`)
				.then(() => {
					alert("Xóa thành công!");
					// Refresh data
					setProducts(products.filter((product) => product.id !== id));
				})
				.catch((error) => {
					console.error("Error deleting product:", error);
					alert("Xóa thất bại!");
				});
		}
	};

	// Định nghĩa các cột cho bảng products (mapping với data từ backend)
	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên sản phẩm", width: 300 },
		{
			field: "price",
			headerName: "Giá",
			width: 150,
			type: "number",
			valueFormatter: (params) => {
				return new Intl.NumberFormat("vi-VN", {
					style: "currency",
					currency: "VND",
				}).format(params);
			},
		},
		{ field: "stock_quantity", headerName: "Tồn kho", width: 120, type: "number" },
		{
			field: "category",
			headerName: "Danh mục",
			width: 180,
			valueGetter: (params, row) => row.category?.name || "N/A",
		},
		{
			field: "brand",
			headerName: "Thương hiệu",
			width: 180,
			valueGetter: (params, row) => row.brand?.name || "N/A",
		},
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 180,
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
		{ label: "Sản phẩm", active: true },
	];

	return (
		<>
			{/* <Button
				sx={{ m: 2, mt: 0 }}
				variant='contained'
				color='primary'
				startIcon={<AddIcon />}
				onClick={handleAdd}>
				Thêm sản phẩm
			</Button> */}
			<DataTable
				columns={columns}
				rows={products}
				loading={loading}
				title='Quản lý sản phẩm'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
			/>
		</>
	);
}
