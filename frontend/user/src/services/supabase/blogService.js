import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến blog/tin tức
 */

/**
 * Lấy danh sách blogs với phân trang
 * @param {Object} options - Các tùy chọn
 * @param {number} options.page - Trang hiện tại (mặc định: 1)
 * @param {number} options.per_page - Số blogs mỗi trang (mặc định: 10)
 * @returns {Promise<{data: Array, total: number, currentPage: number, lastPage: number}>}
 */
export const getBlogs = async (options = {}) => {
	const { page = 1, per_page = 10 } = options;

	try {
		let query = supabase
			.from("blogs")
			.select("*", { count: "exact" })
			.eq("is_active", true)
			.order("published_at", { ascending: false });

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
		console.error("Error fetching blogs:", error);
		throw error;
	}
};

/**
 * Lấy chi tiết blog theo ID
 * @param {number} id - ID của blog
 * @returns {Promise<Object>}
 */
export const getBlogById = async (id) => {
	try {
		const { data, error } = await supabase
			.from("blogs")
			.select("*")
			.eq("id", id)
			.eq("is_active", true)
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error fetching blog by ID:", error);
		throw error;
	}
};

/**
 * Lấy danh sách blogs mới nhất (sidebar, related posts, etc.)
 * @param {number} limit - Số lượng blogs (mặc định: 5)
 * @param {number} excludeId - ID blog cần loại trừ (optional)
 * @returns {Promise<Array>}
 */
export const getLatestBlogs = async (limit = 5, excludeId = null) => {
	try {
		let query = supabase
			.from("blogs")
			.select("*")
			.eq("is_active", true)
			.order("published_at", { ascending: false })
			.limit(limit);

		if (excludeId) {
			query = query.neq("id", excludeId);
		}

		const { data, error } = await query;

		if (error) throw error;

		return data || [];
	} catch (error) {
		console.error("Error fetching latest blogs:", error);
		throw error;
	}
};
