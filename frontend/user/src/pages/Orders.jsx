import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";

// Danh sách trạng thái đơn hàng
const ORDER_STATUSES = [
  { key: "pending", label: "Đang chờ xử lý", color: "warning" },
  { key: "confirmed", label: "Đã xác nhận", color: "info" },
  { key: "shipping", label: "Đang giao hàng", color: "primary" },
  { key: "delivered", label: "Đã giao hàng", color: "success" },
  { key: "failed", label: "Giao hàng thất bại", color: "danger" },
  { key: "returned", label: "Đã hoàn trả", color: "secondary" },
  { key: "cancelled", label: "Đã hủy", color: "dark" },
];

export default function Orders() {
  // Toast notification
  const { toast, showSuccess, showError, closeToast } = useToast();

  // State quản lý trạng thái đang chọn
  const [activeStatus, setActiveStatus] = useState("pending");

  // State quản lý danh sách đơn hàng
  const [orders, setOrders] = useState([]);

  // State quản lý loading
  const [loading, setLoading] = useState(false);

  /**
   * Lấy danh sách đơn hàng theo trạng thái
   */
  const fetchOrders = async (status) => {
    try {
      setLoading(true);
      const response = await api.get(`/orders?status=${status}`);
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      showError("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý khi click vào tab trạng thái
   */
  const handleStatusChange = (status) => {
    setActiveStatus(status);
    fetchOrders(status);
  };

  /**
   * Xử lý hủy đơn hàng
   */
  const handleCancelOrder = async (orderId) => {
    // Hiển thị confirm
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await api.post(`/orders/${orderId}/cancel`);

      // Hiển thị thông báo thành công
      showSuccess("Hủy đơn hàng thành công!");

      // Refresh lại danh sách đơn hàng
      await fetchOrders(activeStatus);
    } catch (err) {
      console.error("Error cancelling order:", err);
      const errorMessage =
        err.response?.data?.message || "Không thể hủy đơn hàng";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format số tiền
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  /**
   * Format ngày tháng
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Lấy badge color theo trạng thái
   */
  const getStatusBadge = (status) => {
    const statusObj = ORDER_STATUSES.find((s) => s.key === status);
    return statusObj ? statusObj.color : "secondary";
  };

  /**
   * Lấy label theo trạng thái
   */
  const getStatusLabel = (status) => {
    const statusObj = ORDER_STATUSES.find((s) => s.key === status);
    return statusObj ? statusObj.label : status;
  };

  /**
   * Kiểm tra xem có hiển thị nút hủy không
   * Chỉ hiển thị nếu trạng thái là "Đang chờ xử lý"
   */
  const canCancelOrder = (status) => {
    return status === "pending";
  };

  // Fetch orders khi component mount
  useEffect(() => {
    fetchOrders(activeStatus);
  }, []);

  return (
    <>
      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {/* Header */}
          <div className="p-4 border-bottom">
            <h4 className="mb-0">
              <i className="fas fa-shopping-bag me-2 text-primary"></i>
              Đơn mua
            </h4>
          </div>

          {/* Navbar trạng thái */}
          <div className="border-bottom">
            <ul className="nav nav-tabs border-0 px-3 pt-3">
              {ORDER_STATUSES.map((status) => (
                <li className="nav-item" key={status.key}>
                  <button
                    className={`nav-link ${
                      activeStatus === status.key ? "active" : ""
                    }`}
                    onClick={() => handleStatusChange(status.key)}
                    style={{
                      border: "none",
                      borderBottom:
                        activeStatus === status.key
                          ? "2px solid var(--bs-primary)"
                          : "2px solid transparent",
                      color:
                        activeStatus === status.key
                          ? "var(--bs-primary)"
                          : "var(--bs-secondary)",
                      fontWeight: activeStatus === status.key ? "600" : "400",
                    }}
                  >
                    {status.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Danh sách đơn hàng */}
          <div className="p-4">
            {loading ? (
              // Loading state
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="text-muted mt-3">Đang tải đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              // Empty state
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p className="text-muted">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              // Danh sách đơn hàng
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="card mb-3 border shadow-sm">
                    {/* Header đơn hàng */}
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Mã đơn hàng:</strong> #{order.id}
                        <span className="text-muted ms-3">
                          <i className="far fa-clock me-1"></i>
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <span
                        className={`badge bg-${getStatusBadge(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="card-body">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center mb-3 pb-3 border-bottom"
                          >
                            {/* Ảnh sản phẩm */}
                            <img
                              src={
                                item.product_image ||
                                "https://placehold.co/80?text=No+Image"
                              }
                              alt={item.product_name}
                              className="rounded me-3"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />

                            {/* Thông tin sản phẩm */}
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{item.product_name}</h6>
                              <p className="text-muted mb-1">
                                Số lượng: {item.quantity}
                              </p>
                              <p className="text-primary fw-bold mb-0">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Không có sản phẩm</p>
                      )}
                    </div>

                    {/* Footer đơn hàng */}
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Tổng tiền:</strong>
                        <span className="text-danger fs-5 ms-2">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>

                      {/* Nút hủy đơn hàng - chỉ hiển thị nếu trạng thái là "Đang chờ xử lý" */}
                      {canCancelOrder(order.status) && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={loading}
                        >
                          <i className="fas fa-times me-2"></i>
                          Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
