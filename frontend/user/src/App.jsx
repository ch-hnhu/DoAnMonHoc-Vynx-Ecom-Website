import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import Faq from "./pages/Faq.jsx";
import Warranty from "./pages/Warranty.jsx";
import Terms from "./pages/Terms.jsx";
import Account from "./pages/Account.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import { CartProvider } from "./components/Cart/CartContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { HelmetProvider } from "react-helmet-async";
import { WishlistProvider } from "./components/Wishlist/WishlistContext.jsx";

export default function App() {
	return (
		<HelmetProvider>
			<CartProvider>
				<WishlistProvider>
					<ScrollToTop />
					<Routes>
						<Route path='dang-nhap' element={<Login />} />
						<Route path='dang-ky' element={<Signup />} />
						<Route path='/' element={<MainLayout />}>
							<Route index element={<Home />} />

							<Route path='san-pham' element={<Shop />} />

							{/* Protected routes - Cần đăng nhập */}
							<Route
								path='gio-hang'
								element={
									<ProtectedRoute>
										<Cart />
									</ProtectedRoute>
								}
							/>
							<Route
								path='thanh-toan'
								element={
									<ProtectedRoute>
										<Checkout />
									</ProtectedRoute>
								}
							/>
							<Route
								path='wishlist'
								element={
									<ProtectedRoute>
										<Wishlist />
									</ProtectedRoute>
								}
							/>
							<Route
								path='tai-khoan/*'
								element={
									<ProtectedRoute>
										<Account />
									</ProtectedRoute>
								}
							/>

						<Route path='chinh-sach-bao-mat' element={<PrivacyPolicy />} />
						<Route path='lien-he' element={<Contact />} />
						<Route path='ve-chung-toi' element={<About />} />
						<Route path='chinh-sach-van-chuyen' element={<ShippingPolicy />} />
						<Route path='cau-hoi-thuong-gap' element={<Faq />} />
						<Route path='chinh-sach-bao-hanh' element={<Warranty />} />
						<Route path='dieu-khoan' element={<Terms />} />
						<Route path='tin-tuc' element={<Blog />} />
						<Route path='tin-tuc/:id' element={<BlogDetail />} />
						<Route path='404' element={<NotFound />} />

							<Route path=':slug' element={<ProductDetails />} />
							<Route path='*' element={<NotFound />} />
						</Route>
					</Routes>
				</WishlistProvider>
			</CartProvider>
		</HelmetProvider>
	);
}
