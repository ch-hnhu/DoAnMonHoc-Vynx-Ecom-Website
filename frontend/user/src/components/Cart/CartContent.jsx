import { useEffect, useMemo, useState } from "react";
import Pagination from "../Partial/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { useCart } from "./CartContext.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { getFinalPrice } from "@shared/utils/productHelper.jsx";
import api from "../../services/api";
import { useToast } from "@shared/hooks/useToast";

export default function CartContent() {
	const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
	const navigate = useNavigate();
	const { toast, showError, closeToast } = useToast();

	const total = useMemo(() => subtotal, [subtotal]);
	const [selectedIds, setSelectedIds] = useState(() => new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	// Calculate last page
	const lastPage = Math.ceil(items.length / itemsPerPage);

	// Reset to last page if current page becomes invalid (e.g. after deletion)
	useEffect(() => {
		if (currentPage > lastPage && lastPage > 0) {
			setCurrentPage(lastPage);
		}
	}, [items.length, lastPage, currentPage]);

	// Get current page items
	const currentItems = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return items.slice(start, start + itemsPerPage);
	}, [items, currentPage]);

	const baseUrl = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");

	const handleCheckout = () => {
		if (selectedIds.size === 0) {
			showError("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
			return;
		}
		navigate("/thanh-toan", { state: { selectedIds: Array.from(selectedIds) } });
	};

	const resolveImage = (rawImage) => {
		if (!rawImage) return "/img/product-1.png";

		let normalized = rawImage;
		if (typeof rawImage === "string") {
			try {
				const parsed = JSON.parse(rawImage);
				if (Array.isArray(parsed) && parsed.length > 0) {
					normalized = parsed[0];
				}
			} catch {
				// Keep raw string when it is not JSON.
			}
		} else if (Array.isArray(rawImage) && rawImage.length > 0) {
			normalized = rawImage[0];
		}

		if (
			typeof normalized === "string" &&
			(/^https?:\/\//i.test(normalized) || normalized.startsWith("data:"))
		) {
			return normalized;
		}

		if (typeof normalized === "string" && normalized.startsWith("/")) {
			return baseUrl ? `${baseUrl}${normalized}` : normalized;
		}

		return baseUrl ? `${baseUrl}/${normalized}` : normalized;
	};
	const allSelected = items.length > 0 && selectedIds.size === items.length;
	const selectedCount = selectedIds.size;
	const selectedTotal = useMemo(
		() =>
			items.reduce((sum, item) => {
				if (!selectedIds.has(item.product.id)) return sum;
				return sum + getFinalPrice(item.product) * item.quantity;
			}, 0),
		[items, selectedIds],
	);

	useEffect(() => {
		setSelectedIds((prev) => {
			const next = new Set();
			items.forEach((item) => {
				if (prev.has(item.product.id)) {
					next.add(item.product.id);
				}
			});
			return next;
		});
	}, [items]);

	const toggleAll = (checked) => {
		if (!checked) {
			setSelectedIds(new Set());
			return;
		}
		setSelectedIds(new Set(items.map((item) => item.product.id)));
	};

	const toggleItem = (productId, checked) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (checked) {
				next.add(productId);
			} else {
				next.delete(productId);
			}
			return next;
		});
	};

	if (!items.length) {
		return (
			<div className='container-fluid py-5'>
				<div className='container py-5 text-center'>
					<h4 className='mb-3'>Giỏ hàng đang trống</h4>
					<Link to='/san-pham' className='btn btn-primary rounded-pill px-4 py-3'>
						Tiếp tục mua sắm
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Cart Content */}
			<div className='container-fluid py-5'>
				<div className='container py-5 cart-v2'>
					<div className='cart-v2-card cart-v2-header'>
						<div className='cart-v2-col cart-v2-col-product'>
							<span className='cart-v2-title'>Sản phẩm</span>
						</div>
						<div className='cart-v2-col cart-v2-col-price'>Đơn giá</div>
						<div className='cart-v2-col cart-v2-col-qty'>Số lượng</div>
						<div className='cart-v2-col cart-v2-col-total'>Số tiền</div>
						<div className='cart-v2-col cart-v2-col-action'>Thao tác</div>
					</div>

					<div className='cart-v2-card cart-v2-group'>
						{currentItems.map((item) => {
							const price = getFinalPrice(item.product);
							const image = resolveImage(
								item.product?.image_url || item.product?.image
							);
							return (
								<div key={item.product.id} className='cart-v2-item'>
									<div className='cart-v2-col cart-v2-col-product'>
										<label className='cart-v2-checkbox'>
											<input
												type='checkbox'
												checked={selectedIds.has(item.product.id)}
												onChange={(e) =>
													toggleItem(item.product.id, e.target.checked)
												}
											/>
											<span className='cart-v2-checkmark'></span>
										</label>
										<div className='cart-v2-thumb'>
											<img src={image} alt={item.product.name} />
										</div>
										<div className='cart-v2-info'>
											<Link
												to={`/${item.product.slug}`}
												className='cart-v2-name'>
												{item.product.name}
											</Link>
										</div>
									</div>
									<div className='cart-v2-col cart-v2-col-price'>
										{formatCurrency(price)}
									</div>
									<div className='cart-v2-col cart-v2-col-qty'>
										<div className='input-group quantity cart-v2-qty'>
											<button
												className='btn btn-sm btn-minus rounded-circle bg-light border'
												type='button'
												onClick={() =>
													updateQuantity(item.product.id, item.quantity - 1)
												}>
												<i className='fa fa-minus'></i>
											</button>

											<input
												type='text'
												className='form-control form-control-sm text-center border-0'
												value={item.quantity}
												readOnly
											/>

											<button
												className='btn btn-sm btn-plus rounded-circle bg-light border'
												type='button'
												onClick={() =>
													updateQuantity(item.product.id, item.quantity + 1)
												}>
												<i className='fa fa-plus'></i>
											</button>
										</div>
									</div>
									<div className='cart-v2-col cart-v2-col-total'>
										{formatCurrency(price * item.quantity)}
									</div>
									<div className='cart-v2-col cart-v2-col-action'>
										<button
											className='cart-v2-action-remove'
											type='button'
											onClick={() => removeFromCart(item.product.id)}>
											{"X\u00F3a"}
										</button>
									</div>
								</div>
							);
						})}

						{/* Pagination */}
						{items.length > itemsPerPage && (
							<Pagination
								currentPage={currentPage}
								lastPage={lastPage}
								onPageChange={setCurrentPage}
							/>
						)}

						<div className='cart-v2-row cart-v2-voucher'>
							<span className='cart-v2-voucher-label'>
								{"Voucher c\u1EE7a shop"}
							</span>
							<a href='#' className='cart-v2-voucher-link'>
								{"Xem th\u00EAm voucher"}
							</a>
						</div>

						<div className='cart-v2-row cart-v2-shipping'>
							<span className='cart-v2-shipping-label'>
								{"Gi\u1EA3m ph\u00ED v\u1EADn chuy\u1EC3n v\u1EDBi \u0111\u01A1n t\u1ED1i thi\u1EC3u 0\u0111"}
							</span>
							<a href='#' className='cart-v2-voucher-link'>
								{"T\u00ECm hi\u1EC3u th\u00EAm"}
							</a>
						</div>
					</div>

					<div className='cart-v2-card cart-v2-footer'>
						<div className='cart-v2-footer-left'>
							<label className='cart-v2-checkbox'>
								<input
									type='checkbox'
									checked={allSelected}
									onChange={(e) => toggleAll(e.target.checked)}
								/>
								<span className='cart-v2-checkmark'></span>
							</label>
							<span className='cart-v2-footer-text'>
								{"Ch\u1ECDn t\u1EA5t c\u1EA3"} ({items.length})
							</span>
							<button
								className='cart-v2-footer-action'
								type='button'
								onClick={clearCart}>
								{"X\u00F3a"}
							</button>
							<button className='cart-v2-footer-link' type='button'>
								Lưu vào mục đã thích
							</button>
						</div>
						<div className='cart-v2-footer-right'>
							<div className='cart-v2-summary'>
								<div className='cart-v2-summary-total'>
									{"T\u1ED5ng c\u1ED9ng"} ({selectedCount} {"s\u1EA3n ph\u1EA9m"}):
									<span className='cart-v2-summary-price'>
										{formatCurrency(selectedTotal)}
									</span>
								</div>
								<div className='cart-v2-summary-savings'>{"Ti\u1EBFt ki\u1EC7m 0\u0111"}</div>
							</div>
							<button
								className='btn btn-primary cart-v2-checkout'
								onClick={handleCheckout}>
								Mua hàng
							</button>
						</div>
					</div>
				</div>
			</div>
			<Snackbar
				open={toast.open}
				autoHideDuration={2500}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
}
