import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import Table from "./pages/Table";
import Product from "./pages/Product/Product";
import Order from "../src/pages/Order/Order";
import User from "./pages/User";
import Brand from "./pages/Brand";
import Category from "./pages/Category/Category";
import Attribute from "./pages/Attribute";
import Promotion from "./pages/Promotion";
import Configuration from "./pages/Configuration";
import Review from "./pages/Review";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddProduct from "./pages/Product/AddProduct";
import SupportRequest from "./pages/SupportRequest";

export default function App() {
	return (
		<Routes>
			<Route path='login' element={<Login />} />
			<Route path='signup' element={<Signup />} />
			<Route path='/' element={<MainLayout />}>
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
				<Route path='support-requests' element={<SupportRequest />} />
			</Route>
		</Routes>
	);
}
