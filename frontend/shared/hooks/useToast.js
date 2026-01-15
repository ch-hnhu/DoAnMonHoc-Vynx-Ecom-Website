import { useState } from "react";

/**
 * Custom hook for toast notifications
 * @returns {Object} - Toast state và functions
 */
export const useToast = () => {
	const [toast, setToast] = useState({
		open: false,
		message: "",
		severity: "success", // 'success' | 'error' | 'warning' | 'info'
	});

	/**
	 * Hiển thị toast notification
	 * @param {string} message - Nội dung thông báo
	 * @param {string} severity - Loại thông báo (success/error/warning/info)
	 */
	const showToast = (message, severity = "success") => {
		setToast({ open: true, message, severity });
	};

	/**
	 * Hiển thị toast success
	 * @param {string} message - Nội dung thông báo
	 */
	const showSuccess = (message) => {
		showToast(message, "success");
	};

	/**
	 * Hiển thị toast error
	 * @param {string} message - Nội dung thông báo
	 */
	const showError = (message) => {
		showToast(message, "error");
	};

	/**
	 * Hiển thị toast warning
	 * @param {string} message - Nội dung thông báo
	 */
	const showWarning = (message) => {
		showToast(message, "warning");
	};

	/**
	 * Hiển thị toast info
	 * @param {string} message - Nội dung thông báo
	 */
	const showInfo = (message) => {
		showToast(message, "info");
	};

	/**
	 * Đóng toast notification
	 * @param {Event} event - Event object
	 * @param {string} reason - Lý do đóng
	 */
	const closeToast = (event, reason) => {
		if (reason === "clickaway") return;
		setToast({ ...toast, open: false });
	};

	return {
		toast,
		showToast,
		showSuccess,
		showError,
		showWarning,
		showInfo,
		closeToast,
	};
};
