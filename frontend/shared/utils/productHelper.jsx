/**
 * Lấy ảnh sản phẩm đầu tiên từ image_url
 * @param {string|Array} imageUrl - URL ảnh hoặc array các URL
 * @returns {string} - URL ảnh đầy đủ hoặc ảnh mặc định
 */
export const getProductImage = (imageUrl) => {
	if (!imageUrl) return "/img/product-default.png";

	try {
		let firstImage = null;

		if (Array.isArray(imageUrl)) {
			firstImage = imageUrl.length > 0 ? imageUrl[0] : null;
		}
		else if (typeof imageUrl === "string") {
			if (imageUrl.trim().startsWith("[") || imageUrl.trim().startsWith('"')) {
				try {
					const parsed = JSON.parse(imageUrl);
					firstImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
				} catch {
					firstImage = imageUrl;
				}
			} else {
				firstImage = imageUrl;
			}
		}

		if (!firstImage || typeof firstImage !== 'string') return "/img/product-default.png";

		if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
			return firstImage;
		}

		return `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${firstImage}`;
	} catch (error) {
		console.error("Error processing product image:", error, imageUrl);
		return "/img/product-default.png";
	}
};

/**
 * Lấy tất cả ảnh sản phẩm
 * @param {string|Array} imageUrl - URL ảnh hoặc array các URL
 * @returns {Array} - Mảng các URL ảnh đầy đủ
 */
export const getAllProductImages = (imageUrl) => {
	if (!imageUrl) return ["/img/product-default.png"];

	try {
		const images = typeof imageUrl === "string" ? JSON.parse(imageUrl) : imageUrl;

		if (!Array.isArray(images) || images.length === 0) {
			return ["/img/product-default.png"];
		}

		return images.map((url) => {
			if (url.startsWith("http://") || url.startsWith("https://")) {
				return url;
			}
			return `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${url}`;
		});
	} catch {
		if (typeof imageUrl === "string") {
			if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
				return [imageUrl];
			}
			return [`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${imageUrl}`];
		}
		return ["/img/product-default.png"];
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
