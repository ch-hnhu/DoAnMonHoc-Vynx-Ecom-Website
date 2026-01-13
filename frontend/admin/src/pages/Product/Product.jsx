import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { formatDate, formatCurrency } from "@shared/utils/formatHelper.jsx";
import AddProduct from "./AddProduct";
import { getProductImage } from "../../../../shared/utils/productHelpers";

export default function ProductPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [promotions, setPromotions] = useState([]);

	useEffect(() => {
		setLoading(true);

		// Fetch products and related data
		Promise.all([
			api.get("/products"),
			api.get("/categories"),
			api.get("/brands"),
			api.get("/promotions"),
		])
			.then(([productsRes, categoriesRes, brandsRes, promotionsRes]) => {
				setProducts(productsRes.data.data || []);
				setCategories(categoriesRes.data.data || []);
				setBrands(brandsRes.data.data || []);
				setPromotions(promotionsRes.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		setOpenDialog(true);
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
			field: "image_url",
			headerName: "Hình ảnh",
			width: 150,
			renderCell: (params) =>
				getProductImage(params.value) ? (
					<img
						src={getProductImage(params.value)}
						alt={params.row.name}
						style={{
							width: "50px",
							height: "50px",
							objectFit: "cover",
							borderRadius: "4px",
						}}
					/>
				) : (
					<span>Không có ảnh</span>
				),
		},
		{ field: "slug", headerName: "Slug", width: 300 },
		{
			field: "price",
			headerName: "Giá",
			width: 150,
			type: "number",
			valueFormatter: (params) => formatCurrency(params),
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
				return params ? formatDate(params) : "";
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
			<DataTable
				columns={columns}
				rows={products}
				loading={loading}
				title='Quản lý sản phẩm'
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
						Thêm sản phẩm
					</Button>
				}
			/>
			<AddProduct
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				categories={categories}
				brands={brands}
				promotions={promotions}
			/>
		</>
	);
}
