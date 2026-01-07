import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout.jsx";
import Home from "../pages/user/Home.jsx";
import Shop from "../pages/user/Shop.jsx";
import ProductDetails from "../pages/user/ProductDetails.jsx";
import Cart from "../pages/user/Cart.jsx";
import Support from "../pages/user/Support.jsx";
import Checkout from "../pages/user/Checkout.jsx";
import NotFound from "../pages/user/NotFound.jsx";

export default function AppRoutes() {
	return (
		<Routes>
			{/* User Routes */}
			<Route path='/' element={<UserLayout />}>
				<Route index element={<Home />} />

				<Route path='shop' element={<Shop />} />
				<Route path='product' element={<ProductDetails />} />
				<Route path='cart' element={<Cart />} />
				<Route path='support' element={<Support />} />
				<Route path='checkout' element={<Checkout />} />

				<Route path='*' element={<NotFound />} />
			</Route>

			{/* Admin Routes */}
		</Routes>
	);
}
