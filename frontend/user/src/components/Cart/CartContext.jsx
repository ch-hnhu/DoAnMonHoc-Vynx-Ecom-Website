import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getFinalPrice } from "@shared/utils/productHelper.jsx";
import { getUser } from "../../services/authService.js";

const CartContext = createContext(null);
const CART_KEY_PREFIX = "vynx_cart";
const CART_RESET_KEY = "cart_reset";
const USER_STORAGE_KEY = "user_data";

const getStorageKey = () => {
	const user = getUser();
	return user?.id ? `${CART_KEY_PREFIX}_${user.id}` : `${CART_KEY_PREFIX}_guest`;
};

const clearCartStorage = () => {
	if (typeof window === "undefined") return;
	try {
		const guestKey = `${CART_KEY_PREFIX}_guest`;
		window.localStorage.removeItem(guestKey);
		window.localStorage.removeItem(CART_KEY_PREFIX);
	} catch {
		// Ignore storage errors.
	}
};

const loadCartForKey = (storageKey) => {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(storageKey);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

export function CartProvider({ children }) {
	const [storageKey, setStorageKey] = useState(getStorageKey);
	const [items, setItems] = useState(() => loadCartForKey(getStorageKey()));
	const lastLoadedKeyRef = useRef(storageKey);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.localStorage.getItem(CART_RESET_KEY) === "1") {
			clearCartStorage();
			window.localStorage.removeItem(CART_RESET_KEY);
			const freshKey = getStorageKey();
			setStorageKey(freshKey);
			lastLoadedKeyRef.current = freshKey;
			setItems(loadCartForKey(freshKey));
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (lastLoadedKeyRef.current !== storageKey) return;
		window.localStorage.setItem(storageKey, JSON.stringify(items));
	}, [items, storageKey]);

	useEffect(() => {
		const nextItems = loadCartForKey(storageKey);
		lastLoadedKeyRef.current = storageKey;
		setItems(nextItems);
	}, [storageKey]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleAuthChange = () => {
			const nextKey = getStorageKey();
			if (nextKey === `${CART_KEY_PREFIX}_guest`) {
				window.localStorage.removeItem(nextKey);
				setItems([]);
				setStorageKey(nextKey);
				lastLoadedKeyRef.current = nextKey;
				return;
			}
			lastLoadedKeyRef.current = nextKey;
			setItems(loadCartForKey(nextKey));
			setStorageKey(nextKey);
		};
		const handleStorageChange = (event) => {
			if (event.key === USER_STORAGE_KEY) {
				handleAuthChange();
			}
		};

		window.addEventListener("auth:changed", handleAuthChange);
		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("auth:changed", handleAuthChange);
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const addToCart = (product, quantity = 1) => {
		if (!product?.id) return;
		const qty = Number.isFinite(quantity) ? quantity : 1;
		setItems((prev) => {
			const existing = prev.find((item) => item.product.id === product.id);
			if (existing) {
				return prev.map((item) =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + qty }
						: item
				);
			}
			return [...prev, { product, quantity: qty }];
		});
	};
	
	const updateQuantity = (productId, quantity) => {
		const qty = Number(quantity);
		setItems((prev) =>
			prev.map((item) => {
				if (item.product.id !== productId) return item;
				const stock = Number(item.product?.stock_quantity ?? 0);
				const maxQty = stock > 0 ? stock : 1;
				const nextQty = Math.min(Math.max(qty, 1), maxQty);
				return { ...item, quantity: nextQty };
			})
		);
	};

	const removeFromCart = (productId) => {
		setItems((prev) => prev.filter((item) => item.product.id !== productId));
	};

	const clearCart = () => setItems([]);

	const itemCount = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items]
	);

	const subtotal = useMemo(
		() =>
			items.reduce(
				(sum, item) =>
					sum + getFinalPrice(item.product) * item.quantity,
				0
			),
		[items]
	);

	const value = useMemo(
		() => ({
			items,
			addToCart,
			updateQuantity,
			removeFromCart,
			clearCart,
			itemCount,
			subtotal,
		}),
		[items, itemCount, subtotal]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within CartProvider");
	}
	return context;
}
