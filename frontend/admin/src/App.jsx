import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import Table from "./pages/Table";
import Product from "./pages/Product/Product";
import ProductTrash from "./pages/Product/ProductTrash";
import AddProduct from "./pages/Product/AddProduct";
import Order from "./pages/Order/Order";
import User from "./pages/User/User";
import UserTrash from "./pages/User/UserTrash";
import Brand from "./pages/Brand/Brand";
import BrandTrash from "./pages/Brand/BrandTrash";
import Category from "./pages/Category/Category";
import CategoryTrash from "./pages/Category/CategoryTrash";
import Attribute from "./pages/Attribute/Attribute";
import AttributeTrash from "./pages/Attribute/AttributeTrash";
import Promotion from "./pages/Promotion";
import Configuration from "./pages/Configuration";
import Review from "./pages/Review/Review";
import ReviewTrash from "./pages/Review/ReviewTrash";
import SupportRequest from "./pages/SupportRequest/SupportRequest";
import SupportRequestTrash from "./pages/SupportRequest/SupportRequestTrash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRedirect from "./pages/AuthRedirect";
import AdminProfile from "./pages/AdminProfile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="dang-nhap" element={<Login />} />
      <Route path="dang-ky" element={<Signup />} />
      <Route path="auth-redirect" element={<AuthRedirect />} />

      {/* Protected routes - Chỉ admin/employee */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="table" element={<Table />} />
        <Route path="san-pham" element={<Product />} />
        <Route path="san-pham/thung-rac" element={<ProductTrash />} />
        <Route path="san-pham/them" element={<AddProduct />} />
        <Route path="don-hang" element={<Order />} />
        <Route path="nguoi-dung" element={<User />} />
        <Route path="nguoi-dung/thung-rac" element={<UserTrash />} />
        <Route path="thuong-hieu" element={<Brand />} />
        <Route path="thuong-hieu/thung-rac" element={<BrandTrash />} />
        <Route path="danh-muc" element={<Category />} />
        <Route path="danh-muc/thung-rac" element={<CategoryTrash />} />
        <Route path="thuoc-tinh" element={<Attribute />} />
        <Route path="thuoc-tinh/thung-rac" element={<AttributeTrash />} />
        <Route path="khuyen-mai" element={<Promotion />} />
        <Route path="cau-hinh" element={<Configuration />} />
        <Route path="danh-gia" element={<Review />} />
        <Route path="danh-gia/thung-rac" element={<ReviewTrash />} />
        <Route path="lien-he" element={<SupportRequest />} />
        <Route path="lien-he/thung-rac" element={<SupportRequestTrash />} />
        <Route path="thong-tin-ca-nhan" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
