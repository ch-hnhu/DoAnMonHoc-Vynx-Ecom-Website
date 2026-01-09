import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import Table from "./pages/Table";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
	return (
		<Routes>
			<Route path='login' element={<Login />} />
			<Route path='signup' element={<Signup />} />
			<Route path='/' element={<MainLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path='table' element={<Table />} />
				<Route path='products' element={<Product />} />
			</Route>
		</Routes>
	);
}
