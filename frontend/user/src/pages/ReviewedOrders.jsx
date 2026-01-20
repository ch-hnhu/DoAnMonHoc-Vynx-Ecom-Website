import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "@shared/hooks/useToast";
import StarRating from "../components/StarRating";

/**
 * Component hiển thị danh sách đơn hàng đã đánh giá
 */
export default function ReviewedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  /**
   * Fetch danh sách đơn hàng đã đánh giá
   */
  useEffect(() => {
    fetchReviewedOrders();
  }, []);

  const fetchReviewedOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews/reviewed-orders");
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching reviewed orders:", err);
      showError("Không thể tải danh sách đơn hàng đã đánh giá");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format giá tiền
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 mb-0 text-muted">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 text-center">
          <i className="fas fa-star fs-1 text-muted mb-3"></i>
          <h5 className="text-muted">Chưa có đơn hàng nào được đánh giá</h5>
          <p className="text-muted mb-0">
            Các đơn hàng đã giao hàng và được đánh giá sẽ hiển thị ở đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h4 className="mb-4">
          <i className="fas fa-star text-warning me-2"></i>
          Đơn hàng đã đánh giá
        </h4>

        {/* Danh sách đơn hàng */}
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="card mb-3 border shadow-sm">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Mã đơn hàng:</strong> #{order.id}
                  </div>
                  <div className="text-muted small">
                    Ngày hoàn thành: {formatDate(order.updated_at)}
                  </div>
                </div>
              </div>

              <div className="card-body">
                {/* Danh sách sản phẩm */}
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className={`${index > 0 ? "border-top pt-3 mt-3" : ""}`}
                  >
                    <div className="row">
                      {/* Hình ảnh sản phẩm */}
                      <div className="col-md-2 col-3">
                        <img
                          src={item.product_image || "/placeholder.png"}
                          alt={item.product_name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "80px", objectFit: "cover" }}
                        />
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="col-md-10 col-9">
                        <h6 className="mb-2">{item.product_name}</h6>
                        <p className="text-muted small mb-2">
                          Số lượng: {item.quantity} | Giá:{" "}
                          {formatPrice(item.price)}
                        </p>

                        {/* Hiển thị đánh giá */}
                        {item.review && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="mb-2">
                              <strong className="me-2">
                                Đánh giá của bạn:
                              </strong>
                              <StarRating
                                rating={item.review.rating}
                                editable={false}
                                size="sm"
                              />
                            </div>
                            {item.review.content && (
                              <p className="mb-1 text-muted">
                                <i className="fas fa-comment me-2"></i>
                                {item.review.content}
                              </p>
                            )}
                            <small className="text-muted">
                              Đánh giá vào: {formatDate(item.review.created_at)}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
