import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến reviews/đánh giá
 */

/**
 * Lấy danh sách orders chưa đánh giá (delivered và chưa có review)
 * @returns {Promise<Array>}
 */
export const getPendingReviewOrders = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("orders")
			.select(
				`
        *,
        order_items(
          *,
          product:products(
            id,
            name,
            slug,
            product_images(id, image_url, is_primary)
          ),
          review:reviews(id)
        )
      `,
			)
			.eq("user_id", user.id)
			.eq("status", "delivered")
			.order("created_at", { ascending: false });

		if (error) throw error;

		// Lọc ra những orders có ít nhất 1 item chưa được review
		const pendingOrders = (data || []).filter((order) => {
			return order.order_items.some((item) => !item.review || item.review.length === 0);
		});

		return pendingOrders;
	} catch (error) {
		console.error("Error fetching pending review orders:", error);
		throw error;
	}
};

/**
 * Lấy danh sách orders đã đánh giá
 * @returns {Promise<Array>}
 */
export const getReviewedOrders = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("orders")
			.select(
				`
        *,
        order_items(
          *,
          product:products(
            id,
            name,
            slug,
            product_images(id, image_url, is_primary)
          ),
          review:reviews(
            id,
            rating,
            comment,
            created_at
          )
        )
      `,
			)
			.eq("user_id", user.id)
			.eq("status", "delivered")
			.order("created_at", { ascending: false });

		if (error) throw error;

		// Lọc ra những orders có ít nhất 1 item đã được review
		const reviewedOrders = (data || []).filter((order) => {
			return order.order_items.some((item) => item.review && item.review.length > 0);
		});

		return reviewedOrders;
	} catch (error) {
		console.error("Error fetching reviewed orders:", error);
		throw error;
	}
};

/**
 * Tạo review cho một order item
 * @param {Object} reviewData - Dữ liệu review
 * @param {number} reviewData.order_item_id - ID của order item
 * @param {number} reviewData.product_id - ID của sản phẩm
 * @param {number} reviewData.rating - Điểm đánh giá (1-5)
 * @param {string} reviewData.comment - Nội dung đánh giá
 * @returns {Promise<Object>}
 */
export const createReview = async (reviewData) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("reviews")
			.insert([
				{
					...reviewData,
					user_id: user.id,
				},
			])
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error creating review:", error);
		throw error;
	}
};

/**
 * Lấy danh sách reviews của một sản phẩm
 * @param {number} productId - ID của sản phẩm
 * @param {Object} options - Các tùy chọn
 * @param {number} options.page - Trang hiện tại (mặc định: 1)
 * @param {number} options.per_page - Số reviews mỗi trang (mặc định: 10)
 * @returns {Promise<{data: Array, total: number, currentPage: number, lastPage: number}>}
 */
export const getProductReviews = async (productId, options = {}) => {
	const { page = 1, per_page = 10 } = options;

	try {
		let query = supabase
			.from("reviews")
			.select(
				`
        *,
        user:users(id, full_name)
      `,
				{ count: "exact" },
			)
			.eq("product_id", productId)
			.order("created_at", { ascending: false });

		// Áp dụng phân trang
		const from = (page - 1) * per_page;
		const to = from + per_page - 1;
		query = query.range(from, to);

		const { data, error, count } = await query;

		if (error) throw error;

		const total = count || 0;
		const lastPage = Math.ceil(total / per_page);

		return {
			data: data || [],
			total,
			currentPage: page,
			lastPage,
			perPage: per_page,
		};
	} catch (error) {
		console.error("Error fetching product reviews:", error);
		throw error;
	}
};

/**
 * Xóa review (nếu user là người tạo)
 * @param {number} reviewId - ID của review
 * @returns {Promise<void>}
 */
export const deleteReview = async (reviewId) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { error } = await supabase
			.from("reviews")
			.delete()
			.eq("id", reviewId)
			.eq("user_id", user.id);

		if (error) throw error;
	} catch (error) {
		console.error("Error deleting review:", error);
		throw error;
	}
};
