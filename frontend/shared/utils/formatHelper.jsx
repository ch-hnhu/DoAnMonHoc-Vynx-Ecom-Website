/**
 * Format giá tiền theo định dạng VND
 * @param {number} price - Giá cần format
 * @returns {string} - Giá đã format
 */
export const formatPrice = (price) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(price);
};

/**
 * Format ngày tháng theo định dạng Việt Nam
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Ngày đã format
 */
export const formatDate = (date) => {
	const d = new Date(date);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};
