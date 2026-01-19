import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import Table from "./pages/Table";
import Product from "./pages/Product/Product";
import AddProduct from "./pages/Product/AddProduct";
import Order from "./pages/Order/Order";
import User from "./pages/User";
import Brand from "./pages/Brand";
import Category from "./pages/Category/Category";
import Attribute from "./pages/Attribute";
import Promotion from "./pages/Promotion";
import Configuration from "./pages/Configuration";
import Review from "./pages/Review";
import SupportRequest from "./pages/SupportRequest";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRedirect from "./pages/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
	return (
		<Routes>
			<Route path='dang-nhap' element={<Login />} />
			<Route path='dang-ky' element={<Signup />} />
			<Route path='auth-redirect' element={<AuthRedirect />} />

			{/* Protected routes - Chỉ admin/employee */}
			<Route
				path='/'
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}>
				<Route index element={<DashboardPage />} />
				<Route path='table' element={<Table />} />
				<Route path='products' element={<Product />} />
				<Route path='product/add' element={<AddProduct />} />
				<Route path='orders' element={<Order />} />
				<Route path='users' element={<User />} />
				<Route path='brands' element={<Brand />} />
				<Route path='categories' element={<Category />} />
				<Route path='attributes' element={<Attribute />} />
				<Route path='promotions' element={<Promotion />} />
				<Route path='configurations' element={<Configuration />} />
				<Route path='reviews' element={<Review />} />
				<Route path='contacts' element={<SupportRequest />} />
			</Route>
		</Routes>
	);
}
