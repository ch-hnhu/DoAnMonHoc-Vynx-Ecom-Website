import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { getProductImage } from "@shared/utils/productHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function BrandTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC THƯƠNG HIỆU");
	const navigate = useNavigate();
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedBrands = (model = paginationModel) => {
		setLoading(true);
		api.get("/brands/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setBrands(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách thương hiệu đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed thuong-hieu: ", error);
				showError("Lỗi khi tải danh sách thương hiệu đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedBrands(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (brand) => {
		if (!brand) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục thương hiệu: "${brand.name}"?`)) {
			api.post(`/brands/${brand.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục thương hiệu thành công!");
						fetchTrashedBrands(paginationModel);
					} else {
						showError("Khôi phục thương hiệu thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring brand:", error);
					showError("Khôi phục thương hiệu thất bại!");
				});
		}
	};

	const handleForceDelete = (brand) => {
		if (!brand) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn thương hiệu: "${brand.name}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/brands/${brand.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn thương hiệu thành công!");
						fetchTrashedBrands(paginationModel);
					} else {
						showError("Xóa vĩnh viễn thương hiệu thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting brand:", error);
					showError("Xóa vĩnh viễn thương hiệu thất bại!");
				});
		}
	};

	const handleBackToBrands = () => {
		navigate("/thuong-hieu");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "logo_url",
			headerName: "Logo",
			width: 110,
			sortable: false,
			renderCell: (params) => {
				const src = getProductImage(params.row.logo_url);
				return (
					<img
						src={src}
						alt={params.row.name || "brand-logo"}
						style={{
							width: 48,
							height: 48,
							objectFit: "contain",
							borderRadius: 6,
						}}
						onError={(e) => {
							e.currentTarget.onerror = null;
							e.currentTarget.src = "/img/product-default.png";
						}}
					/>
				);
			},
		},
		{ field: "name", headerName: "Tên thương hiệu", width: 240 },
		{ field: "description", headerName: "Mô tả", width: 400 },
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
			width: 320,
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
		{ label: "Thương hiệu", href: "/thuong-hieu" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={brands}
				loading={loading}
				title='Thùng rác thương hiệu'
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
						onClick={handleBackToBrands}
						sx={{
							backgroundColor: "#234C6A",
							"&:hover": { backgroundColor: "#1B3C53" },
						}}>
						Quay lại danh sách
					</Button>
				}
			/>
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