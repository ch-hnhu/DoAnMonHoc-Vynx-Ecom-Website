import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import Table from "./pages/Table";

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path='table' element={<Table />} />
			</Route>
		</Routes>
	);
}
