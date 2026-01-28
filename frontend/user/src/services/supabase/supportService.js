import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến support requests (liên hệ, hỗ trợ)
 */

/**
 * Tạo support request mới (contact form)
 * @param {Object} requestData - Dữ liệu liên hệ
 * @param {string} requestData.name - Tên người liên hệ
 * @param {string} requestData.email - Email người liên hệ
 * @param {string} requestData.phone - Số điện thoại
 * @param {string} requestData.subject - Tiêu đề
 * @param {string} requestData.message - Nội dung
 * @returns {Promise<Object>}
 */
export const createSupportRequest = async (requestData) => {
	try {
		const { data, error } = await supabase
			.from("support_requests")
			.insert([
				{
					...requestData,
					status: "pending",
				},
			])
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error creating support request:", error);
		throw error;
	}
};

/**
 * Lấy danh sách support requests của user hiện tại
 * @returns {Promise<Array>}
 */
export const getUserSupportRequests = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			// Nếu chưa đăng nhập, trả về mảng rỗng
			return [];
		}

		// Lấy email của user
		const { data: userData } = await supabase
			.from("users")
			.select("email")
			.eq("id", user.id)
			.single();

		// Lấy support requests theo email
		const { data, error } = await supabase
			.from("support_requests")
			.select("*")
			.eq("email", userData.email)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data || [];
	} catch (error) {
		console.error("Error fetching user support requests:", error);
		return [];
	}
};
