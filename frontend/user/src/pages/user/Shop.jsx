import { Helmet } from "react-helmet-async";
import PageHeader from "../../components/user/Partial/PageHeader";
import ServicesBar from "../../components/user/Partial/ServicesBar";
import ProductOffers from "../../components/user/Partial/ProductOffers";
import ProductBanner from "../../components/user/Partial/ProductBanner";
import ShopPage from "../../components/user/Shop/ShopPage";

export default function Shop() {
	return (
		<>
			<Helmet>
				<title>Shop Page - Electro</title>
			</Helmet>
			<PageHeader />
			<ServicesBar />
			<ProductOffers />
			<ShopPage />
			<ProductBanner />
		</>
	);
}
