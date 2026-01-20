import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import api from "../../services/api";
import { useCart } from "../Cart/CartContext.jsx";
import { useToast } from "@shared/hooks/useToast.js";
import ProductCardGrid from "../Partial/ProductCardGrid";

export default function OurProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { addToCart } = useCart();
	const { toast, showSuccess, closeToast } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		let isActive = true;
		setLoading(true);
		setError("");

		api.get("/products")
			.then((res) => {
				if (!isActive) return;
				setProducts(res.data.data || []);
			})
			.catch((err) => {
				if (!isActive) return;
				console.error("Error fetching products: ", err);
				setError("Không tải được sản phẩm.");
			})
			.finally(() => {
				if (isActive) setLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, []);

	const visibleProducts = useMemo(() => products.slice(0, 8), [products]);

	const handleAddToCart = (product) => {
		addToCart(product, 1);
		showSuccess("Đã thêm vào giỏ hàng");
	};

	const handleViewDetails = (product) => {
		if (product?.slug) {
			navigate(`/${product.slug}`);
		}
	};

	const renderGrid = () => {
		if (loading) {
			return (
				<div className='col-12 text-center py-5'>
					<p>Đang tải sản phẩm...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className='col-12 text-center py-5'>
					<p>{error}</p>
				</div>
			);
		}

		if (visibleProducts.length === 0) {
			return (
				<div className='col-12 text-center py-5'>
					<p>Không có sản phẩm nào.</p>
				</div>
			);
		}

		return visibleProducts.map((product) => (
			<ProductCardGrid
				key={product.id}
				product={product}
				onAddToCart={handleAddToCart}
				onViewDetails={handleViewDetails}
			/>
		));
	};

	return (
		<>
			{/* Our Products Start */}
			<div className='container-fluid product py-5'>
				<div className='container py-5'>
					<div className='tab-className'>
						<div className='row g-4'>
							<div
								className='col-lg-4 text-start wow fadeInLeft'
								data-wow-delay='0.1s'>
								<h1>Sản phẩm của chúng tôi</h1>
							</div>
							<div
								className='col-lg-8 text-end wow fadeInRight'
								data-wow-delay='0.1s'>
								<ul className='nav nav-pills d-inline-flex text-center mb-5'>
									<li className='nav-item mb-4'>
										<a
											className='d-flex mx-2 py-2 bg-light rounded-pill active'
											data-bs-toggle='pill'
											href='#tab-1'>
											<span className='text-dark' style={{ width: "130px" }}>
												Tất cả sản phẩm
											</span>
										</a>
									</li>
									<li className='nav-item mb-4'>
										<a
											className='d-flex py-2 mx-2 bg-light rounded-pill'
											data-bs-toggle='pill'
											href='#tab-2'>
											<span className='text-dark' style={{ width: "130px" }}>
												Hàng mới về
											</span>
										</a>
									</li>
									<li className='nav-item mb-4'>
										<a
											className='d-flex mx-2 py-2 bg-light rounded-pill'
											data-bs-toggle='pill'
											href='#tab-3'>
											<span className='text-dark' style={{ width: "130px" }}>
												Nổi bật
											</span>
										</a>
									</li>
									<li className='nav-item mb-4'>
										<a
											className='d-flex mx-2 py-2 bg-light rounded-pill'
											data-bs-toggle='pill'
											href='#tab-4'>
											<span className='text-dark' style={{ width: "130px" }}>
												Bán chạy
											</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div className='tab-content'>
							<div id='tab-1' className='tab-pane fade show p-0 active'>
								<div className='row g-4'>{renderGrid()}</div>
							</div>
							<div id='tab-2' className='tab-pane fade show p-0'>
								<div className='row g-4'>{renderGrid()}</div>
							</div>
							<div id='tab-3' className='tab-pane fade show p-0'>
								<div className='row g-4'>{renderGrid()}</div>
							</div>
							<div id='tab-4' className='tab-pane fade show p-0'>
								<div className='row g-4'>{renderGrid()}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Our Products End */}
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

