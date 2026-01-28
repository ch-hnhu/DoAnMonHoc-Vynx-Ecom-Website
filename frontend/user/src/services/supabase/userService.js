import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến user profile
 */

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise<Object>}
 */
export const getUserProfile = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		throw error;
	}
};

/**
 * Cập nhật thông tin user
 * @param {Object} userData - Dữ liệu cập nhật
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (userData) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("users")
			.update(userData)
			.eq("id", user.id)
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw error;
	}
};

/**
 * Đổi mật khẩu
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<void>}
 */
export const changePassword = async (currentPassword, newPassword) => {
	try {
		// Verify current password by trying to sign in
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		// Get user email to re-authenticate
		const { data: userData } = await supabase
			.from("users")
			.select("email")
			.eq("id", user.id)
			.single();

		// Re-authenticate with current password
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: userData.email,
			password: currentPassword,
		});

		if (signInError) {
			throw new Error("Current password is incorrect");
		}

		// Update to new password
		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) throw error;
	} catch (error) {
		console.error("Error changing password:", error);
		throw error;
	}
};

/**
 * Lấy danh sách địa chỉ của user
 * @returns {Promise<Array>}
 */
export const getUserAddresses = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("user_addresses")
			.select("*")
			.eq("user_id", user.id)
			.order("is_default", { ascending: false })
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data || [];
	} catch (error) {
		console.error("Error fetching user addresses:", error);
		throw error;
	}
};

/**
 * Thêm địa chỉ mới
 * @param {Object} addressData - Dữ liệu địa chỉ
 * @returns {Promise<Object>}
 */
export const addUserAddress = async (addressData) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("user_addresses")
			.insert([
				{
					...addressData,
					user_id: user.id,
				},
			])
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error adding user address:", error);
		throw error;
	}
};

/**
 * Cập nhật địa chỉ
 * @param {number} addressId - ID của địa chỉ
 * @param {Object} addressData - Dữ liệu cập nhật
 * @returns {Promise<Object>}
 */
export const updateUserAddress = async (addressId, addressData) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("user_addresses")
			.update(addressData)
			.eq("id", addressId)
			.eq("user_id", user.id)
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error updating user address:", error);
		throw error;
	}
};

/**
 * Xóa địa chỉ
 * @param {number} addressId - ID của địa chỉ
 * @returns {Promise<void>}
 */
export const deleteUserAddress = async (addressId) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { error } = await supabase
			.from("user_addresses")
			.delete()
			.eq("id", addressId)
			.eq("user_id", user.id);

		if (error) throw error;
	} catch (error) {
		console.error("Error deleting user address:", error);
		throw error;
	}
};
