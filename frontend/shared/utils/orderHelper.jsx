/**
 * Định nghĩa các trạng thái đơn hàng và các hàm helper liên quan
 */
export const paymentStatuses = [
	{ id: "paid", name: "Đã thanh toán" },
	{ id: "pending", name: "Chờ xử lý" },
	{ id: "failed", name: "Thanh toán thất bại" },
	{ id: "refunded", name: "Đã hoàn tiền" },
	{ id: "cancelled", name: "Đã hủy" },
];

/**
 * Định nghĩa các trạng thái giao hàng và các hàm helper liên quan
 */
export const deliveryStatuses = [
	{ id: "delivered", name: "Đã giao" },
	{ id: "shipping", name: "Đang giao" },
	{ id: "confirmed", name: "Đã xác nhận" },
	{ id: "pending", name: "Chờ xử lý" },
	{ id: "failed", name: "Giao hàng thất bại" },
	{ id: "returned", name: "Đã trả hàng" },
	{ id: "cancelled", name: "Đã hủy" },
];

/**
 * Định nghĩa màu sắc cho các trạng thái (dùng cho MUI Chip)
 * Key là tên tiếng Việt để khớp với valueGetter
 */
export const paymentStatusColors = {
	"Đã thanh toán": "success",
	"Chờ xử lý": "warning",
	"Thanh toán thất bại": "error",
	"Đã hoàn tiền": "info",
	"Đã hủy": "default",
};

/**
 * Định nghĩa màu sắc cho các trạng thái giao hàng (dùng cho MUI Chip)
 * Key là tên tiếng Việt để khớp với valueGetter
 */
export const deliveryStatusColors = {
	"Đã giao": "success",
	"Đang giao": "info",
	"Đã xác nhận": "primary",
	"Chờ xử lý": "warning",
	"Giao hàng thất bại": "error",
	"Đã trả hàng": "default",
	"Đã hủy": "default",
};

/**
 * Helper functions để map trạng thái thanh toán tiếng Anh sang tiếng Việt
 * @param {string} id - ID của trạng thái
 * @returns {string} - Tên trạng thái bằng tiếng Việt
 */
export const getPaymentStatusName = (id) => {
	return paymentStatuses.find((s) => s.id === id)?.name || id;
};

/**
 * Helper functions để map trạng thái giao hàng tiếng Anh sang tiếng Việt
 * @param {string} id - ID của trạng thái
 * @returns {string} - Tên trạng thái bằng tiếng Việt
 */
export const getDeliveryStatusName = (id) => {
	return deliveryStatuses.find((s) => s.id === id)?.name || id;
};

/**
 * Helper functions để map tên trạng thái thanh toán tiếng Việt về ID tiếng Anh
 * @param {string} name - Tên trạng thái bằng tiếng Việt
 * @returns {string} - ID của trạng thái
 */
export const getPaymentStatusId = (name) => {
	return paymentStatuses.find((s) => s.name === name)?.id || name;
};

/**
 * Helper functions để map tên trạng thái giao hàng tiếng Việt về ID tiếng Anh
 * @param {string} name - Tên trạng thái bằng tiếng Việt
 * @returns {string} - ID của trạng thái
 */
export const getDeliveryStatusId = (name) => {
	return deliveryStatuses.find((s) => s.name === name)?.id || name;
};
