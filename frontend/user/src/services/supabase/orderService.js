import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến orders
 */

/**
 * Lấy danh sách orders của user hiện tại
 * @param {Object} options - Các tùy chọn
 * @param {string} options.status - Trạng thái đơn hàng (pending, processing, shipped, delivered, cancelled)
 * @param {number} options.page - Trang hiện tại (mặc định: 1)
 * @param {number} options.per_page - Số orders mỗi trang (mặc định: 10)
 * @returns {Promise<{data: Array, total: number, currentPage: number, lastPage: number}>}
 */
export const getOrders = async (options = {}) => {
	const { status, page = 1, per_page = 10 } = options;

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		let query = supabase
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
            price,
            discount_percentage,
            product_images(id, image_url, is_primary)
          )
        )
      `,
				{ count: "exact" },
			)
			.eq("user_id", user.id);

		if (status && status !== "all") {
			query = query.eq("status", status);
		}

		query = query.order("created_at", { ascending: false });

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
		console.error("Error fetching orders:", error);
		throw error;
	}
};

/**
 * Lấy chi tiết order theo ID
 * @param {number} id - ID của order
 * @returns {Promise<Object>}
 */
export const getOrderById = async (id) => {
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
            price,
            discount_percentage,
            product_images(id, image_url, is_primary)
          )
        )
      `,
			)
			.eq("id", id)
			.eq("user_id", user.id)
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error fetching order by ID:", error);
		throw error;
	}
};

/**
 * Tạo order mới
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Promise<Object>}
 */
export const createOrder = async (orderData) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("orders")
			.insert([
				{
					...orderData,
					user_id: user.id,
				},
			])
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error creating order:", error);
		throw error;
	}
};

/**
 * Cập nhật trạng thái order
 * @param {number} orderId - ID của order
 * @param {string} status - Trạng thái mới
 * @param {Object} additionalData - Dữ liệu bổ sung (optional)
 * @returns {Promise<Object>}
 */
export const updateOrderStatus = async (orderId, status, additionalData = {}) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("orders")
			.update({
				status,
				...additionalData,
			})
			.eq("id", orderId)
			.eq("user_id", user.id)
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error updating order status:", error);
		throw error;
	}
};

/**
 * Hủy đơn hàng
 * @param {number} orderId - ID của order
 * @returns {Promise<Object>}
 */
export const cancelOrder = async (orderId) => {
	return updateOrderStatus(orderId, "cancelled");
};

/**
 * Xác nhận thanh toán đơn hàng (VNPay callback)
 * @param {string} orderCode - Mã đơn hàng
 * @returns {Promise<Object>}
 */
export const confirmOrderPayment = async (orderCode) => {
	try {
		const { data, error } = await supabase
			.from("orders")
			.update({
				payment_status: "paid",
				status: "processing",
			})
			.eq("order_code", orderCode)
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error confirming order payment:", error);
		throw error;
	}
};
