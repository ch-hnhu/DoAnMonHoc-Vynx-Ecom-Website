import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate, formatCurrency } from "@shared/utils/formatHelper.jsx";
import { getProductImage } from "../../../../shared/utils/productHelper";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function ProductTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC SẢN PHẨM");
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedProducts = (model = paginationModel) => {
		setLoading(true);
		api.get("/products/trashed", { 
			params: { 
				page: model.page + 1, 
				per_page: model.pageSize 
			} 
		})
			.then((res) => {
				if (res.data.success) {
					setProducts(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách sản phẩm đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed products: ", error);
				showError("Lỗi khi tải danh sách sản phẩm đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedProducts(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (product) => {
		if (!product) return;
		
		if (window.confirm(`Bạn có chắc chắn muốn khôi phục sản phẩm: "${product.name}"?`)) {
			api.post(`/products/${product.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục sản phẩm thành công!");
						fetchTrashedProducts(paginationModel);
					} else {
						showError("Khôi phục sản phẩm thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring product:", error);
					showError("Khôi phục sản phẩm thất bại!");
				});
		}
	};

	const handleForceDelete = (product) => {
		if (!product) return;
		
		if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm: "${product.name}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`)) {
			api.delete(`/products/${product.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn sản phẩm thành công!");
						fetchTrashedProducts(paginationModel);
					} else {
						showError("Xóa vĩnh viễn sản phẩm thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting product:", error);
					showError("Xóa vĩnh viễn sản phẩm thất bại!");
				});
		}
	};

	const handleBackToProducts = () => {
		navigate("/products");
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
							opacity: 0.6,
						}}
						onError={(e) => {
							e.target.src = "https://placehold.co/600x400";
						}}
					/>
				);
			},
		},
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
			field: "deleted_at",
			headerName: "Ngày xóa",
			width: 180,
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
			renderCell: (params) => {
				return (
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
				);
			},
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Sản phẩm", href: "/admin/products" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={products}
				loading={loading}
				title='Thùng rác sản phẩm'
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
						startIcon={<ArrowBackIcon />}
						onClick={handleBackToProducts}
						sx={{
							backgroundColor: "#234C6A",
							"&:hover": { backgroundColor: "#1B3C53" },
						}}>
						Quay lại danh sách
					</Button>
				}
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
		</PageTransition>
	);
}
