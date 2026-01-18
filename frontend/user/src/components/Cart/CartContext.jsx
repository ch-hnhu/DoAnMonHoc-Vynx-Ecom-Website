import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFinalPrice } from "@shared/utils/productHelper.jsx";

const CartContext = createContext(null);
const STORAGE_KEY = "vynx_cart";

const loadCart = () => {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

export function CartProvider({ children }) {
	const [items, setItems] = useState(loadCart);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}, [items]);

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
