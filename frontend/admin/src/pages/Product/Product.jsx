import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { formatDate, formatCurrency } from "@shared/utils/formatHelper.jsx";
import AddProduct from "./AddProduct";
import { getProductImage } from "../../../../shared/utils/productHelper";
import EditProduct from "./EditProduct";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";

export default function ProductPage() {
	const title = "VYNX ADMIN | QUẢN LÝ SẢN PHẨM";
	useDocumentTitle(title);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [brands, setBrands] = useState([]);
	const [promotions, setPromotions] = useState([]);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	// Fetch products function
	const fetchProducts = (model = paginationModel) => {
		setLoading(true);
		Promise.all([
			api.get("/products", { params: { page: model.page + 1, per_page: model.pageSize } }),
			api.get("/brands"),
			api.get("/promotions"),
		])
			.then(([productsRes, brandsRes, promotionsRes]) => {
				setProducts(productsRes.data.data || []);
				setRowCount(productsRes.data.pagination?.total ?? 0);
				setBrands(brandsRes.data.data || []);
				setPromotions(promotionsRes.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchProducts(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleCreate = () => {
		setOpenAddDialog(true);
	};

	const handleCloseCreate = () => {
		setOpenAddDialog(false);
	};

	const handleEdit = (product) => {
		setSelectedProduct(product);
		setOpenEditDialog(true);
	};

	const handleCloseEdit = () => {
		setOpenEditDialog(false);
		setSelectedProduct(null);
	};

	const handleDelete = (product) => {
		if (!product) {
			return;
		}
		if (window.confirm(`Bạn có chắc chắn muốn xoá sản phẩm: "${product.name}"?`)) {
			api.delete(`/products/${product.id}`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xoá sản phẩm thành công!");
						fetchProducts(paginationModel);
					} else {
						showError("Xoá sản phẩm thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error deleting product:", error);
					showError("Xoá sản phẩm thất bại!");
				});
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên sản phẩm", width: 300 },
		{
			field: "image_url",
			headerName: "Hình ảnh",
			width: 150,
			renderCell: (params) => {
				const imageUrl = getProductImage(params.value);
				return (
					<img
						src={imageUrl}
						alt={params.row.name}
						style={{
							width: "50px",
							height: "50px",
							objectFit: "cover",
							borderRadius: "4px",
						}}
						onError={(e) => {
							e.target.src = "https://placehold.co/600x400";
						}}
					/>
				);
			},
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
			filterable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
						<Button
							variant='outlined'
							color='primary'
							size='small'
							startIcon={<EditIcon />}
							onClick={() => handleEdit(params.row)}>
							Sửa
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
				paginationMode='server'
				rowCount={rowCount}
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
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
				open={openAddDialog}
				onClose={handleCloseCreate}
				onSuccess={() => fetchProducts(paginationModel)}
				brands={brands}
				promotions={promotions}
			/>
			<EditProduct
				open={openEditDialog}
				onClose={handleCloseEdit}
				onSuccess={() => fetchProducts(paginationModel)}
				product={selectedProduct}
				brands={brands}
				promotions={promotions}
			/>
			{/* Toast Notification */}
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}