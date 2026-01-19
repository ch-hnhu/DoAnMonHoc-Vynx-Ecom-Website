/**
 * Format giá tiền theo định dạng VND
 * @param {number} price - Giá cần format
 * @returns {string} - Giá đã format
 */
export const formatCurrency = (price) => {
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

// format slug

/**
 * Chuyển chuỗi thành slug
 * @param {string} text - Chuỗi cần chuyển
 * @returns {string} - Chuỗi đã chuyển thành slug
 */
export const formatSlug = (text) => {
	return text
		.toString()
		.toLowerCase()
		.normalize("NFD") // tách các ký tự có dấu
		.replace(/[\u0300-\u036f]/g, "") // xóa dấu
		.replace(/\s+/g, "-") // thay khoảng trắng bằng dấu gạch ngang
		.replace(/[^\w\-]+/g, "") // xóa ký tự đặc biệt
		.replace(/\-\-+/g, "-") // thay nhiều dấu gạch ngang liên tiếp bằng một dấu
		.replace(/^-+/, "") // xóa dấu gạch ngang ở đầu
		.replace(/-+$/, ""); // xóa dấu gạch ngang ở cuối
};
