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
	const [promotionProducts, setPromotionProducts] = useState([]);
	const [bestsellerProducts, setBestsellerProducts] = useState([]);
	const [newestProducts, setNewestProducts] = useState([]);
	const [laptopProducts, setLaptopProducts] = useState([]);
	const [accessoryProducts, setAccessoryProducts] = useState([]);
	const [componentProducts, setComponentProducts] = useState([]);

	useEffect(() => {
		let isActive = true;

		Promise.all([
			api.get("/products?has_promotion=1&per_page=8"),
			api.get("/products?sort=bestseller&per_page=8"),
			api.get("/products?sort=newest&per_page=8"),
			api.get("/products?category_slug=laptop&per_page=8"),
			api.get("/products?category_slug=phu-kien&per_page=8"),
			api.get("/products?category_slug=linh-kien-may-tinh&per_page=8"),
		])
			.then(
				([
					promotionRes,
					bestsellerRes,
					newestRes,
					laptopRes,
					accessoryRes,
					componentRes,
				]) => {
					if (!isActive) return;
					setPromotionProducts(promotionRes.data.data || []);
					setBestsellerProducts(bestsellerRes.data.data || []);
					setNewestProducts(newestRes.data.data || []);
					setLaptopProducts(laptopRes.data.data || []);
					setAccessoryProducts(accessoryRes.data.data || []);
					setComponentProducts(componentRes.data.data || []);
				},
			)
			.catch((err) => {
				if (!isActive) return;
				console.error("Error fetching products: ", err);
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
			<ProductCarousel2
				products={promotionProducts}
				title='Deal hời'
				description='Ưu đãi cực sốc'
			/>
			<ProductCarousel
				products={newestProducts}
				title='Hàng mới về'
				description='Khám phá thêm các sản phẩm mới nhất.'
			/>
			<ProductBanner />
			<ProductCarousel2
				products={bestsellerProducts}
				title='Best Seller'
				description='Sản phẩm bán chạy'
			/>
			<ProductCarousel
				products={laptopProducts}
				title='Laptop'
				description='Khám phá thêm các sản phẩm laptop với đủ mọi cấu hình.'
			/>
			<ProductCarousel
				products={accessoryProducts}
				title='Phụ kiện'
				description='Khám phá thêm các sản phẩm phụ kiện cực chất.'
			/>
			<ProductCarousel
				products={componentProducts}
				title='Linh kiện'
				description='Khám phá thêm các sản phẩm linh kiện từ các thương hiệu nổi tiếng.'
			/>
		</>
	);
}
