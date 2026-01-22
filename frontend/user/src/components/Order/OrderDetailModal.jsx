import React from "react";
import { formatCurrency } from "@shared/utils/formatHelper";
import {
    getDeliveryStatusName,
    deliveryStatusColors,
} from "@shared/utils/orderHelper";

const BACKEND_URL = "http://localhost:8000";
const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/80?text=No+Image";

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

export default function OrderDetailModal({ order, open, onClose, onCancel }) {
    if (!open || !order) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };



    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        {/* Header */}
                        <div className="modal-header border-bottom-0 pb-0">
                            <h5 className="modal-title">
                                Chi tiết đơn hàng #{order.id}
                                <span
                                    className={`badge bg-${deliveryStatusColors[getDeliveryStatusName(order.delivery_status)] || "secondary"} ms-2 fs-6`}
                                >
                                    {getDeliveryStatusName(order.delivery_status)}
                                </span>
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            {/* Thông tin chung */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6 className="text-secondary mb-3">Thông tin nhận hàng</h6>
                                    <p className="mb-1 fw-bold">{order.user?.full_name || order.user_address?.receiver_name}</p>
                                    <p className="mb-1 text-muted">{order.user?.phone || order.user_address?.receiver_phone}</p>
                                    <p className="mb-0 text-muted">{order.user_address?.address_detail}, {order.user_address?.ward}, {order.user_address?.district}, {order.user_address?.city}</p>
                                </div>
                                <div className="col-md-6 mt-3 mt-md-0">
                                    <h6 className="text-secondary mb-3">Thông tin đơn hàng</h6>
                                    <p className="mb-1">
                                        <span className="text-muted me-2">Ngày đặt:</span>
                                        {formatDate(order.created_at)}
                                    </p>
                                    <p className="mb-1">
                                        <span className="text-muted me-2">Thanh toán:</span>
                                        {order.payment_method === "cod" ? "Thanh toán khi nhận hàng (COD)" : order.payment_method}
                                    </p>
                                    <p className="mb-0">
                                        <span className="text-muted me-2">Trạng thái thanh toán:</span>
                                        <span className={order.payment_status === "paid" ? "text-success" : "text-warning"}>
                                            {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <h6 className="text-secondary mb-3">Sản phẩm</h6>
                            <div className="table-responsive mb-4">
                                <table className="table table-borderless align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th style={{ width: "50%" }}>Sản phẩm</th>
                                            <th className="text-center">Đơn giá</th>
                                            <th className="text-center">Số lượng</th>
                                            <th className="text-end">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.order_items?.map((item, index) => (
                                            <tr key={index} className="border-bottom">
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={getProductImage(item.product)}
                                                            alt={item.product?.name}
                                                            className="rounded border"
                                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                            onError={(e) =>
                                                                (e.target.src = DEFAULT_PRODUCT_IMAGE)
                                                            }
                                                        />
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 text-truncate" style={{ maxWidth: "250px" }}>
                                                                {item.product?.name || "Không rõ sản phẩm"}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">{formatCurrency(item.price)}</td>
                                                <td className="text-center">x{item.quantity}</td>
                                                <td className="text-end fw-bold">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Tổng kết */}
                            <div className="row justify-content-end">
                                <div className="col-md-5">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Tạm tính:</span>
                                        <span>{formatCurrency(order.subtotal_amount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Phí vận chuyển:</span>
                                        <span>{formatCurrency(order.shipping_fee)}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span>Giảm giá:</span>
                                            <span>-{formatCurrency(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                        <span className="fw-bold fs-5">Tổng cộng:</span>
                                        <span className="fw-bold fs-5 text-primary">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-top-0">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                            >
                                Đóng
                            </button>
                            {order.delivery_status === "pending" && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => onCancel(order.id)}
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
