import { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/Partial/DataTable";
import { Button, Box, Chip } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "@shared/utils/formatHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

const renderFilterChip = (isFilterable) => {
	if (isFilterable) {
		return <Chip label='Có lọc' color='success' size='small' variant='outlined' />;
	}

	return <Chip label='Bình thường' color='default' size='small' variant='outlined' />;
};

export default function AttributeTrashPage() {
	useDocumentTitle("VYNX ADMIN | THÙNG RÁC THUỘC TÍNH");
	const navigate = useNavigate();
	const [attributes, setAttributes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchTrashedAttributes = (model = paginationModel) => {
		setLoading(true);
		api.get("/attributes/trashed", {
			params: {
				page: model.page + 1,
				per_page: model.pageSize,
			},
		})
			.then((res) => {
				if (res.data.success) {
					setAttributes(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				} else {
					showError("Không thể tải danh sách thuộc tính đã xóa");
				}
			})
			.catch((error) => {
				console.error("Error fetching trashed thuoc-tinh: ", error);
				showError("Lỗi khi tải danh sách thuộc tính đã xóa");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTrashedAttributes(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleRestore = (attribute) => {
		if (!attribute) return;

		if (window.confirm(`Bạn có chắc chắn muốn khôi phục thuộc tính: "${attribute.name}"?`)) {
			api.post(`/attributes/${attribute.id}/restore`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Khôi phục thuộc tính thành công!");
						fetchTrashedAttributes(paginationModel);
					} else {
						showError("Khôi phục thuộc tính thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error restoring attribute:", error);
					showError("Khôi phục thuộc tính thất bại!");
				});
		}
	};

	const handleForceDelete = (attribute) => {
		if (!attribute) return;

		if (
			window.confirm(
				`Bạn có chắc chắn muốn xóa vĩnh viễn thuộc tính: "${attribute.name}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
			)
		) {
			api.delete(`/attributes/${attribute.id}/force`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xóa vĩnh viễn thuộc tính thành công!");
						fetchTrashedAttributes(paginationModel);
					} else {
						showError("Xóa vĩnh viễn thuộc tính thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error force deleting attribute:", error);
					showError("Xóa vĩnh viễn thuộc tính thất bại!");
				});
		}
	};

	const handleBackToAttributes = () => {
		navigate("/thuoc-tinh");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên thuộc tính", width: 200 },
		{ field: "attribute_type", headerName: "Loại thuộc tính", width: 170 },
		{ field: "data_type", headerName: "Kiểu dữ liệu", width: 150 },
		{ field: "unit", headerName: "Đơn vị", width: 120 },
		{
			field: "is_filterable",
			headerName: "Bộ lọc",
			width: 130,
			renderCell: (params) => renderFilterChip(params.value),
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
		{ label: "Thuộc tính", href: "/thuoc-tinh" },
		{ label: "Thùng rác", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				columns={columns}
				rows={attributes}
				loading={loading}
				title='Thùng rác thuộc tính'
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
						onClick={handleBackToAttributes}
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