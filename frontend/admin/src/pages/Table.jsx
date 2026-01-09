import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import PageHeader from "../components/Dashboard/PageHeader";

const VISIBLE_FIELDS = ["name", "rating", "country", "dateCreated", "isAdmin"];

export default function BasicExampleDataGrid() {
	const { data, loading } = useDemoData({
		dataSet: "Employee",
		visibleFields: VISIBLE_FIELDS,
		rowLength: 100,
	});

	const breadcrumbs = [
		{ label: "Home", href: "#" },
		{ label: "Dashboard", active: true },
	];

	return (
		<>
			<PageHeader title='Dashboard' breadcrumbs={breadcrumbs} />
			<div className='app-content'>
				<div className='container-fluid'>
					<div style={{ height: 600, width: "100%" }}>
						<DataGrid
							{...data}
							loading={loading}
							checkboxSelection
							disableRowSelectionOnClick
							showToolbar
							pageSizeOptions={[10, 25, 50, 100]}
							initialState={{
								pagination: { paginationModel: { pageSize: 25 } },
							}}
							sx={{
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
								"& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
									{
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
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
