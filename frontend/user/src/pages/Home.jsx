import BestsellerProducts from "../components/Home/BestsellerProducts";
import Carousel from "../components/Home/Carousel";
import OurProducts from "../components/Home/OurProducts";
import ProductBanner from "../components/Partial/ProductBanner";
import ProductList from "../components/Home/ProductList";
import ProductOffers from "../components/Partial/ProductOffers";
import ServicesBar from "../components/Partial/ServicesBar";
import { Helmet } from "react-helmet-async";

export default function Home() {
	const title = "TRANG CHỦ";
	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<Carousel />
			<ServicesBar />
			<ProductOffers />
			<OurProducts />
			<ProductBanner />
			<ProductList />
			<BestsellerProducts />
		</>
	);
}
