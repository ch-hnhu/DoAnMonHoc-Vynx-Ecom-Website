import { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import AddBrand from "./AddBrand.jsx";
import EditBrand from "./EditBrand.jsx";
import { useToast } from "@shared/hooks/useToast";
import { getProductImage } from "@shared/utils/productHelper.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

export default function BrandPage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ THƯƠNG HIỆU");
	const navigate = useNavigate();

	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchBrands = () => {
		setLoading(true);
		api.get("/brands")
			.then((response) => {
				setBrands(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching thuong-hieu: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchBrands();
	}, []);

	const handleCreate = () => {
		setOpenAddDialog(true);
	};

	const handleCreated = () => {
		fetchBrands();
	};

	const handleEdit = (row) => {
		setSelectedBrand(row);
		setOpenEditDialog(true);
	};

	const handleDelete = (id) => {
		console.log("Delete brand:", id);
		if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
			api.delete(`/brands/${id}`)
				.then(() => {
					showSuccess("Xóa thành công!");
					fetchBrands();
				})
				.catch((error) => {
					console.error("Error deleting brand:", error);
					showError("Xóa thất bại!");
				});
		}
	};

	const handleGoToTrash = () => {
		navigate("/thuong-hieu/thung-rac");
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
							e.target.src = "https://placehold.co/600x400";
						}}
					/>
				);
			},
		},
		{ field: "name", headerName: "Tên thương hiệu", width: 240 },
		{ field: "description", headerName: "Mô tả", width: 400 },
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
							onClick={() => handleEdit(params.row)}>
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
		{ label: "Thương hiệu", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={brands}
				loading={loading}
				title='Quản lý thương hiệu'
				breadcrumbs={breadcrumbs}
				pageSize={25}
				checkboxSelection={true}
				actions={
					<Box sx={{ display: "flex", gap: 2 }}>
						<Button
							variant='contained'
							startIcon={<AddIcon />}
							onClick={handleCreate}
							sx={{
								backgroundColor: "#234C6A",
								"&:hover": { backgroundColor: "#1B3C53" },
							}}>
							Thêm thương hiệu
						</Button>
						<Button
							variant='outlined'
							startIcon={<DeleteSweepIcon />}
							onClick={handleGoToTrash}
							sx={{
								color: "#234C6A",
								borderColor: "#234C6A",
								"&:hover": {
									backgroundColor: "#1B3C53",
									color: "#ffffff",
								},
							}}>
							Thùng rác
						</Button>
					</Box>
				}
			/>
			<AddBrand
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				onCreated={handleCreated}
				showSuccess={showSuccess}
				showError={showError}
			/>
			<EditBrand
				open={openEditDialog}
				onClose={() => {
					setOpenEditDialog(false);
					setSelectedBrand(null);
				}}
				brand={selectedBrand}
				onUpdated={handleCreated}
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
