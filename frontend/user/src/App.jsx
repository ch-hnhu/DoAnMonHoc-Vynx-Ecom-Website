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
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import Faq from "./pages/Faq.jsx";
import Warranty from "./pages/Warranty.jsx";
import Terms from "./pages/Terms.jsx";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="shop" element={<Shop />} />
          <Route path="product" element={<ProductDetails />} />

          {/* Protected routes - Cần đăng nhập */}
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="support" element={<Support />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="faq" element={<Faq />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="terms" element={<Terms />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}
