import { useDemoData } from "@mui/x-data-grid-generator";
import DataTable from "../components/Partial/DataTable";

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
		<DataTable
			columns={data.columns}
			rows={data.rows}
			loading={loading}
			title='Dashboard'
			breadcrumbs={breadcrumbs}
			pageSize={25}
			checkboxSelection={true}
		/>
	);
}
