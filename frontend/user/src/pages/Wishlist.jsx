import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { isAuthenticated } from "../services/authService";
import { getProductImage, getFinalPrice, isInStock } from "@shared/utils/productHelper.jsx";
import { formatCurrency } from "@shared/utils/formatHelper.jsx";
import { useToast } from "@shared/hooks/useToast";
import { useCart } from "../components/Cart/CartContext";
import { Snackbar, Alert } from "@mui/material";
import PageHeader from "../components/Partial/PageHeader";

export default function Wishlist() {
	const navigate = useNavigate();
	const { toast, showSuccess, showError, closeToast } = useToast();
	const { addToCart } = useCart();
	const [wishlistItems, setWishlistItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate("/dang-nhap");
			return;
		}
		fetchWishlistItems();
	}, []);

	const fetchWishlistItems = async () => {
		try {
			setLoading(true);
			const response = await api.get("/wishlists");
			setWishlistItems(response.data.data || []);
		} catch (error) {
			console.error("Error fetching wishlist:", error);
			showError("Không thể tải danh sách yêu thích");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveFromWishlist = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?")) return;
		try {
			await api.delete(`/wishlists/${id}`);
			setWishlistItems((prev) => prev.filter((item) => item.product.id !== id));
			showSuccess("Đã xóa sản phẩm khỏi danh sách yêu thích");
		} catch (error) {
			console.error("Error removing from wishlist:", error);
			showError("Lỗi khi xóa sản phẩm");
		}
	};

	const handleAddToCart = (product) => {
		if (isInStock(product)) {
			addToCart(product, 1);
			showSuccess("Đã thêm vào giỏ hàng");
		} else {
			showError("Sản phẩm đã hết hàng");
		}
	};

	const handleClearWishlist = async () => {
		if (!window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?"))
			return;
		try {
			// Xóa lần lượt (hoặc gọi API xóa tất cả nếu có)
			await Promise.all(
				wishlistItems.map((item) => api.delete(`/wishlists/${item.product.id}`)),
			);
			setWishlistItems([]);
			showSuccess("Đã xóa danh sách yêu thích");
		} catch (error) {
			console.error("Error clearing wishlist:", error);
			showError("Lỗi khi xóa danh sách");
		}
	};

	const title = "DANH SÁCH YÊU THÍCH";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Danh sách yêu thích", active: true },
	];

	if (loading) {
		return (
			<div className='container-fluid py-5'>
				<div className='container py-5 text-center'>
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</div>
				</div>
			</div>
		);
	}

	// Custom grid template for Wishlist: Product (User friendly width), Price, Stock, Action
	const gridStyle = {
		display: "grid",
		gridTemplateColumns: "minmax(0, 1.6fr) 0.6fr 0.6fr 0.8fr",
		columnGap: "16px",
		alignItems: "center",
	};

	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<PageHeader title={title} breadcrumbs={breadcrumbs} />

			<div className='container-fluid py-5'>
				<div className='container py-5 cart-v2'>
					{wishlistItems.length === 0 ? (
						<div className='text-center'>
							<h4 className='mb-3'>Danh sách yêu thích đang trống</h4>
							<Link to='/san-pham' className='btn btn-primary rounded-pill px-4 py-3'>
								Tiếp tục mua sắm
							</Link>
						</div>
					) : (
						<>
							<div className='cart-v2-card cart-v2-header' style={gridStyle}>
								<div className='cart-v2-col cart-v2-col-product'>
									<span className='cart-v2-title'>Sản phẩm</span>
								</div>
								<div className='cart-v2-col cart-v2-col-price'>Đơn giá</div>
								<div
									className='cart-v2-col cart-v2-col-qty'
									style={{ justifyContent: "center" }}>
									Tình trạng
								</div>
								<div className='cart-v2-col cart-v2-col-action'>Thao tác</div>
							</div>

							<div className='cart-v2-card cart-v2-group'>
								{wishlistItems.map((item) => {
									const product = item.product;
									const price = getFinalPrice(product);

									return (
										<div
											key={item.id}
											className='cart-v2-item'
											style={gridStyle}>
											<div className='cart-v2-col cart-v2-col-product'>
												<div className='cart-v2-thumb'>
													<img
														src={getProductImage(product.image_url)}
														alt={product.name}
														onError={(e) => {
															e.target.src =
																"https://placehold.co/100";
														}}
													/>
												</div>
												<div className='cart-v2-info'>
													<Link
														to={`/${product.slug}`}
														className='cart-v2-name'>
														{product.name}
													</Link>
												</div>
											</div>
											<div className='cart-v2-col cart-v2-col-price'>
												{formatCurrency(price)}
											</div>
											<div
												className='cart-v2-col cart-v2-col-qty'
												style={{ justifyContent: "center" }}>
												{isInStock(product) ? (
													<span className='text-success fw-bold'>
														Còn hàng
													</span>
												) : (
													<span className='text-danger fw-bold'>
														Hết hàng
													</span>
												)}
											</div>
											<div
												className='cart-v2-col cart-v2-col-action'
												style={{ flexDirection: "row", gap: "10px" }}>
												<button
													className='btn btn-sm btn-outline-primary rounded-pill'
													onClick={() => handleAddToCart(product)}
													title='Thêm vào giỏ hàng'>
													<i className='fa fa-shopping-cart'></i>
												</button>
												<button
													className='cart-v2-action-remove'
													type='button'
													onClick={() =>
														handleRemoveFromWishlist(product.id)
													}
													title='Xóa khỏi danh sách'>
													Xóa
												</button>
											</div>
										</div>
									);
								})}
							</div>

							<div className='cart-v2-card cart-v2-footer'>
								<div className='cart-v2-footer-left'>
									<button
										className='cart-v2-footer-action text-danger'
										type='button'
										onClick={handleClearWishlist}>
										Xóa tất cả
									</button>
								</div>
								<div className='cart-v2-footer-right'>
									<Link
										to='/san-pham'
										className='btn btn-primary cart-v2-checkout'>
										Tiếp tục mua sắm
									</Link>
								</div>
							</div>
						</>
					)}
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
