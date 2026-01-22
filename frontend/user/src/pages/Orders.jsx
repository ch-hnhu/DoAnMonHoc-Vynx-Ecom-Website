import { useState, useEffect } from "react";
import api from "../services/api";
import { getUser } from "../services/authService";
import { useToast } from "@shared/hooks/useToast";
import { Snackbar, Alert } from "@mui/material";
import OrderDetailModal from "../components/Order/OrderDetailModal";

import {
  deliveryStatuses,
  getDeliveryStatusName,
  deliveryStatusColors,
} from "@shared/utils/orderHelper";

// ================= CONFIG =================
const BACKEND_URL = "http://localhost:8000";
const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/80?text=No+Image";

// ================= IMAGE HELPER =================
const getProductImage = (product) => {
  if (!product || !product.image_url) return DEFAULT_PRODUCT_IMAGE;

  let images = product.image_url;

  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      return DEFAULT_PRODUCT_IMAGE;
    }
  }

  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    return first.startsWith("http") ? first : `${BACKEND_URL}${first}`;
  }

  return DEFAULT_PRODUCT_IMAGE;
};

// ================= COMPONENT =================
export default function Orders() {
  const { toast, showSuccess, showError, closeToast } = useToast();

  const [activeStatus, setActiveStatus] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================= FETCH ORDERS =================
  const fetchOrders = async (status) => {
    try {
      setLoading(true);
      const user = getUser();

      const res = await api.get("/orders", {
        params: {
          delivery_status: status,
          user_id: user?.id,
        },
      });

      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      showError("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, []);

  // ================= HANDLERS =================
  const handleStatusChange = (status) => {
    setActiveStatus(status);
    fetchOrders(status);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    try {
      setLoading(true);
      await api.put(`/orders/${orderId}`, {
        delivery_status: "cancelled",
      });

      showSuccess("Hủy đơn hàng thành công!");
      handleCloseModal();
      fetchOrders(activeStatus);
    } catch (err) {
      console.error(err);
      showError("Không thể hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORMAT =================
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ================= RENDER =================
  return (
    <>
      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>

      {/* MODAL */}
      <OrderDetailModal
        order={selectedOrder}
        open={isModalOpen}
        onClose={handleCloseModal}
        onCancel={handleCancelOrder}
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {/* HEADER */}
          <div className="p-4 border-bottom">
            <h4>
              <i className="fas fa-shopping-bag me-2 text-primary"></i>
              Đơn mua
            </h4>
          </div>

          {/* STATUS NAV */}
          <div className="border-bottom">
            <ul className="nav nav-tabs border-0 px-3 pt-3">
              {deliveryStatuses.map((s) => (
                <li className="nav-item" key={s.id}>
                  <button
                    className={`nav-link ${activeStatus === s.id ? "active" : ""
                      }`}
                    onClick={() => handleStatusChange(s.id)}
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ORDER LIST */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-5">Đang tải...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Chưa có đơn hàng
              </div>
            ) : (
              orders.map((order) => {
                const statusName = getDeliveryStatusName(
                  order.delivery_status,
                );
                const statusColor =
                  deliveryStatusColors[statusName] || "secondary";

                return (
                  <div key={order.id} className="card mb-3 shadow-sm">
                    {/* HEADER */}
                    <div className="card-header d-flex justify-content-between">
                      <div>
                        <strong>Mã đơn hàng:</strong> #{order.id}
                        <span className="text-muted ms-3">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <span className={`badge bg-${statusColor}`}>
                        {statusName}
                      </span>
                    </div>

                    {/* PRODUCTS */}
                    <div className="card-body">
                      {order.order_items?.length > 0 ? (
                        order.order_items.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex mb-3 border-bottom pb-3"
                          >
                            <img
                              src={getProductImage(item.product)}
                              alt={item.product?.name}
                              className="me-3 rounded border"
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                              }}
                              onError={(e) =>
                                (e.target.src = DEFAULT_PRODUCT_IMAGE)
                              }
                            />
                            <div>
                              <h6>{item.product?.name || "Không rõ sản phẩm"}</h6>
                              <p className="mb-1 text-muted">
                                Số lượng: {item.quantity}
                              </p>
                              <strong>{formatPrice(item.price)}</strong>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Không có sản phẩm</p>
                      )}

                      {order.order_items?.length > 2 && (
                        <div className="text-muted fst-italic text-center">
                          ... và {order.order_items.length - 2} sản phẩm khác
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="card-footer d-flex justify-content-between">
                      <strong className="text-danger">
                        {formatPrice(order.total_amount)}
                      </strong>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenModal(order)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
