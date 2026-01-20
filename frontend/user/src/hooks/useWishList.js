import { useState, useEffect } from "react";
import { isAuthenticated } from "../services/authService";
import api from "../services/api";

export const useWishList = (productId, showSuccess, showError) => {
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Check authentication và wishlist status
	useEffect(() => {
		const loggedIn = isAuthenticated();
		setIsLoggedIn(loggedIn);

		if (loggedIn && productId) {
			checkInWishlist();
		}
	}, [productId]);

	// Kiểm tra sản phẩm có trong wishlist không
	const checkInWishlist = () => {
		api.get(`/wishlists/check/${productId}`)
			.then((response) => {
				setIsInWishlist(response.data.data.is_in_wishlist);
			})
			.catch((error) => {
				console.error("Error checking wishlist:", error);
				setIsInWishlist(false);
			});
	};

	// Toggle wishlist (thêm/xóa)
	const handleToggleWishlist = (e) => {
		// Prevent event bubbling nếu button nằm trong link
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (!isLoggedIn) {
			showError?.("Vui lòng đăng nhập để sử dụng tính năng này");
			return;
		}

		if (isInWishlist) {
			// Xóa khỏi wishlist
			api.delete(`/wishlists/${productId}`)
				.then(() => {
					setIsInWishlist(false);
					showSuccess?.("Đã xóa khỏi danh sách yêu thích");
				})
				.catch((error) => {
					console.error("Error removing from wishlist:", error);
					showError?.("Lỗi khi xóa khỏi danh sách yêu thích");
				});
		} else {
			// Thêm vào wishlist
			api.post(`/wishlists/`, { product_id: productId })
				.then(() => {
					setIsInWishlist(true);
					showSuccess?.("Đã thêm vào danh sách yêu thích");
				})
				.catch((error) => {
					console.error("Error adding to wishlist:", error);
					showError?.("Lỗi khi thêm vào danh sách yêu thích");
				});
		}
	};

	return {
		isInWishlist,
		isLoggedIn,
		handleToggleWishlist,
	};
};
