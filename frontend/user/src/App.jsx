import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Support from "./pages/Support.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { HelmetProvider } from "react-helmet-async";

export default function App() {
	return (
		<HelmetProvider>
			<Routes>
				<Route path='login' element={<Login />} />
				<Route path='signup' element={<Signup />} />
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />

					<Route path='shop' element={<Shop />} />
					<Route path='product' element={<ProductDetails />} />
					<Route path='cart' element={<Cart />} />
					<Route path='support' element={<Support />} />
					<Route path='checkout' element={<Checkout />} />

					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</HelmetProvider>
	);
}
