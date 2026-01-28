import { supabase } from "@shared/lib/supabase.js";

/**
 * Service để xử lý authentication với Supabase Auth
 */

const CART_RESET_KEY = "cart_reset";

const notifyAuthChange = () => {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event("auth:changed"));
	}
};

/**
 * Đăng ký người dùng mới
 */
export const register = async (
	username,
	email,
	password,
	password_confirmation,
	full_name,
	phone = null,
) => {
	try {
		// Kiểm tra password confirmation
		if (password !== password_confirmation) {
			throw new Error("Passwords do not match");
		}

		// Đăng ký với Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username,
					full_name,
					phone,
				},
			},
		});

		if (authError) throw authError;

		// Tạo user record trong bảng users
		const { data: userData, error: userError } = await supabase
			.from("users")
			.insert([
				{
					id: authData.user.id,
					username,
					email,
					full_name,
					phone,
					role: "customer",
				},
			])
			.select()
			.single();

		if (userError) throw userError;

		notifyAuthChange();

		return {
			user: authData.user,
			session: authData.session,
			profile: userData,
		};
	} catch (error) {
		console.error("Register error:", error);
		throw error;
	}
};

/**
 * Đăng nhập người dùng
 */
export const login = async (username, password) => {
	try {
		// Tìm email từ username
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("email")
			.or(`username.eq.${username},email.eq.${username}`)
			.single();

		if (userError) {
			throw new Error("Invalid username or password");
		}

		// Đăng nhập với Supabase Auth
		const { data, error } = await supabase.auth.signInWithPassword({
			email: userData.email,
			password,
		});

		if (error) throw error;

		notifyAuthChange();

		return {
			user: data.user,
			session: data.session,
		};
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
};

/**
 * Đăng xuất người dùng
 */
export const logout = async () => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	} catch (error) {
		console.error("Logout error:", error);
	} finally {
		localStorage.setItem(CART_RESET_KEY, "1");
		notifyAuthChange();
	}
};

/**
 * Lấy token từ session
 */
export const getToken = async () => {
	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session?.access_token || null;
	} catch (error) {
		console.error("Error getting token:", error);
		return null;
	}
};

/**
 * Lấy thông tin user hiện tại
 */
export const getUser = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return null;

		// Lấy thêm thông tin từ bảng users
		const { data: profile } = await supabase
			.from("users")
			.select("*")
			.eq("id", user.id)
			.single();

		return profile;
	} catch (error) {
		console.error("Error getting user:", error);
		return null;
	}
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 */
export const isAuthenticated = async () => {
	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return !!session;
	} catch (error) {
		return false;
	}
};

/**
 * Khởi tạo auth - Setup auth state listener
 */
export const initAuth = () => {
	// Listen to auth state changes
	supabase.auth.onAuthStateChange((event, session) => {
		if (event === "SIGNED_IN") {
			notifyAuthChange();
		} else if (event === "SIGNED_OUT") {
			notifyAuthChange();
		} else if (event === "TOKEN_REFRESHED") {
			// Token đã được làm mới tự động
		}
	});
};

/**
 * Quên mật khẩu - Gửi email reset
 */
export const forgotPassword = async (email) => {
	try {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		});

		if (error) throw error;
	} catch (error) {
		console.error("Forgot password error:", error);
		throw error;
	}
};

/**
 * Reset mật khẩu
 */
export const resetPassword = async (newPassword) => {
	try {
		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) throw error;
	} catch (error) {
		console.error("Reset password error:", error);
		throw error;
	}
};

// Khởi tạo auth khi import module
initAuth();
