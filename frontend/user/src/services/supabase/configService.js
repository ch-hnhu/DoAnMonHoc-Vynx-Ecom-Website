import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý các API liên quan đến configuration/cấu hình trang web
 */

/**
 * Lấy cấu hình trang web
 * @returns {Promise<Object>}
 */
export const getConfiguration = async () => {
	try {
		const { data, error } = await supabase.from("configurations").select("*").single();

		if (error) throw error;

		return data || {};
	} catch (error) {
		console.error("Error fetching configuration:", error);
		throw error;
	}
};

/**
 * Lấy giá trị cấu hình theo key
 * @param {string} key - Key của cấu hình
 * @returns {Promise<any>}
 */
export const getConfigValue = async (key) => {
	try {
		const config = await getConfiguration();
		return config[key];
	} catch (error) {
		console.error(`Error fetching config value for key ${key}:`, error);
		return null;
	}
};

/**
 * Lấy thông tin contact/liên hệ
 * @returns {Promise<Object>}
 */
export const getContactInfo = async () => {
	try {
		const config = await getConfiguration();
		return {
			phone: config.contact_phone,
			email: config.contact_email,
			address: config.contact_address,
			facebook: config.social_facebook,
			instagram: config.social_instagram,
			youtube: config.social_youtube,
			zalo: config.social_zalo,
		};
	} catch (error) {
		console.error("Error fetching contact info:", error);
		return {};
	}
};

/**
 * Lấy nội dung các trang tĩnh
 * @param {string} pageKey - Key của trang (terms, privacy, warranty, shipping, faq, about)
 * @returns {Promise<string>}
 */
export const getPageContent = async (pageKey) => {
	try {
		const config = await getConfiguration();
		const contentMap = {
			terms: "terms_content",
			privacy: "privacy_content",
			warranty: "warranty_content",
			shipping: "shipping_content",
			faq: "faq_content",
			about: "about_content",
		};

		const fieldName = contentMap[pageKey];
		return config[fieldName] || "";
	} catch (error) {
		console.error(`Error fetching page content for ${pageKey}:`, error);
		return "";
	}
};
