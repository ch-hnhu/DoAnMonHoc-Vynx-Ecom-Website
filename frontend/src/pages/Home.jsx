import BestsellerProducts from "../components/home/BestsellerProducts";
import Carousel from "../components/home/Carousel";
import OurProducts from "../components/home/OurProducts";
import ProductBanner from "../components/home/ProductBanner";
import ProductList from "../components/home/ProductList";
import ProductOffers from "../components/home/ProductOffers";
import ServicesBar from "../components/home/ServicesBar";

export default function Home() {
	return (
		<>
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
