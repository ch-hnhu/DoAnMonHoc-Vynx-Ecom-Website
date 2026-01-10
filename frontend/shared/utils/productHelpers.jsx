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
 * Render rating stars
 * @param {number} rating - Số sao (0-5)
 * @returns {Array} - Mảng JSX elements các sao
 */
export const renderRating = (rating) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(<i key={i} className={`fas fa-star ${i <= rating ? "text-primary" : ""}`} />);
	}
	return stars;
};

/**
 * Lấy ảnh sản phẩm đầu tiên từ image_url
 * @param {string|Array} imageUrl - URL ảnh hoặc array các URL
 * @returns {string} - URL ảnh đầu tiên hoặc ảnh mặc định
 */
export const getProductImage = (imageUrl) => {
	if (!imageUrl) return "/img/product-default.png";

	try {
		const images = typeof imageUrl === "string" ? JSON.parse(imageUrl) : imageUrl;
		return Array.isArray(images) && images.length > 0 ? images[0] : "/img/product-default.png";
	} catch {
		return imageUrl;
	}
};

/**
 * Lấy tất cả ảnh sản phẩm
 * @param {string|Array} imageUrl - URL ảnh hoặc array các URL
 * @returns {Array} - Mảng các URL ảnh
 */
export const getAllProductImages = (imageUrl) => {
	if (!imageUrl) return ["/img/product-default.png"];

	try {
		const images = typeof imageUrl === "string" ? JSON.parse(imageUrl) : imageUrl;
		return Array.isArray(images) && images.length > 0 ? images : ["/img/product-default.png"];
	} catch {
		return [imageUrl];
	}
};

/**
 * Tính phần trăm giảm giá
 * @param {Object} product - Object sản phẩm
 * @returns {number} - Phần trăm giảm giá
 */
export const getDiscountPercentage = (product) => {
	if (product?.promotion && product.promotion.discount_type === "percent") {
		return product.promotion.discount_value;
	}
	return 0;
};

/**
 * Tính giá sau khi giảm (nếu có khuyến mãi)
 * @param {Object} product - Object sản phẩm
 * @returns {number} - Giá sau khi giảm
 */
export const getFinalPrice = (product) => {
	if (!product?.promotion) return product.price;

	if (product.promotion.discount_type === "fixed") {
		return Math.max(0, product.price - product.promotion.discount_value);
	}

	if (product.promotion.discount_type === "percent") {
		return product.price * (1 - product.promotion.discount_value / 100);
	}

	return product.price;
};

/**
 * Kiểm tra sản phẩm có đang giảm giá không
 * @param {Object} product - Object sản phẩm
 * @returns {boolean}
 */
export const hasDiscount = (product) => {
	return !!(
		product?.promotion &&
		product.promotion.discount_value > 0 &&
		["percent", "fixed"].includes(product.promotion.discount_type)
	);
};

/**
 * Kiểm tra sản phẩm còn hàng không
 * @param {Object} product - Object sản phẩm
 * @returns {boolean}
 */
export const isInStock = (product) => {
	return product?.stock_quantity > 0;
};

/**
 * Tính số tiền tiết kiệm được
 * @param {Object} product - Object sản phẩm
 * @returns {number} - Số tiền tiết kiệm được
 */
export const getSavingAmount = (product) => {
	const originalPrice = product.price;
	const finalPrice = getFinalPrice(product);
	return originalPrice - finalPrice;
};

/**
 * Format slug thành tên dễ đọc
 * @param {string} slug - Slug cần format
 * @returns {string} - Tên đã format
 */
export const formatSlugToName = (slug) => {
	if (!slug) return "";
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
