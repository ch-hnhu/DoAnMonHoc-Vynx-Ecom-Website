import { DataGrid } from "@mui/x-data-grid";
import PageHeader from "../Dashboard/PageHeader";

/**
 * Component DataGrid có thể tái sử dụng
 * @param {Object} props
 * @param {Array} props.columns - Định nghĩa các cột của bảng
 * @param {Array} props.rows - Dữ liệu hàng
 * @param {boolean} props.loading - Trạng thái loading
 * @param {string} props.title - Tiêu đề trang (optional)
 * @param {Array} props.breadcrumbs - Breadcrumbs (optional)
 * @param {number} props.pageSize - Kích thước trang mặc định (default: 25)
 * @param {Array} props.pageSizeOptions - Các tùy chọn kích thước trang (default: [10, 25, 50, 100])
 * @param {boolean} props.checkboxSelection - Hiển thị checkbox (default: true)
 * @param {boolean} props.disableRowSelectionOnClick - Vô hiệu hóa chọn hàng khi click (default: true)
 * @param {number} props.height - Chiều cao của bảng (default: 600)
 * @param {Object} props.sx - Custom styles cho DataGrid
 */
export default function DataTable({
	columns = [],
	rows = [],
	loading = false,
	title,
	breadcrumbs,
	actions,
	pageSize = 25,
	pageSizeOptions = [10, 25, 50, 100],
	checkboxSelection = true,
	disableRowSelectionOnClick = true,
	height = 570,
	sx = {},
	noWrapper = false,
	...otherProps
}) {
	const hasControlledPagination = Boolean(otherProps.paginationModel);
	const defaultSx = {
		"& .MuiDataGrid-cell": {
			borderBottom: "1px solid #f0f0f0",
		},
		"& .MuiDataGrid-columnHeaders": {
			backgroundColor: "#f8f9fa",
			borderBottom: "2px solid #dee2e6",
		},
		"& .MuiDataGrid-footerContainer": {
			borderTop: "2px solid #dee2e6",
			backgroundColor: "#f8f9fa",
			minHeight: "52px",
		},
		"& .MuiTablePagination-root": {
			color: "#212529",
		},
		"& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
			margin: 0,
			fontSize: "14px",
		},
		"& .MuiTablePagination-select": {
			paddingTop: "8px",
			paddingBottom: "8px",
		},
		"& .MuiDataGrid-selectedRowCount": {
			visibility: "visible",
		},
		...sx, // Merge custom styles
	};

	if (noWrapper) {
		return (
			<div style={{ height, width: "100%" }}>
				{actions && <div className='d-flex align-items-center mb-3'>{actions}</div>}
				<DataGrid
					columns={columns}
					rows={rows}
					loading={loading}
					showToolbar
					checkboxSelection={checkboxSelection}
					disableRowSelectionOnClick={disableRowSelectionOnClick}
					pageSizeOptions={pageSizeOptions}
					{...(!hasControlledPagination
						? { initialState: { pagination: { paginationModel: { pageSize } } } }
						: {})}
					sx={defaultSx}
					{...otherProps}
				/>
			</div>
		);
	}

	return (
		<>
			{title && <PageHeader title={title} breadcrumbs={breadcrumbs} />}
			<div className='app-content'>
				<div className='container-fluid'>
					{actions && <div className='d-flex align-items-center mb-3'>{actions}</div>}
					<div style={{ height, width: "100%" }}>
						<DataGrid
							columns={columns}
							rows={rows}
							loading={loading}
							showToolbar
							checkboxSelection={checkboxSelection}
							disableRowSelectionOnClick={disableRowSelectionOnClick}
							pageSizeOptions={pageSizeOptions}
							{...(!hasControlledPagination
								? {
										initialState: {
											pagination: { paginationModel: { pageSize } },
										},
									}
								: {})}
							sx={defaultSx}
							{...otherProps}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
