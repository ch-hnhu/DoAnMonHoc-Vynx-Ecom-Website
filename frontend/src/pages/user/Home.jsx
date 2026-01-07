import BestsellerProducts from "../../components/user/Home/BestsellerProducts";
import Carousel from "../../components/user/Home/Carousel";
import OurProducts from "../../components/user/Home/OurProducts";
import ProductBanner from "../../components/user/Partial/ProductBanner";
import ProductList from "../../components/user/Home/ProductList";
import ProductOffers from "../../components/user/Partial/ProductOffers";
import ServicesBar from "../../components/user/Partial/ServicesBar";

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
