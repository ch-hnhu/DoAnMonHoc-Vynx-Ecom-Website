import { useState, useEffect } from "react";
import BestsellerProducts from "../components/Home/BestsellerProducts";
import Carousel from "../components/Home/Carousel";
import OurProducts from "../components/Home/OurProducts";
import ProductBanner from "../components/Partial/ProductBanner";
import ProductOffers from "../components/Partial/ProductOffers";
import ServicesBar from "../components/Partial/ServicesBar";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import ProductCarousel from "../components/Partial/ProductCarousel";
import ProductCarousel2 from "../components/Partial/ProductCarousel2";

export default function Home() {
	const title = "TRANG CHỦ";
	const [products, setProducts] = useState([]);
	const [newestProducts, setNewestProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isActive = true;
		setLoading(true);
		setError("");

		// Fetch cả 2 loại products cùng lúc
		Promise.all([
			api.get("/products?per_page=8"),
			api.get("/products?sort=newest&per_page=8")
		])
			.then(([productsRes, newestRes]) => {
				if (!isActive) return;
				setProducts(productsRes.data.data || []);
				setNewestProducts(newestRes.data.data || []);
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

	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<Carousel />
			<ServicesBar />
			<ProductOffers />
			<OurProducts 
				products={products} 
				loading={loading} 
				error={error}
			/>
			<ProductBanner />
			<ProductCarousel 
				products={newestProducts}
				title="Sản phẩm mới nhất"
				description="Khám phá thêm các sản phẩm mới nhất."
			/>
			<ProductCarousel 
				products={newestProducts}
				title="Sản phẩm nổi bật"
				description="Khám phá thêm các sản phẩm mới nhất."
			/>
			<ProductCarousel2
				products={newestProducts}
				title="Trả góp 0%"
				description="Ưu đãi đầu năm"
			/>
			<BestsellerProducts />
		</>
	);
}
