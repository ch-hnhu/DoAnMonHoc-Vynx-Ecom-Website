import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "@shared/hooks/useToast";
import StarRating from "../components/StarRating";

/**
 * Component hiển thị danh sách đơn hàng chưa đánh giá
 * Cho phép user đánh giá từng sản phẩm trong đơn hàng
 */
export default function PendingReviewOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  // State lưu trữ đánh giá cho từng sản phẩm
  // Format: { orderId: { productId: { rating: number, content: string } } }
  const [reviews, setReviews] = useState({});

  /**
   * Fetch danh sách đơn hàng chưa đánh giá
   */
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews/pending-orders");
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching pending orders:", err);
      showError("Không thể tải danh sách đơn hàng chưa đánh giá");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cập nhật rating cho sản phẩm
   */
  const handleRatingChange = (orderId, productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [productId]: {
          ...prev[orderId]?.[productId],
          rating,
        },
      },
    }));
  };

  /**
   * Cập nhật nội dung đánh giá cho sản phẩm
   */
  const handleContentChange = (orderId, productId, content) => {
    setReviews((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [productId]: {
          ...prev[orderId]?.[productId],
          content,
        },
      },
    }));
  };

  /**
   * Gửi đánh giá cho đơn hàng
   */
  const handleSubmitReview = async (order) => {
    try {
      // Lấy đánh giá của đơn hàng này
      const orderReviews = reviews[order.id] || {};

      // Kiểm tra xem tất cả sản phẩm đã được đánh giá chưa
      const reviewsArray = order.items.map((item) => {
        const review = orderReviews[item.product_id];
        if (!review || !review.rating) {
          throw new Error(`Vui lòng đánh giá sản phẩm "${item.product_name}"`);
        }
        return {
          product_id: item.product_id,
          rating: review.rating,
          content: review.content || "",
        };
      });

      setSubmitting(true);

      // Gửi đánh giá lên server
      await api.post("/reviews", {
        order_id: order.id,
        reviews: reviewsArray,
      });

      showSuccess("Đánh giá thành công!");

      // Xóa đánh giá của đơn hàng này khỏi state
      setReviews((prev) => {
        const newReviews = { ...prev };
        delete newReviews[order.id];
        return newReviews;
      });

      // Refresh lại danh sách
      await fetchPendingOrders();
    } catch (err) {
      console.error("Error submitting review:", err);
      const errorMessage =
        err.message || err.response?.data?.message || "Không thể gửi đánh giá";
      showError(errorMessage);
    } finally {
      setSubmitting(false);
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
          <i className="fas fa-clipboard-list fs-1 text-muted mb-3"></i>
          <h5 className="text-muted">Không có đơn hàng nào cần đánh giá</h5>
          <p className="text-muted mb-0">
            Các đơn hàng đã giao hàng và chưa đánh giá sẽ hiển thị ở đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h4 className="mb-4">
          <i className="fas fa-clipboard-list text-primary me-2"></i>
          Đơn hàng chưa đánh giá
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

                      {/* Thông tin sản phẩm và form đánh giá */}
                      <div className="col-md-10 col-9">
                        <h6 className="mb-2">{item.product_name}</h6>
                        <p className="text-muted small mb-3">
                          Số lượng: {item.quantity} | Giá:{" "}
                          {formatPrice(item.price)}
                        </p>

                        {/* Form đánh giá */}
                        <div className="mt-3">
                          <label className="form-label fw-bold">
                            Đánh giá sản phẩm này:
                          </label>
                          <div className="mb-3">
                            <StarRating
                              rating={
                                reviews[order.id]?.[item.product_id]?.rating ||
                                0
                              }
                              onRatingChange={(rating) =>
                                handleRatingChange(
                                  order.id,
                                  item.product_id,
                                  rating,
                                )
                              }
                              editable={true}
                              size="lg"
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">
                              Nhận xét (tùy chọn):
                            </label>
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                              value={
                                reviews[order.id]?.[item.product_id]?.content ||
                                ""
                              }
                              onChange={(e) =>
                                handleContentChange(
                                  order.id,
                                  item.product_id,
                                  e.target.value,
                                )
                              }
                              maxLength="1000"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Nút gửi đánh giá */}
                <div className="mt-4 text-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSubmitReview(order)}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Gửi đánh giá
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
