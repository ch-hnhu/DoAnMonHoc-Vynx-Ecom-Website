import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến wishlist
 */

/**
 * Lấy danh sách wishlist của user hiện tại
 * @returns {Promise<Array>}
 */
export const getWishlistItems = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.from("wishlists")
			.select(
				`
        *,
        product:products(
          *,
          category:categories(id, name, slug),
          brand:brands(id, name, slug),
          product_images(id, image_url, is_primary, display_order)
        )
      `,
			)
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data || [];
	} catch (error) {
		console.error("Error fetching wishlist items:", error);
		throw error;
	}
};

/**
 * Thêm sản phẩm vào wishlist
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise<Object>}
 */
export const addToWishlist = async (productId) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		// Kiểm tra xem sản phẩm đã có trong wishlist chưa
		const { data: existing } = await supabase
			.from("wishlists")
			.select("id")
			.eq("user_id", user.id)
			.eq("product_id", productId)
			.single();

		if (existing) {
			throw new Error("Product already in wishlist");
		}

		const { data, error } = await supabase
			.from("wishlists")
			.insert([
				{
					user_id: user.id,
					product_id: productId,
				},
			])
			.select()
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error adding to wishlist:", error);
		throw error;
	}
};

/**
 * Xóa sản phẩm khỏi wishlist
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise<void>}
 */
export const removeFromWishlist = async (productId) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { error } = await supabase
			.from("wishlists")
			.delete()
			.eq("user_id", user.id)
			.eq("product_id", productId);

		if (error) throw error;
	} catch (error) {
		console.error("Error removing from wishlist:", error);
		throw error;
	}
};

/**
 * Xóa tất cả items khỏi wishlist
 * @returns {Promise<void>}
 */
export const clearWishlist = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { error } = await supabase.from("wishlists").delete().eq("user_id", user.id);

		if (error) throw error;
	} catch (error) {
		console.error("Error clearing wishlist:", error);
		throw error;
	}
};

/**
 * Kiểm tra sản phẩm có trong wishlist không
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise<boolean>}
 */
export const isInWishlist = async (productId) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return false;
		}

		const { data, error } = await supabase
			.from("wishlists")
			.select("id")
			.eq("user_id", user.id)
			.eq("product_id", productId)
			.single();

		if (error && error.code !== "PGRST116") {
			// PGRST116 = no rows returned
			throw error;
		}

		return !!data;
	} catch (error) {
		console.error("Error checking wishlist status:", error);
		return false;
	}
};

/**
 * Lấy số lượng items trong wishlist
 * @returns {Promise<number>}
 */
export const getWishlistCount = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return 0;
		}

		const { count, error } = await supabase
			.from("wishlists")
			.select("*", { count: "exact", head: true })
			.eq("user_id", user.id);

		if (error) throw error;

		return count || 0;
	} catch (error) {
		console.error("Error getting wishlist count:", error);
		return 0;
	}
};
