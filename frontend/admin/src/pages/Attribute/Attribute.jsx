import { useEffect, useState } from "react";
import { Button, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DataTable from "../../components/Partial/DataTable.jsx";
import api from "../../services/api.js";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import AddIcon from "@mui/icons-material/Add";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import AddAttribute from "./AddAttribute.jsx";
import EditAttribute from "./EditAttribute.jsx";
import { useToast } from "@shared/hooks/useToast";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

const renderFilterChip = (isFilterable) => {
	if (isFilterable) {
		return <Chip label='Có lọc' color='success' size='small' variant='outlined' />;
	}

	return <Chip label='Bình thường' color='default' size='small' variant='outlined' />;
};

export default function AttributePage() {
	useDocumentTitle("VYNX ADMIN | QUẢN LÝ THUỘC TÍNH");
	const navigate = useNavigate();

	const [attributes, setAttributes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedAttribute, setSelectedAttribute] = useState(null);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchAttributes = () => {
		setLoading(true);
		api.get("/attributes")
			.then((response) => {
				setAttributes(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching thuoc-tinh: ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchAttributes();
	}, []);

	const handleCreate = () => {
		setOpenAddDialog(true);
	};

	const handleCreated = () => {
		fetchAttributes();
	};

	const handleEdit = (row) => {
		setSelectedAttribute(row);
		setOpenEditDialog(true);
	};

	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này?")) {
			api.delete(`/attributes/${id}`)
				.then(() => {
					showSuccess("Xóa thành công!");
					fetchAttributes();
				})
				.catch((error) => {
					console.error("Error deleting attribute:", error);
					showError("Xóa thất bại!");
				});
		}
	};

	const handleGoToTrash = () => {
		navigate("/thuoc-tinh/thung-rac");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên thuộc tính", width: 200 },
		{ field: "attribute_type", headerName: "Loại thuộc tính", width: 170 },
		{ field: "data_type", headerName: "Kiểu dữ liệu", width: 150 },
		{ field: "unit", headerName: "Đơn vị", width: 120 },
		{
			field: "is_filterable",
			headerName: "Có lọc",
			width: 130,
			renderCell: (params) => renderFilterChip(params.value),
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
		{ label: "Thuộc tính", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={attributes}
				loading={loading}
				title='Quản lý thuộc tính'
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
							Thêm thuộc tính
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
			<AddAttribute
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				onCreated={handleCreated}
				showSuccess={showSuccess}
				showError={showError}
			/>
			<EditAttribute
				open={openEditDialog}
				onClose={() => {
					setOpenEditDialog(false);
					setSelectedAttribute(null);
				}}
				attribute={selectedAttribute}
				onUpdated={handleCreated}
			/>
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</PageTransition>
	);
}
