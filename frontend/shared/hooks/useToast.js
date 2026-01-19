import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for toast notifications
 * @returns {Object} - Toast state và functions
 */
export const useToast = () => {
	const [toast, setToast] = useState({
		open: false,
		message: "",
		severity: "success", // 'success' | 'error' | 'warning' | 'info'
		duration: 1500,
	});

	/**
	 * Hiển thị toast notification
	 * @param {string} message - Nội dung thông báo
	 * @param {string} severity - Loại thông báo (success/error/warning/info)
	 */
	const showToast = (message, severity = "success", duration = 1500) => {
		setToast({ open: true, message, severity, duration });
	};

	/**
	 * Hiển thị toast success
	 * @param {string} message - Nội dung thông báo
	 */
	const showSuccess = (message, duration) => {
		showToast(message, "success", duration);
	};

	/**
	 * Hiển thị toast error
	 * @param {string} message - Nội dung thông báo
	 */
	const showError = (message, duration) => {
		showToast(message, "error", duration);
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
		setToast((prev) => ({ ...prev, open: false }));
	};

	// Auto close toast after `duration` milliseconds
	const timeoutRef = useRef();

	useEffect(() => {
		if (toast.open && toast.duration) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setToast((prev) => ({ ...prev, open: false }));
			}, toast.duration);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [toast.open, toast.duration]);

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
