import { Routes, Route, Navigate } from "react-router-dom";
import ReviewedOrders from "./ReviewedOrders";
import PendingReviewOrders from "./PendingReviewOrders";

/**
 * Component chính quản lý routing cho chức năng đánh giá
 * Bao gồm 2 sub-routes:
 * - /tai-khoan/danh-gia/da-danh-gia: Đơn hàng đã đánh giá
 * - /tai-khoan/danh-gia/chua-danh-gia: Đơn hàng chưa đánh giá
 */
export default function Reviews() {
  return (
    <Routes>
      {/* Redirect mặc định đến chưa đánh giá */}
      <Route index element={<Navigate to="chua-danh-gia" replace />} />

      {/* Route cho đã đánh giá */}
      <Route path="da-danh-gia" element={<ReviewedOrders />} />

      {/* Route cho chưa đánh giá */}
      <Route path="chua-danh-gia" element={<PendingReviewOrders />} />
    </Routes>
  );
}

