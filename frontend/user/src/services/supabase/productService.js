import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến sản phẩm
 */

/**
 * Lấy danh sách sản phẩm với các tùy chọn lọc và phân trang
 * @param {Object} options - Các tùy chọn
 * @param {number} options.page - Trang hiện tại (mặc định: 1)
 * @param {number} options.per_page - Số sản phẩm mỗi trang (mặc định: 20)
 * @param {string} options.sort - Sắp xếp (bestseller, newest, price_asc, price_desc, name_asc)
 * @param {string} options.category_slug - Slug của category
 * @param {string} options.brand_slug - Slug của brand
 * @param {number} options.has_promotion - 1 để lọc sản phẩm có khuyến mãi
 * @param {string} options.search - Từ khóa tìm kiếm
 * @param {number} options.min_price - Giá tối thiểu
 * @param {number} options.max_price - Giá tối đa
 * @returns {Promise<{data: Array, total: number, currentPage: number, lastPage: number}>}
 */
export const getProducts = async (options = {}) => {
	const {
		page = 1,
		per_page = 20,
		sort = "newest",
		category_slug,
		brand_slug,
		has_promotion,
		search,
		min_price,
		max_price,
	} = options;

	try {
		// Start building query
		let query = supabase
			.from("products")
			.select(
				`
        *,
        category:categories(id, name, slug),
        brand:brands(id, name, slug),
        product_images(id, image_url, is_primary, display_order)
      `,
				{ count: "exact" },
			)
			.eq("is_active", true);

		// Áp dụng các bộ lọc
		if (category_slug) {
			query = query.eq("categories.slug", category_slug);
		}

		if (brand_slug) {
			query = query.eq("brands.slug", brand_slug);
		}

		if (has_promotion === 1 || has_promotion === "1") {
			query = query.gt("discount_percentage", 0);
		}

		if (search && search.trim()) {
			query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
		}

		if (min_price !== undefined && min_price !== null) {
			query = query.gte("price", min_price);
		}

		if (max_price !== undefined && max_price !== null) {
			query = query.lte("price", max_price);
		}

		// Áp dụng sắp xếp
		switch (sort) {
			case "bestseller":
				query = query.order("total_sold", { ascending: false });
				break;
			case "newest":
				query = query.order("created_at", { ascending: false });
				break;
			case "price_asc":
				query = query.order("price", { ascending: true });
				break;
			case "price_desc":
				query = query.order("price", { ascending: false });
				break;
			case "name_asc":
				query = query.order("name", { ascending: true });
				break;
			default:
				query = query.order("created_at", { ascending: false });
		}

		// Áp dụng phân trang
		const from = (page - 1) * per_page;
		const to = from + per_page - 1;
		query = query.range(from, to);

		// Thực hiện query
		const { data, error, count } = await query;

		if (error) throw error;

		// Tính toán thông tin phân trang
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
		console.error("Error fetching products:", error);
		throw error;
	}
};

/**
 * Lấy chi tiết sản phẩm theo slug
 * @param {string} slug - Slug của sản phẩm
 * @returns {Promise<Object>}
 */
export const getProductBySlug = async (slug) => {
	try {
		const { data, error } = await supabase
			.from("products")
			.select(
				`
        *,
        category:categories(id, name, slug),
        brand:brands(id, name, slug),
        product_images(id, image_url, is_primary, display_order),
        product_attributes(
          id,
          value,
          attribute:attributes(id, name)
        )
      `,
			)
			.eq("slug", slug)
			.eq("is_active", true)
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error fetching product by slug:", error);
		throw error;
	}
};

/**
 * Lấy chi tiết sản phẩm theo ID
 * @param {number} id - ID của sản phẩm
 * @returns {Promise<Object>}
 */
export const getProductById = async (id) => {
	try {
		const { data, error } = await supabase
			.from("products")
			.select(
				`
        *,
        category:categories(id, name, slug),
        brand:brands(id, name, slug),
        product_images(id, image_url, is_primary, display_order),
        product_attributes(
          id,
          value,
          attribute:attributes(id, name)
        )
      `,
			)
			.eq("id", id)
			.eq("is_active", true)
			.single();

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error fetching product by ID:", error);
		throw error;
	}
};

/**
 * Lấy danh sách sản phẩm liên quan (cùng category)
 * @param {number} productId - ID sản phẩm hiện tại để loại trừ
 * @param {number} categoryId - ID category
 * @param {number} limit - Số lượng sản phẩm (mặc định: 8)
 * @returns {Promise<Array>}
 */
export const getRelatedProducts = async (productId, categoryId, limit = 8) => {
	try {
		const { data, error } = await supabase
			.from("products")
			.select(
				`
        *,
        category:categories(id, name, slug),
        brand:brands(id, name, slug),
        product_images(id, image_url, is_primary, display_order)
      `,
			)
			.eq("category_id", categoryId)
			.eq("is_active", true)
			.neq("id", productId)
			.order("total_sold", { ascending: false })
			.limit(limit);

		if (error) throw error;

		return data || [];
	} catch (error) {
		console.error("Error fetching related products:", error);
		throw error;
	}
};
