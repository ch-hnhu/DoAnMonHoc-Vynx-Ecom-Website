import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { isAuthenticated } from "../../services/authService";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
	const [wishlistCount, setWishlistCount] = useState(0);

	const fetchWishlistCount = useCallback(() => {
		if (!isAuthenticated()) {
			setWishlistCount(0);
			return;
		}
		api.get("/wishlists")
			.then((res) => {
				setWishlistCount(res.data.data?.length || 0);
			})
			.catch((err) => {
				console.error("Error fetching wishlist count:", err);
				setWishlistCount(0);
			});
	}, []);

	useEffect(() => {
		fetchWishlistCount();

		// Optional: listen to auth changes like CartContext does
		const handleAuthChange = () => {
			fetchWishlistCount();
		};
		window.addEventListener("auth:changed", handleAuthChange);
		return () => {
			window.removeEventListener("auth:changed", handleAuthChange);
		};
	}, [fetchWishlistCount]);

	const updateWishlistCount = () => {
		fetchWishlistCount();
	};

	const value = {
		wishlistCount,
		updateWishlistCount,
	};

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error("useWishlist must be used within WishlistProvider");
	}
	return context;
}
